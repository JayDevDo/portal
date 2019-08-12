let app = angular.module('cvngjs');

app.factory(
    'cvJSONFctr', 
    ($rootScope,$http)=>{
        // console.log("enter jdLegDartsPFactory (T3)") ;
        return	{
                    getAllCVData:	()=>{
                                        $http.get("../data/cv.json")
                                            .success( 
                                                (response)=>{ 
                                                    console.log("app.factory('cvJSONFctr'.getAllcvData http success", response );
                                                    return response.data; 
                                                }
                                            );
                    },

                    getSomeCVData: (section)=>{
                                        $http.get("../data/cv.json")
                                            .success( 
                                                (response)=>{ 
                                                    console.log("app.factory('cvJSONFctr'.getSomeCVData http success", response );                                                    
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
	$scope = $rootScope.CVcntrl ;
    //	console.log('valBOS: ' + valBOS  +  ' | valBOL: ' + valBOL );
    $scope.CVcntrl.allData = [];
    $scope.CVcntrl.getCVAll =   ()=>{ 
                                        cvJSONFctr.getAllCVData().then(
                                            (data)=>{
                                                $scope.CVcntrl.allData = data;
                                                console.log(
                                                    "controller log, getCVSection after : ", lr,
                                                    "scope.CVcntrl.allData = data", $scope.CVcntrl.allData 
                                                )
                                            }
                                        )
                                    }
                                    
    $scope.CVcntrl.someData = [];
    $scope.CVcntrl.getCVSection = (section)=>{
            cvJSONFctr.getSomeCVData(section).then(
                (data)=>{
                    $scope.CVcntrl.someData = data[section];
                    console.log(
                        "controller log, getCVSection after : ", lr,
                        "scope.CVcntrl.someData = data[section]", $scope.CVcntrl.someData 
                    )
                }
            )
        }
 console.log("exit cvJSONCntrl") ;
}

