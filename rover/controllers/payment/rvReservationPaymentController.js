sntRover.controller('reservationPaymentController',['$scope', function($scope){
	$scope.getHasButtonClass = function(status){
		
		var hasButtonClass = "has-button";
		if(status == 'NOSHOW' || status == 'CHECKEDOUT' || status == 'CANCELED'){
			hasButtonClass = "";
		}
		return hasButtonClass;
	
	};
	$scope.displayButton = function(status){
		
		var display = true;
		if(status == 'NOSHOW' || status == 'CHECKEDOUT' || status == 'CANCELED'){
			display = false;
		}
		return display;
	
	};
}]);