sntRover.controller('RVReservationPackageController',
				 ['$scope',
				  '$rootScope',
				  '$state',
				  '$timeout',
				  '$filter',
				  'ngDialog',
				  'RVReservationStateService',
				function($scope,
					$rootScope,
					$state, $timeout, $filter, ngDialog, RVReservationStateService) {

		var shouldReloadState = false;
			
		$scope.setScroller('resultDetails', {
				'click': true
		});
		setTimeout(function() {
			$scope.refreshScroller('resultDetails');
		}, 2000);
					
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
			$scope.errorMessage = [];
			if (!$rootScope.featureToggles.addons_custom_posting) {
				return;
			} else if (addon.post_type.value === 'STAY') {
				$scope.selectedPurchesedAddon = addon;
				$scope.selectedPurchesedAddon.selected_post_days = {};
				$scope.selectedPurchesedAddon.start_date = $filter('date')($scope.selectedPurchesedAddon.start_date, $rootScope.dateFormat);
				$scope.selectedPurchesedAddon.end_date = $filter('date')($scope.selectedPurchesedAddon.end_date, $rootScope.dateFormat);
				$scope.togglePostDaysSelectionForAddon(false);
				angular.forEach($scope.selectedPurchesedAddon.post_instances, function(item) {
						if (item.active) {
							var postDate = new Date(item.post_date),
							day = $scope.daysOfWeek[postDate.getDay()];

							$scope.selectedPurchesedAddon.selected_post_days[day] = true;
						}
					});
			} else {
				$scope.errorMessage = ["Custom posting can be configured only for nightly addons"];
				$scope.selectedPurchesedAddon = "";
			}
			

		};

		$scope.showCustomPosting = function() {
			return $rootScope.featureToggles.addons_custom_posting && ['allotments', 'groups'].indexOf($scope.addonPopUpData.addonPostingMode) === -1;
		};

		$scope.shouldShowSelectAllDaysOfWeek = function() {
			var shouldShowSelectAllDaysOfWeek = false;

			angular.forEach($scope.daysOfWeek, function(item) {
					if (!$scope.selectedPurchesedAddon.selected_post_days[item]) {
						shouldShowSelectAllDaysOfWeek = true;
					}
				});
			return shouldShowSelectAllDaysOfWeek;
		};

		$scope.shouldShowSelectNoDaysOfWeek = function() {
			var shouldShowSelectNoDaysOfWeek = true;
			
			angular.forEach($scope.daysOfWeek, function(item) {
					if (!$scope.selectedPurchesedAddon.selected_post_days[item]) {
						shouldShowSelectNoDaysOfWeek = false;
					}
				});
			return shouldShowSelectNoDaysOfWeek;
		};

		$scope.togglePostDaysSelectionForAddon = function(select) {
			angular.forEach($scope.daysOfWeek, function(item) {
				$scope.selectedPurchesedAddon.selected_post_days[item] = select;
			});
		};
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
			if ($scope.datePickerFor === 'start_date') {
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
		};

		$scope.goToAddons = function() {
			$scope.closePopup();
			$rootScope.$broadcast('NAVIGATE_TO_ADDONS', {
				addonPostingMode: $scope.addonPopUpData.addonPostingMode
			});
		};

		$scope.removeChosenAddons = function(index, addon) {
			$rootScope.$broadcast('REMOVE_ADDON', {
				addonPostingMode: $scope.addonPopUpData.addonPostingMode,
				index: index,
				addon: addon
			});
		};
		
		$scope.proceedBooking = function() {
			setPostingData();
			$scope.$emit('PROCEED_BOOKING', {
				addonPostingMode: $scope.addonPopUpData.addonPostingMode,
				selectedPurchesedAddon: $scope.selectedPurchesedAddon
			});
			$scope.closePopup();
		};

		var setPostingData = function() {
			angular.forEach($scope.packageData.existing_packages, function(existing_package) {
				existing_package.start_date = $filter('date')(tzIndependentDate(existing_package.start_date), $rootScope.dateFormatForAPI);
				existing_package.end_date = $filter('date')(tzIndependentDate(existing_package.end_date), $rootScope.dateFormatForAPI);

                angular.forEach(existing_package.post_instances, function(item) {
	                var postDate = new Date(item.post_date),
	                	day = $scope.daysOfWeek[postDate.getDay()];

						item.active = $scope.selectedPurchesedAddon.selected_post_days[day];
	            });
            });
			
		};
	}
]);