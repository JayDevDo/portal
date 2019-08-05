app = angular.module('cvngjs');

app.factory("cvService", 
            ( $rootScope, $filter, $http )=>{ 
                let msg = "enter/started cvService factory from return";
                console.log(msg);
                return  { 
                    msg
                }
            }
)