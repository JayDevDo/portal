angular.module('cvngjs')

    .directive('cvJobsDrctv', cvJobsDrctv);

    cvJobsDrctv.$inject = ['$compile'];

    function cvJobsDrctv($compile) {
        return {
                restrict: 'EAC',
                templateUrl: 'jobdetail.html',
                replace: true,
                link: function(scope, element, attrs){
                    console.log( "cvJobs directive 'link' enter" ) ;

                    scope.selectedJob = 0;
                    scope.activeJob = scope.cvAll.jobs[ scope.selectedJob ]; 
				
				    function CvItemClick(d,i,e){
					    var ClickedItem = d ;
                        console.log( "cvJobs-CvItemClick ClickedSegment: ", ClickedItem );
					    scope.cvItemclick( ClickedItem ) ;
				    }
	     	    }
	    }
    }
