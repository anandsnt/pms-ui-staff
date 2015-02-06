sntRover.controller('RVReservationPackageController',
				 ['$scope', 
				  '$rootScope',
				  'RVReservationPackageSrv',
				function($scope, 
					$rootScope,
					RVReservationPackageSrv) {

	var reservationId = $scope.reservationData.reservation_card.reservation_id;
	var successCallBack = function(data){
		$scope.$emit('hideLoader');
		$scope.packageData = data;
		angular.forEach($scope.packageData.existing_packages,function(item, index) {
           item.totalAmount = (item.count)*(item.price_per_piece);
  		});
	};
	$scope.invokeApi(RVReservationPackageSrv.getReservationPackages, reservationId, successCallBack);

}

]);