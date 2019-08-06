
angular.module('cvngjs')

    .controller('cvInit', cvInit );

    cvInit.$inject = [ '$rootScope', '$scope', '$http', 'cvService', 'cvFactory' ];

        function cvInit( $rootScope, $scope, $http, cvService, cvFactory) { 
        	$scope 	= $rootScope;
            console.log("enter cvInit: arrays loaded from js:", (cv.jobs.length>0) );
            
            $scope.activeTab    =   0;
            $scope.isActTab     =   (tabNr)=>{ return (tabNr === $scope.activeTab);  }
            $scope.tabHandler   =   (tabNr)=>{  $scope.activeTab = tabNr 
                                                console.log("active tab = ", tabNr );    
                                    }

            $scope.activeJob    =   -1;
            $scope.isActJob     =   (jobNr)=>{ return (jobNr === $scope.activeJob);  }
            $scope.jobHandler   =   (jobNr)=>{  // if job is expanded, collapse
                                                (jobNr===$scope.activeJob)? (jobNr = -1):(jobNr=jobNr)
                                                $scope.activeJob = jobNr ;
                                                console.log("active job = ", jobNr );    
                                    }

        }