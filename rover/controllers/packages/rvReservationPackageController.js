sntRover.controller('RVReservationPackageController', [
	'$scope',
	'$rootScope',
	'RVReservationPackageSrv',
	'$state',
	'$timeout',
	'ngDialog',
	'RVReservationStateService',
	function(
		$scope,
		$rootScope,
		RVReservationPackageSrv,
		$state,
		$timeout,
		ngDialog,
		RVReservationStateService
	) {
		var reservationId = $scope.reservationData.reservation_card.reservation_id,
			shouldReloadState = false;
			
		var successCallBack = function(data) {
			$scope.$emit('hideLoader');
			$scope.packageData = data;
			angular.forEach($scope.packageData.existing_packages, function(item) {
				item.totalAmount = (item.addon_count) * (item.amount);
			});
		};

		$scope.setScroller('resultDetails', {
			'click': true
		});

		$scope.invokeApi(RVReservationPackageSrv.getReservationPackages, reservationId, successCallBack);
				
		$scope.closeAddOnPopup = function() {
			$rootScope.modalOpened = false;
			$timeout(function() {
				if (shouldReloadState) {
					$state.reload($state.current.name);
				}

				$scope.closeThisDialog();
			}, 300);
		};

		$scope.goToAddons = function() {
			$scope.closeThisDialog();
			$state.go('rover.reservation.staycard.mainCard.addons', {
				'from_date': $scope.reservation.reservation_card.arrival_date,
				'to_date': $scope.reservation.reservation_card.departure_date,
				'is_active': true,
				'is_not_rate_only': true,
				'from_screen': 'staycard'
			});
		};

		$scope.removeSelectedAddons = function(addonId, index) {
			var successDelete = function() {
				$scope.$emit('hideLoader');
				$scope.packageData.existing_packages.splice(index, 1);
				$scope.addonsData.existingAddons.splice(index, 1);
				$scope.reservationData.reservation_card.package_count = parseInt($scope.reservationData.reservation_card.package_count) - parseInt(1);
				$scope.refreshScroller('resultDetails');

				if ($scope.reservationData.reservation_card.package_count === 0) {
					$scope.reservationData.reservation_card.is_package_exist = false;
				}

				shouldReloadState = true;
			};

			var failureCallback = function(errorData) {
				$scope.errorMessage = errorData;
			};

			var dataToApi = {
				"postData": {
					"addons": [addonId] 
				},
				"reservationId": reservationId
			};

			$scope.invokeApi(RVReservationPackageSrv.deleteAddonsFromReservation, dataToApi, successDelete, failureCallback);
		};

        $scope.getAddonCount = function(
			amountType,
			postType,
			postingRhythm,
			numAdults,
			numChildren,
			numNights,
			chargeFullWeeksOnly,
			quantity
		) {
			var getPostingRhythm = function(postingRhythm, postType) {
				if (postingRhythm) {
					return postingRhythm;
				}

				switch (postType) {
					case 'WEEK':
					case 'WEEKLY':
						return 7;
					case 'STAY':
						return 1;
					case 'NIGHT':
						return 0;
				}
			};

            var addonCount = RVReservationStateService.getApplicableAddonsCount(
            	amountType.toUpperCase(),
				postType,
				getPostingRhythm(postingRhythm, postType),
				numAdults,
				numChildren,
				numNights,
				chargeFullWeeksOnly
			);

            return addonCount * quantity;
        };
	}
]);