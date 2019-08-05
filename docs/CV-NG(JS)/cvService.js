app = angular.module('cvngJS');

app.factory("cvService", 
            ( $rootScope, $filter, $http )=>{ 
                console.log("enter cvService factory") ;
                let msg = "started cvService return fuction";
                console.log(msg);
                return  { 
                    msg
                }
            }
)