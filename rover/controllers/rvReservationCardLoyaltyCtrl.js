sntRover.controller('rvReservationCardLoyaltyController',[ '$rootScope','$scope', 'ngDialog',  function($rootScope, $scope, ngDialog){
	BaseCtrl.call(this, $scope);
	
	$scope.showSelectedLoyalty = function(){
		var display = true;
		var selectedLoyalty = $scope.$parent.reservationData.reservation_card.loyalty_level.selectedLoyalty;
		if(selectedLoyalty == null || typeof selectedLoyalty == 'undefined' || selectedLoyalty == '' || selectedLoyalty =={}){
			display = false;
		}
		return display;
	};
	$scope.showLoyaltyProgramDialog = function () {
            	            
						ngDialog.open({
                			template: '/assets/partials/reservationCard/rvAddLoyaltyProgramDialog.html',
               				controller: 'rvAddLoyaltyProgramController',
                			className: 'ngdialog-theme-default',
                			scope: $scope
            			});
						
                
            
        };
	
}]);