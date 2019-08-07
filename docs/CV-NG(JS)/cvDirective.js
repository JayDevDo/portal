angular.module('cvngjs')
    .directive('cvJobsDrctv', cvJobsDrctv);
    cvJobsDrctv.$inject = ['$compile'];
    function cvJobsDrctv($compile) {
        return {
                restrict: 'EAC',
                templateUrl: 'jobdetail.html',
                replace: true,
                link: function(scope, element, attrs){
                    console.log( "cvJobs directive 'link' enter" ) ;
				    function CvItemClick(d,i,e){
					    var ClickedItem = d ;
                        console.log( "cvJobs-CvItemClick ClickedSegment: ", ClickedItem );
					    scope.cvItemclick( ClickedItem ) ;
				    }
	            }
	    }
    }

angular.module('cvngjs')
    .directive('cvLingosDrctv', cvLingosDrctv);
    cvLingosDrctv.$inject = ['$compile'];
    function cvLingosDrctv($compile) {
        return {
                restrict:   'EAC',
                template:   `
                                <div>
                                    <h3 ng-repeat="lingo in cvAll.languages">
                                        {{ lingo }}
                                    </h3>
                                </div>                
                            `,
                replace: true,
                link: function(scope, element, attrs){
                    console.log( "cvLingo directive 'link' enter" ) ;
                }
        }
    }

angular.module('cvngjs')
    .directive('cvContactDrctv', cvContactDrctv);
    cvContactDrctv.$inject = ['$compile'];
    function cvContactDrctv($compile) {
        return {
                restrict: 'EAC',
                template:   `<div class="jobDetail">
                                <ul>
                                    <li>
                                        <span class="jdHeader">email:</span>
                                        <span class="jdItem">
                                            <a  href="mailto:spamjaydo@gmail.com" 
                                                target="_blank"
                                            >
                                                spamjaydo@gmail.com
                                            </a>
                                        </span>
                                    </li>
                                    <li>
                                        <span class="jdHeader">phone:</span>
                                        <span class="jdItem">by request</span>
                                    </li>
                                    <li>
                                        <span class="jdHeader">pdf:</span>
                                        <span class="jdItem">
                                            <a  href="../CV-JayVanDoormalen.pdf" 
                                                target="_blank"
                                            >
                                                click to download
                                            </a>
                                        </span>
                                    </li>
                                </ul>
                            </div>`,
                replace: true,
                link: function(scope, element, attrs){
                    console.log( "cvContact directive 'link' enter" ) ;
                }
        }
    }

angular.module('cvngjs')
    .directive('cvDomainsDrctv', cvDomainsDrctv);
    cvDomainsDrctv.$inject = ['$compile'];
    function cvDomainsDrctv($compile) {
        return {
                restrict:   'EAC',
                template:   `
                            <h3 ng-repeat="domain in domains"
                                ng-click="fltrByDomain( domain.domain )"
                            >
                                {{ domain.domain }} 
                                    <span>
                                        {{ domain.experience }} (yrs)
                                    </span>
                            </h3>
                            `,
                replace: true,
                link: function(scope, element, attrs){
                    console.log( "cvDomain directive 'link' enter" ) ;
                    scope.domains = [{ "domain": 'jobdom', "experience": 0 }];
                    if( scope.cvAll.jobs ){  
                        scope.domains = [];
                        let jobdom = "";
                        let domainExperience = 0;

                        for(let i=0; i<scope.cvAll.jobDomains.length; i++){
                            jobdom = scope.cvAll.jobDomains[i];
                            // console.log("jobdom each:", jobdom )
                            domainExperience = 0;

                                for(let j=0; j < scope.cvAll.jobs.length; j++){
                                    let jobexp = scope.cvAll.jobs[j].durationMonths;
                                    if( scope.cvAll.jobs[j].jobDomain.includes(jobdom) ){
                                        domainExperience += jobexp;
                                    }
                                }
                            let domainObj = { "domain": (jobdom==="CS")? "Customer Service":jobdom, "experience": ( domainExperience / 12).toFixed(0) }
                            scope.domains.push( domainObj );
                        }
                    }
                }
        }
}

angular.module('cvngjs')
    .directive('cvEducationDrctv', cvEducationDrctv);
    cvEducationDrctv.$inject = ['$compile'];
    function cvEducationDrctv($compile) {
        return {
                restrict:   'EAC',
                template:   `<div>
                                <h3 ng-repeat="edu in cvAll.education">
                                    {{ edu }}
                                </h3>
                            </div>    
                            `,
                replace: true,
                link: function(scope, element, attrs){
                    console.log( "cvEducation directive 'link' enter" ) ;
                }
        }
    }

angular.module('cvngjs')
    .directive('cvLocationsDrctv', cvLocationsDrctv);
    cvLocationsDrctv.$inject = ['$compile'];
    function cvLocationsDrctv($compile) {
        return {
                restrict:   'EAC',
                template:   `<ul>
                                <li class="locationItem"
                                    ng-click="fltrByCountry(key)"
                                    ng-repeat="(key, value) in cvAll.jobLocations"
                                >
                                {{ key }}
                                    <ul>
                                        <li ng-repeat="city in value" >
                                            <span>{{ city }}</span>
                                        </li>
                                    </ul>
                                </li>
                            </ul>    
                            `,
                replace: true,
                link: function(scope, element, attrs){
                    console.log( "cvLocation directive 'link' enter" ) ;
                }
        }
    }


angular.module('cvngjs')
    .directive('cvToolsDrctv', cvToolsDrctv);
    cvToolsDrctv.$inject = ['$compile'];
    function cvToolsDrctv($compile) {
        return {
                restrict:   'EAC',
                template:   `<div class="toolItem" ng-repeat="(key, value) in cvAll.toolsSkills"> 
                                <h3 class="toolHeader">
                                    {{ key }}
                                </h3>
                                <div class="toolDetail">
                                    <ul>
                                        <li ng-repeat="skill in value" >
                                            <span class="jdItem">{{ skill }}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            `,
                replace: true,
                link: function(scope, element, attrs){
                    console.log( "cvTools directive 'link' enter" ) ;
                }
        }
    }