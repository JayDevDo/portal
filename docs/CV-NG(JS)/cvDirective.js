angular.module('cvngJS')

    .directive('cvJobs', cvJobs);
    
    cvJobs.$inject = ['$compile'];

    function cvJobs($compile) {
        return {
                templateNamespace: 'svg',
                restrict: 'EAC',
                template: '<svg xmlns="http://www.w3.org/2000/svg" id="{{DartBoardId}}"></svg>',
                replace: true,
                link: function(scope, element, attrs){
                    console.log( "myNodesDirective enter 'myNodes'.link function for tab: " ) ;
                    var mySvg = d3.select(element[0])
                                    .attr("width",  500 )
                                    .attr("height", 500 )
                                        .append("svg")
                                            .attr("x", "1px" )
                                            .attr("y", "1px" )
                                            .attr("width", 500 )
                                            .attr("height",500 )
                                            .attr("fill", "#005C00" )
                                            .attr("id", "cvMain" )
                                            .attr("class", "cvMain" )
                    ;

                        d3.select("cvItems" ).remove();
                        
                        d3.select( ".cvItems" )
                            .append("rect")
                                .attr("x", '0px')
                                .attr("y", '0px') 
                                .attr("width", (ActDim))
                                .attr("height", (ActDim))
                                .attr("id", "cvbg")
                                .attr("fill", "transparent")
                        ;

                        var JDDbSgmntGrp = d3.select( ".cvItems" ).append("g")
                            .attr("id", "cvCanvas")
                            .attr("class", "cvJobSection")
                            .attr("stroke-width", 0)
                            .attr("stroke", "#C0C0C0")
                            .attr("transform", "translate(" + 250 + "," + 250 + ")")
                        ;
				
				function CvItemClick(d,i,e){
					var ClickedItem = d ;
                    console.log( "cvJobs-CvItemClick ClickedSegment: ", ClickedItem );
					scope.cvItemclick( ClickedItem ) ;
				}
	     	}
	}
}
