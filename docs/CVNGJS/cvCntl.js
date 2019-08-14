let app = angular.module('cvngjs');

app.factory(
    'cvJSONFctr', 
    ( $rootScope, $http )=>{
        if( !$rootScope.httpPromise ){ 
            $rootScope.httpPromise  = $http.get( "../data/cv.json"); 
        }

        // console.log("enter jdLegDartsPFactory (T3)") ;
        return	{
            getAllCVData:	()=>{
                $rootScope.httpPromise.then( 
                    (response)=>{ 
                        $rootScope.CVcntrl.allData = response.data;
                        return response.data; 
                    }
                );
            },

            getSomeCVData: (section)=>{
                $rootScope.httpPromise.then( 
                    (response)=>{ 
                        console.log("response:", section )
                        console.log( response.data[section])
                        $rootScope.CVcntrl.someData = [response.data[section]] ;
                        return response.data[section]; 
                    }
                );            }
        }
    }
);

app.controller('cvJSONCntrl', cvJSONCntrl );
cvJSONCntrl.$inject = ['$scope', '$rootScope', '$http', '$filter' ,'cvJSONFctr'];
function cvJSONCntrl($scope, $rootScope, $http, $filter ,cvJSONFctr) {
    $scope = $rootScope;
        if( !$scope.CVcntrl ){
                $scope.CVcntrl = {
                                    allData:    [],
                                    someData:   [],
                                    getCVAll:   ()=>{ 
                                        let retData =  cvJSONFctr.getAllCVData();
                                        (retData)=>{ $rootScope.CVcntrl.allData = retData; }
                                        return retData;
                                    },
                                    getCVSection: (section)=>{
                                        let retData =  cvJSONFctr.getSomeCVData(section);
                                       console.log("getCVSection: ", section ," retData", retData);
                                        (retData)=>{ $rootScope.CVcntrl.someData = retData; }
                                        return retData;
                                    }
                }
        }
    console.log("$scope.CVcntrl.getCVAll()", $scope.CVcntrl.getCVAll() );
    
    console.log(
        "getCVKey 0", $scope.CVcntrl.getCVSection( "jobDomains" ) , 
        "getCVSection 0", $scope.testArr 
    );

    console.log("exit cvJSONCntrl");
}

