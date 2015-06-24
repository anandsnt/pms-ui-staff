sntRover.controller('reservationPaymentController',['$scope','$rootScope','rvPermissionSrv', function($scope,$rootScope,rvPermissionSrv){
	$scope.getHasButtonClass = function(status,isCC){
		
		var hasButtonClass = "has-button";
		if(status == 'NOSHOW' || status == 'CHECKEDOUT' || status == 'CANCELED'){
			hasButtonClass = "";
		}
		else if(isCC){
			hasButtonClass = "has-buttons";
		}
		return hasButtonClass;
	
	};
	$scope.displayButton = function(status){
		var display = true;
		if(status == 'NOSHOW' || status == 'CHECKEDOUT' || status == 'CANCELED'){
			display = false;
		}
                //then check if the current user has permission
                if (!$scope.hasPermissionToCreateKeys()){
                    display = false;
                }
		return display;
	
	};
        $scope.hasPermissionToCreateKeys = function() {
			return rvPermissionSrv.getPermissionValue('CREATE_KEY');
		};
	// Update while changing credit card from bill screen.
	$rootScope.$on('UPDATEDPAYMENTLIST', function(event, data) {
			$scope.reservationData.reservation_card.payment_details.card_type_image = data.card_code+".png";
			$scope.reservationData.reservation_card.payment_details.card_number = data.card_number;
			$scope.reservationData.reservation_card.payment_details.card_expiry = data.card_expiry;
			$scope.reservationData.reservation_card.payment_details.is_swiped = data.is_swiped;
	});
}]);