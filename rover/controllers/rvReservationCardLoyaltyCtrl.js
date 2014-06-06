sntRover.controller('rvReservationCardLoyaltyController',[ '$rootScope','$scope',  function($rootScope, $scope){
	BaseCtrl.call(this, $scope);
	
	$scope.showSelectedLoyalty = function(){
		var display = true;
		var selectedLoyalty = $scope.$parent.reservationData.reservation_card.loyalty_level.selectedLoyalty;
		if(selectedLoyalty == null || typeof selectedLoyalty == 'undefined' || selectedLoyalty == '' || selectedLoyalty =={}){
			display = false;
		}
		return display;
	};
	
}]);