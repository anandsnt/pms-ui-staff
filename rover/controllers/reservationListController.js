sntRover.controller('reservationListController',['$scope', function($scope){
	 console.log("==litsing")
	$scope.$parent.myScrollOptions = {
	    'result_listing': {
	        snap: false,
	        hideScrollbar: false,onScrollEnd: function ()
        	{
            	alert('finshed scrolling wrapper');
    		}
	    },
	};
}]);