sntRover.controller('RVReservationPackageController',
				 ['$scope',
				  '$rootScope',
				  'RVReservationPackageSrv',
				  '$state',
				  '$timeout',
				  'ngDialog',
				  'RVReservationStateService',
				function($scope,
					$rootScope,
					RVReservationPackageSrv,
					$state, $timeout, ngDialog, RVReservationStateService) {

	var reservationId = $scope.reservationData.reservation_card.reservation_id;
	var successCallBack = function(data){
		$scope.$emit('hideLoader');
		$scope.packageData = data;
		angular.forEach($scope.packageData.existing_packages,function(item, index) {
           item.totalAmount = (item.addon_count)*(item.amount);
  		});
	};
	$scope.invokeApi(RVReservationPackageSrv.getReservationPackages, reservationId, successCallBack);
	$scope.setScroller('resultDetails', {
			'click': true
		});
	setTimeout(function() {
					$scope.refreshScroller('resultDetails');

				},
				2000);
	$scope.closeAddOnPopup = function(){
		//to add stjepan's popup showing animation
		$rootScope.modalOpened = false;
		$timeout(function(){
			ngDialog.close();
		}, 300);
	};

	$scope.goToAddons = function(){
		$scope.closeAddOnPopup();
		$state.go('rover.reservation.staycard.mainCard.addons',
		 	{
		 		'from_date': $scope.reservation.reservation_card.arrival_date,
		 		'to_date': $scope.reservation.reservation_card.departure_date,
		 		'is_active': true,
		 		'is_not_rate_only': true,
		 		'from_screen': 'staycard'

		 	});
	};


	$scope.removeSelectedAddons = function(addonId, index){

		var successDelete = function(){
			$scope.$emit('hideLoader');
			$scope.packageData.existing_packages.splice(index, 1);
			$scope.addonsData.existingAddons.splice(index, 1);
			$scope.reservationData.reservation_card.package_count = parseInt($scope.reservationData.reservation_card.package_count)-parseInt(1);
			if($scope.reservationData.reservation_card.package_count === 0){
				$scope.reservationData.reservation_card.is_package_exist = false;
				$scope.closeAddOnPopup();
			}
		};
		var addonArray = [];
		addonArray.push(addonId);
		var dataToApi = {
			"postData": {
				"addons":addonArray
			},

			"reservationId": reservationId
		};
		$scope.invokeApi(RVReservationPackageSrv.deleteAddonsFromReservation, dataToApi, successDelete);
	};

	//Get addon count
        $scope.getAddonCount = function(amountType, postType,postingRythm, numAdults, numChildren, numNights, chargeFullWeeksOnly, quantity) {
            if(!postingRythm) {
                if(postType ==='WEEK') {
                    postingRythm = 7;
                } else if (postType === 'STAY') {
                    postingRythm = 1;
                } else if (postType === 'NIGHT') {
                    postingRythm = 0;
                }
            }
            amountType = amountType.toUpperCase();
            var addonCount = RVReservationStateService.getApplicableAddonsCount(amountType, postType, postingRythm, numAdults, numChildren, numNights, chargeFullWeeksOnly);
            return (addonCount * quantity);
        };

}

]);