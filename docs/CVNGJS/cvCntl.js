let app = angular.module('cvngjs');

app.factory(
    'cvJSONFctr', 
    ( $rootScope, $http )=>{
        if( !$rootScope.httpPromise ){ 
            $rootScope.httpPromise  = $http.get( "../data/cv.json"); 
        }

        this.retData1 = [];
        this.retData2 = [];

        // console.log("enter jdLegDartsPFactory (T3)") ;
        return	{
                    getAllCVData:	()=>{
                        $rootScope.httpPromise.then( 
                                                (response)=>{ 
                                                    console.log("app.factory('cvJSONFctr'.getAllcvData http success", response );
                                                    $rootScope.CVcntrl.allData = response.data;
                                                    return response.data; 
                                                }
                                            );
                    },

                    getSomeCVData: (section)=>{
                        $rootScope.httpPromise.then( 
                                                (response)=>{ 
                                                    console.log("app.factory('cvJSONFctr'.getSomeCVData ", section ," http success", response.data[section] );
                                                    $rootScope.CVcntrl.someData = response.data[section];
                                                    return response.data[section]; 
                                                }
                                            );
                    }
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
                                (retData)=>{
                                    $rootScope.CVcntrl.allData = retData;
                                        console.log(
                                            "controller log, getCVSection after : ", lr,
                                            "scope.CVcntrl.allData = data", $rootScope.CVcntrl.allData 
                                        )
                                }
                },
                getCVSection:   (section)=>{
                                    let retData =  cvJSONFctr.getSomeCVData(section);
                                    (retData)=>{
                                        $rootScope.CVcntrl.someData = retData;
                                            console.log(
                                                "controller log, getCVSection after : ", lr,
                                                "scope.CVcntrl.someData = data[section]", $rootScope.CVcntrl.someData 
                                            )
                                    }
                }
        }
        
        console.log(
            "cvJSONCntrl endofCVcntrl .getCVAll ", $scope.CVcntrl.getCVAll(), 
            "cvJSONFctr.getAllCVData()", cvJSONFctr.getAllCVData()        
        );

        console.log(
            "cvJSONCntrl endofCVcntrl .getCVSection ", $scope.CVcntrl.getCVSection("jobs"), 
            "cvJSONFctr.getAllCVData()", cvJSONFctr.getSomeCVData("profile")
        );


    }

    console.log("exit cvJSONCntrl") ;
}

