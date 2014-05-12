sntRover.controller('reservationActionsController',[ '$rootScope','$scope',  function($rootScope, $scope){
	BaseCtrl.call(this, $scope);
	
	$scope.displayTime = function(status){
		var display = false;
		if(status == 'CHECKEDIN' || status == 'CHECKING_OUT'){
			display = true;
		}
		return display;
	};
	$scope.displayBalance = function(status){
		var display = false;
		if(status == 'CHECKING_IN' || status == 'CHECKEDIN' || status == 'CHECKING_OUT'){
			display = true;
		}
		return display;
	};
	$scope.getBalanceAmountColor = function(balance){
		var balanceClass = "";
		if(balance == 0 || balance == 0.00 || balance == 0.0){
			balanceClass = "green";
		} else {
			balanceClass = "red";
		}
		return balanceClass;
	};
	
	$scope.displayAddon = function(status){
		var display = false;
		if(status == 'RESERVED' || status == 'CHECKING_IN' || status == 'CHECKEDIN' || status == 'CHECKING_OUT'){
			display = true;
		}
		return display;
	};
	
	$scope.displayAddCharge = function(status){
		var display = false;
		
		if(status == 'RESERVED' || status == 'CHECKING_IN' || status == 'CHECKEDIN' || status == 'CHECKING_OUT' || status == 'NOSHOW_CURRENT'){
			display = true;
		}
		return display;
	};
	
	$scope.displayArrivalTime = function(status){
		var display = false;
		if(status == 'CHECKING_IN' || status == 'NOSHOW_CURRENT' ){
			display = true;
		}
		return display;
	};
	
}]);