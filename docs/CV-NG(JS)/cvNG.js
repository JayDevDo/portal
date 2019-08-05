let lr = '\n';

angular.module('cvngJS')

    .controller('cvInit', cvInit );

    jdAppInit.$inject = [ '$rootScope', '$scope','$http', 'cvService', 'cvFactory' ];

        function cvInit( $rootScope, $scope, $http, cvService, cvFactory) { 
        	$scope 	= $rootScope;
        	console.log("enter cvInit: arrays loaded from js:", (cv.length>0) );
        }