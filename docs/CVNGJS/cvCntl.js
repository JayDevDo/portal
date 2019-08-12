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
                                                    this.retData1 = response.data;
                                                    return response.data; 
                                                }
                                            );
                    },

                    getSomeCVData: (section)=>{
                        $rootScope.httpPromise.then( 
                                                (response)=>{ 
                                                    console.log("app.factory('cvJSONFctr'.getSomeCVData http success", response );                                                    
                                                    this.retData2 = response.data[section];
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
                                retData.then(
                                    (data)=>{
                                        $scope.CVcntrl.allData = data;
                                        console.log(
                                            "controller log, getCVSection after : ", lr,
                                            "scope.CVcntrl.allData = data", $scope.CVcntrl.allData 
                                        )
                                    }
                                )
                },
                getCVSection:   (section)=>{
                                        $scope.cvJSONFctr.getSomeCVData(section).then(
                                        (data)=>{
                                            $scope.CVcntrl.someData = data[section];
                                            console.log(
                                                "controller log, getCVSection after : ", lr,
                                                "scope.CVcntrl.someData = data[section]", $scope.CVcntrl.someData 
                                            )
                                        }
                                    )
                }
        }
        
        console.log("cvJSONCntrl endofCVcntrl .getCVAll ", $scope.CVcntrl.getCVAll() );
    }

    console.log("exit cvJSONCntrl") ;
}

