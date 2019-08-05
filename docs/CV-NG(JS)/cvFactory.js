angular.module('cvngJS')

    .factory( 'cvFactory', 
        function($rootScope, $http, $filter) {
            $rootScope.cvAll = cv;
            $rootScope.cvAllLen = $rootScope.cvAll.length ;
            
            console.log( "enter cvFactory, cvAll len: ", $rootScope.cvAllLen );

            return  {
                        jdscorescntr:	()=>{ 
                                            // returns an empty scores container object
                                                let crcnt = " " ;
                                                return crcnt ;
                                        },
                        getCVSection: 	(section)=>{ 
                                            // returns one of the CV sections
                                                let cvSection = $rootScope.cvAll[section]; 
                                                console.log("factory cvFactory - section: ",section,"returns: ",cvSection );
                                                return cvSection;
                                        }
            } // End of return ...
	    } // end of function($rootScope, $http, $filter, cvService) ...
 ); // End of .factory