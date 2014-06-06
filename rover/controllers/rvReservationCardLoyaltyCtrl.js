sntRover.controller('rvReservationCardLoyaltyController',[ '$rootScope','$scope',  function($rootScope, $scope){
	BaseCtrl.call(this, $scope);
	
	$scope.showSelectedLoyalty = function(membershipType){
		var display = false;
		if(membershipType != ''){
			display = true;
		}
		return display;
	};
	
}]);