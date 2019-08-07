
angular.module('cvngjs')
    .controller('cvInit', cvInit );
    cvInit.$inject = [ '$rootScope', '$scope', '$http', 'cvService', 'cvFactory' ];

        function cvInit( $rootScope, $scope, $http, cvService, cvFactory){ 
        	$scope 	= $rootScope;
            console.log("enter cvInit: arrays loaded from js:", (cv.jobs.length>0) );
            
            $scope.activeTab    =   0;
            $scope.isActTab     =   (tabNr)=>{ return (tabNr === $scope.activeTab);  }
            $scope.tabHandler   =   (tabNr)=>{  $scope.activeTab = tabNr 
                                                // console.log("active tab = ", tabNr );    
            }
            $scope.activeJob    =   -1;
            $scope.isActJob     =   (jobNr)=>{ return (jobNr === $scope.activeJob);  }
            $scope.jobHandler   =   (jobNr)=>{  // if job is expanded, collapse
                                                (jobNr===$scope.activeJob)? (jobNr = -1):(jobNr=jobNr)
                                                $scope.activeJob = jobNr ;
                                                // console.log("active job = ", jobNr );    
            }
            $scope.jobFilter    = (jobId)=>{ return $scope.fltrArr[jobId] } 
            $scope.fltrArr      =  [ true, true, true, true, true, true, true, true, true, true, true, true, true ];
            $scope.fltrRes      =   {
                                        "active":   false,
                                        "key":      {"srchKey": 'none', "value": ''},
                                        "found":    0                
            }
            $scope.clearFilter = ()=>{ 
                                        $scope.fltrRes = {
                                                            "active": false,
                                                            "key": {"srchKey": 'none', "value": ''},
                                                            "found": 0                
                                        }
                                        $scope.fltrArr = [ true, true, true, true, true, true, true, true, true, true, true, true, true ];
            }
            $scope.fltrByDomain =   (domain)=>{
                                        console.log("fn fltrByDomain called", domain);
                                        $scope.clearFilter();
                                        if( domain==="Customer Service"){ domain="CS" }
                                        $scope.fltrRes.key.srchKey   = "job Domain";
                                        $scope.fltrRes.key.value     = domain;
                                        $scope.fltrRes.active        = true;
                                        $scope.fltrRes.found         = 0;
                                        for(let i=0; i<$scope.cvAll.jobs.length ;i++){
                                            let jDomain = $scope.cvAll.jobs[i].jobDomain;
                                                if( jDomain.includes(domain) ){ 
                                                    $scope.fltrArr[i] = true;
                                                    $scope.fltrRes.found++ ;
                                                }else{
                                                    $scope.fltrArr[i] = false;
                                                }
                                        }
                                        console.log("$scope.fltrArr:", $scope.fltrArr, lr, "$scope.fltrRes:", $scope.fltrRes );
                                        $scope.tabHandler(1);    
            }
            $scope.fltrByCountry =   (loc)=>{
                console.log("fn fltrByCountry called", loc );
                $scope.clearFilter();
                $scope.fltrRes.key.srchKey   = "Country";
                $scope.fltrRes.key.value     = loc ;
                $scope.fltrRes.active        = true;
                $scope.fltrRes.found         = 0;
                for(let i=0; i<$scope.cvAll.jobs.length ;i++){
                    let jLoc = $scope.cvAll.jobs[i].countryAndlocation;
                        if( jLoc.includes(loc) ){ 
                            $scope.fltrArr[i] = true;
                            $scope.fltrRes.found++ ;
                        }else{
                            $scope.fltrArr[i] = false;
                        }
                }
                console.log("$scope.fltrArr:", $scope.fltrArr, lr, "$scope.fltrRes:", $scope.fltrRes );
                $scope.tabHandler(1);
            }

        }