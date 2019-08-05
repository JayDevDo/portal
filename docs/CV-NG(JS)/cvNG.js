
angular.module('cvngjs')

    .controller('cvInit', cvInit );

    cvInit.$inject = [ '$rootScope', '$scope', '$http', 'cvService', 'cvFactory' ];

        function cvInit( $rootScope, $scope, $http, cvService, cvFactory) { 
        	$scope 	= $rootScope;
        	console.log("enter cvInit: arrays loaded from js:", (cv.jobs.length>0) );
        }