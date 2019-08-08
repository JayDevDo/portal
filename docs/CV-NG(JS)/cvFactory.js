angular.module('cvngjs')

    .factory( 'cvFactory', 
        function($rootScope, $http, $filter) {
            $rootScope.cvAll = cv;
            $rootScope.cvAllLen = $rootScope.cvAll.jobs.length ;
            // trying to figure out where the json resides in the github tree
            $rootScope.jsonResArr = [];

            function locateJson(){
                let locArray = [
                    "cv.json",          // same dir
                    "../cv.json",       // master/docs
                    "../data/cv.json"   // master/docs/data
                ];
                
                for(i=0;i<3;i++){
                    let tryNr = i;
                    let tryloc = locArray[i];
                    let tryObj =    {  
                                        nr: tryNr, 
                                        loc: tryloc,
                                        status: "", 
                                        data: {} 
                                    }

                    $http.get(tryloc)
                        .then(function(response) {
                            tryObj.data     = response.data;
                            tryObj.status   = "success?"
                        })
                        .catch(function(response) {
                            tryObj.data     = response.data;
                            tryObj.status   = "error:" + response.status;
                        })
                        .finally(function() {
                            console.log("finally finished gists");
                            $rootScope.jsonResArr.push( tryObj );
                        });
                }
                return $rootScope.jsonResArr;
            }

            console.log("starting locate json:", locateJson() )

            console.log( 
                "enter cvFactory, cvAll len: ", $rootScope.cvAllLen, lr,
                "cv len", cv.jobs.length
            );

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
            }
	    }
 ); 