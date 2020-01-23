sntRover.controller('RVReservationPackageController',
				 ['$scope',
				  '$rootScope',
				  'RVReservationPackageSrv',
				  '$state',
				  '$timeout',
				  '$filter',
				  'ngDialog',
				  'RVReservationStateService',
				function($scope,
					$rootScope,
					RVReservationPackageSrv,
					$state, $timeout, $filter, ngDialog, RVReservationStateService) {

	var reservationId = $scope.reservationData.reservation_card.reservation_id,
		shouldReloadState = false;
		
	var successCallBack = function(data) {
		$scope.$emit('hideLoader');
		$scope.packageData = data;
		angular.forEach($scope.packageData.existing_packages, function(item, index) {
           item.totalAmount = (item.addon_count) * (item.amount);
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
				
	$scope.closeAddOnPopup = function() {
		// to add stjepan's popup showing animation
		$rootScope.modalOpened = false;
		$timeout(function() {
			if (shouldReloadState) {
				$state.reload($state.current.name);
			}
			ngDialog.close();
		}, 300);
	};

	$scope.goToAddons = function() {
		ngDialog.close();
		$state.go('rover.reservation.staycard.mainCard.addons',
		 	{
		 		'from_date': $scope.reservation.reservation_card.arrival_date,
		 		'to_date': $scope.reservation.reservation_card.departure_date,
		 		'is_active': true,
		 		'is_not_rate_only': true,
		 		'from_screen': 'staycard'

		 	});
	};

	$scope.saveAddonPosting = function() {

		var addonPostingSaveSuccess = function(data) {
			$scope.$emit('hideLoader');
		};

		angular.forEach($scope.selectedPurchesedAddon.post_instances, function(item, index) {
                    var postDate = new Date(item.post_date);
                    var day = $scope.daysOfWeek[postDate.getDay()];
                    item.active = $scope.selectedPurchesedAddon.selected_post_days[day];
                });

		var dataToApi = {
			'addon_id': $scope.selectedPurchesedAddon.id,
			'reservation_id': $scope.reservationData.reservation_card.reservation_id,
			'post_instances': $scope.selectedPurchesedAddon.post_instances,
			'start_date': $filter('date')(tzIndependentDate($scope.selectedPurchesedAddon.start_date), $rootScope.dateFormatForAPI),
			'end_date': $filter('date')(tzIndependentDate($scope.selectedPurchesedAddon.end_date), $rootScope.dateFormatForAPI)
		}

		$scope.invokeApi(RVReservationPackageSrv.updateAddonPosting, dataToApi, addonPostingSaveSuccess);
	}


	$scope.removeSelectedAddons = function(addonId, index) {

		var successDelete = function() {
			$scope.$emit('hideLoader');
			$scope.packageData.existing_packages.splice(index, 1);
			$scope.addonsData.existingAddons.splice(index, 1);
			$scope.reservationData.reservation_card.package_count = parseInt($scope.reservationData.reservation_card.package_count) - parseInt(1);
			if ($scope.reservationData.reservation_card.package_count === 0) {
				$scope.reservationData.reservation_card.is_package_exist = false;
			}
			shouldReloadState = true;
		};

		var failureCallback = function(errorData) {
			$scope.errorMessage = errorData;
		};

		var addonArray = [];

		addonArray.push(addonId);
		var dataToApi = {
			"postData": {
				"addons": addonArray
			},

			"reservationId": reservationId
		};

		$scope.invokeApi(RVReservationPackageSrv.deleteAddonsFromReservation, dataToApi, successDelete, failureCallback);
	};

	// Get addon count
        $scope.getAddonCount = function(amountType, postType, postingRythm, numAdults, numChildren, numNights, chargeFullWeeksOnly, quantity) {
            if (!postingRythm) {
                if (postType === 'WEEK') {
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

    $scope.selectPurchasedAddon = function(addon) {
    		if (addon.post_type.value === 'STAY') {
                $scope.selectedPurchesedAddon = addon;
	            $scope.selectedPurchesedAddon.selected_post_days = {};
	            $scope.selectedPurchesedAddon.start_date = $filter('date')($scope.selectedPurchesedAddon.start_date, $rootScope.dateFormat);
	            $scope.selectedPurchesedAddon.end_date = $filter('date')($scope.selectedPurchesedAddon.end_date, $rootScope.dateFormat);
	            $scope.togglePostDaysSelectionForAddon(false);
	            angular.forEach($scope.selectedPurchesedAddon.post_instances, function(item, index) {
	                    if (item.active) {
	                    	var postDate = new Date(item.post_date);
	                    	var day = $scope.daysOfWeek[postDate.getDay()];
	                        $scope.selectedPurchesedAddon.selected_post_days[day] = true;
	                    }
	                });
            } else {
                $scope.errorMessage = ["Custom posting can be configured only for nightly addons"];
                $scope.selectedPurchesedAddon = "";
            }
            

        };

        $scope.shouldShowSelectAllDaysOfWeek = function() {
            var shouldShowSelectAllDaysOfWeek = false;
            angular.forEach($scope.daysOfWeek, function(item, index) {
                    if (!$scope.selectedPurchesedAddon.selected_post_days[item]) {
                        shouldShowSelectAllDaysOfWeek = true;
                    }
                });
            return shouldShowSelectAllDaysOfWeek;
        };

        $scope.shouldShowSelectNoDaysOfWeek = function() {
            var shouldShowSelectNoDaysOfWeek = true;
            angular.forEach($scope.daysOfWeek, function(item, index) {
                    if (!$scope.selectedPurchesedAddon.selected_post_days[item]) {
                        shouldShowSelectNoDaysOfWeek = false;
                    }
                });
            return shouldShowSelectNoDaysOfWeek;
        };

        $scope.togglePostDaysSelectionForAddon = function(select) {
            angular.forEach($scope.daysOfWeek, function(item, index) {
                    $scope.selectedPurchesedAddon.selected_post_days[item] = select;
                });
        }
        $scope.daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        
        var datePicker;
        $scope.clickedOnDatePicker = function(datePickerFor) {
            $scope.datePickerFor = datePickerFor;
            datePicker = ngDialog.open({
                template: '/assets/partials/common/rvDatePicker.html',
                controller: 'RVAddonDatePickerController',
                className: '',
                scope: $scope,
                closeByDocument: true
            });
        };

        $scope.dateSelected = function(dateText) {
        	if ($scope.datePickerFor == 'start_date') {
        		$scope.selectedPurchesedAddon.start_date = $filter('date')(dateText, $rootScope.dateFormat);
            } else {
                $scope.selectedPurchesedAddon.end_date = $filter('date')(dateText, $rootScope.dateFormat);
            }
        };

        $scope.closePopup = function() {
            ngDialog.close();
        };

        $scope.closeCalendar = function() {
            datePicker.close();
        }

}

]);