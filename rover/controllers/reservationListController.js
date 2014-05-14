sntRover.controller('reservationListController',['$scope', function($scope){
	$scope.$parent.myScrollOptions = {
	    'resultListing': {
	        snap: false,
	        scrollbars: true,
	        hideScrollbar: false
	    },
	};
	
	$scope.$on('RESERVATIONLISTUPDATED', function(event) {
		setTimeout(function(){
			$scope.$parent.myScroll['resultListing'].refresh();
			}, 
		500);
		
	});
}]);