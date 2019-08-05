app = angular.module('cvngJS');

app.factory("cvService", 
    ($rootScope, $filter, $http )=>{ 
        console.log("enter cvService factory") ;

    return  {
        console.log("started cvService return fuction")
    }
})
