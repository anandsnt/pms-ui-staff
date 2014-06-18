
sntRover.controller('RVRoomFiltersController',['$scope','$state', '$stateParams', 'RVRoomAssignmentSrv', function($scope, $state, $stateParams, RVRoomAssignmentSrv){
	
	BaseCtrl.call(this, $scope);
	
	$scope.$parent.myScrollOptions = {		
	    'filterlist': {
	    	scrollbars: true,
	        snap: false,
	        hideScrollbar: false,
	        preventDefault: false
	    }
	};
	setTimeout(function(){
				$scope.$parent.myScroll['filterlist'].refresh();
				}, 
			30000);
	
	
}]);