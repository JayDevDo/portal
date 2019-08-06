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
                restrict: 'EAC',
                template: '<div><h3 ng-repeat="lingo in cvAll.languages">{{ lingo }}</h3></div>',
                replace: true,
                link: function(scope, element, attrs){
                    console.log( "cvLingo directive 'link' enter" ) ;
                }
        }
    }

    angular.module('cvngjs')
    .directive('cvDomainsDrctv', cvDomainsDrctv);
    cvDomainsDrctv.$inject = ['$compile'];
    function cvDomainsDrctv($compile) {
        return {
                restrict: 'EAC',
                template: '<h3 ng-repeat="domain in domains">{{ domain.domain }} <span>{{ domain.experience }} (yrs)</span></h3>',
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
                            console.log("jobdom each:", jobdom )
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