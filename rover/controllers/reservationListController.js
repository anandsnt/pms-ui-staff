sntRover.controller('reservationListController',['$scope', function($scope){
	$scope.$parent.myScrollOptions = {
	    'resultListing': {
	        snap: false,
	        scrollbars: true,
	        hideScrollbar: false
	    },
	};
}]);