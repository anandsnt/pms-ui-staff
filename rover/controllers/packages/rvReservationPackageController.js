sntRover.controller('RVReservationPackageController',
				 ['$scope', 
				  '$rootScope',
				  'RVReservationPackageSrv',
				  '$state',
				function($scope, 
					$rootScope,
					RVReservationPackageSrv,
					$state) {

	var reservationId = $scope.reservationData.reservation_card.reservation_id;
	var successCallBack = function(data){
		$scope.$emit('hideLoader');
		$scope.packageData = data;
		angular.forEach($scope.packageData.existing_packages,function(item, index) {
           item.totalAmount = (item.count)*(item.price_per_piece);
  		});
	};
	//console.log($scope);
	$scope.invokeApi(RVReservationPackageSrv.getReservationPackages, reservationId, successCallBack);
	$scope.setScroller('resultDetails', {
			'click': true
		});
	setTimeout(function() {
					$scope.refreshScroller('resultDetails');
					
				},
				2000);

	
	$scope.goToAddons = function(){
		$scope.closeDialog();
		 $state.go('rover.reservation.staycard.mainCard.addons',
		 	{
		 		'from_date': $scope.reservation.reservation_card.arrival_date,
		 		'to_date': $scope.reservation.reservation_card.departure_date,
		 		'is_active': true,
		 		'is_not_rate_only': true,
		 		'from_screen': 'staycard'

		 	});
	};

	$scope.removeSelectedAddons = function(addonId){

	};

}

]);