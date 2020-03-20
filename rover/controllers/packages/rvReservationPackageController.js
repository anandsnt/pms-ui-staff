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
			$scope.$emit('CLOSE_ADDON_POPUP', {
				addonPostingMode: $scope.addonPopUpData.addonPostingMode
			});
			$timeout(function() {
				if (shouldReloadState) {
					$state.reload($state.current.name);
				}
				ngDialog.close();
			}, 300);
		};

		// Get addon count
		$scope.getAddonCount = function(addon) {
			var postingRythm = addon.post_type.frequency,
				postType = addon.post_type.value.toUpperCase(),
				amountType = addon.amount_type.value.toUpperCase(),
				numAdults = $scope.addonPopUpData.number_of_adults,
				numChildren = $scope.addonPopUpData.number_of_children,
				numNights = $scope.addonPopUpData.duration_of_stay,
				chargeFullWeeksOnly = addon.charge_full_weeks_only;
				
			if (!postingRythm) {				
				if (postType === 'WEEK' || postType === 'EVERY WEEK' || postType === 'WEEKLY' || postType === 'WEEKDAY' || postType === 'WEEKEND') {
					postingRythm = 7;
				} else if (postType === 'STAY' || postType === 'ENTIRE STAY') {
					postingRythm = 1;
				} else if (postType === 'NIGHT' || postType === 'First Night' || postType === 'LAST_NIGHT' || postType === 'CUSTOM' || postType === 'POST ON LAST NIGHT') {
					postingRythm = 0;
				}
			}
			if ($scope.showCustomPosting() && typeof addon.post_instances !== 'undefined' && addon.post_instances.length > 0) {
				numNights = _.filter(addon.post_instances, {active: true}).length;
			}
			var addonCount = RVReservationStateService.getApplicableAddonsCount(amountType, postType, postingRythm, numAdults, numChildren, numNights, chargeFullWeeksOnly);

			return (addonCount * addon.addon_count);
		};

		$scope.getAddonTotal = function(addon) {
			return $scope.getAddonCount(addon) * addon.amount;
		};

		$scope.selectedPurchesedAddon = "";
		
		$scope.selectPurchasedAddon = function(addon) {
			$scope.errorMessage = [];
			$scope.daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
			if (!$rootScope.featureToggles.addons_custom_posting) {
				return;
			} else if (addon.is_rate_addon) {
				$scope.errorMessage = ["Custom posting cannot be configured for rate addons"];
				$scope.selectedPurchesedAddon = "";
			} else if (addon.post_type.value === 'STAY') {
				var addonPostingMode = $scope.addonPopUpData.addonPostingMode;

				$scope.selectedPurchesedAddon = addon;
				if (addonPostingMode === 'staycard') {
					$scope.addonPostingDate = {
						startDate: tzIndependentDate($scope.reservationData.reservation_card.arrival_date),
						endDate: tzIndependentDate($scope.reservationData.reservation_card.departure_date)
					};
				} else if (addonPostingMode === 'reservation') {
					$scope.addonPostingDate = {
						startDate: tzIndependentDate($scope.reservationData.arrivalDate),
						endDate: tzIndependentDate($scope.reservationData.departureDate)
					};
				} else if (addonPostingMode === 'allotments') {
					$scope.addonPostingDate = {
						startDate: tzIndependentDate($scope.allotmentConfigData.summary.block_from),
						endDate: tzIndependentDate($scope.allotmentConfigData.summary.block_to)
					};
				} else {
					$scope.addonPostingDate = {
						startDate: tzIndependentDate($scope.groupConfigData.summary.block_from),
						endDate: tzIndependentDate($scope.groupConfigData.summary.block_to)
					};
				}
				if (!$scope.selectedPurchesedAddon.start_date) {
					$scope.selectedPurchesedAddon.start_date = $scope.addonPostingDate.startDate;
				}
				if (!$scope.selectedPurchesedAddon.end_date) {
					$scope.selectedPurchesedAddon.end_date = $scope.addonPostingDate.endDate;
				}
				updateDaysOfWeek();
				if (typeof $scope.selectedPurchesedAddon.selected_post_days === 'undefined') {
					$scope.selectedPurchesedAddon.selected_post_days = {};
					$scope.togglePostDaysSelectionForAddon(true);
				}
				var startDate = $filter('date')($scope.selectedPurchesedAddon.start_date, $rootScope.dateFormat),
					endDate = $filter('date')($scope.selectedPurchesedAddon.end_date, $rootScope.dateFormat);

				$scope.selectedPurchesedAddon.start_date = startDate;
				$scope.selectedPurchesedAddon.end_date = endDate;
				$scope.selectedPurchesedAddon.nameCharLimit = ($scope.selectedPurchesedAddon.name.length > 23) ? 20 : 23;
				angular.forEach($scope.selectedPurchesedAddon.post_instances, function(item) {
						if (!item.active) {
							var postDate = new Date(item.post_date),
							daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
							day;

							day = daysOfWeek[postDate.getDay()];

							$scope.selectedPurchesedAddon.selected_post_days[day] = item.active;
						}
					});
			} else {
				$scope.errorMessage = ["Custom posting can be configured only for nightly addons"];
				$scope.selectedPurchesedAddon = "";
			}

		};

		$scope.showCustomPosting = function() {
			return $rootScope.featureToggles.addons_custom_posting;
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
			updateDaysOfWeek();
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
			
			setTimeout(function() {
				$scope.selectedPurchesedAddon = "";
			}, 1000);
			
			$rootScope.$broadcast('REMOVE_ADDON', {
				addonPostingMode: $scope.addonPopUpData.addonPostingMode,
				index: index,
				addon: addon
			});
			if ($scope.packageData.existing_packages.length === 1) {
				$scope.closePopup();
			}

		};
		
		$scope.proceedBooking = function() {
			setPostingData();
			$scope.$emit('PROCEED_BOOKING', {
				addonPostingMode: $scope.addonPopUpData.addonPostingMode,
				selectedPurchesedAddon: $scope.selectedPurchesedAddon
			});
			$scope.closePopup();
		};

		$scope.setDeafultDisplay = function() {
			$scope.selectedPurchesedAddon = "";
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

		var updateDaysOfWeek = function() {

			$scope.daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
			var start_date = tzIndependentDate($filter('date')(tzIndependentDate($scope.selectedPurchesedAddon.start_date), 'yyyy-MM-dd' )),
				end_date = tzIndependentDate($filter('date')(tzIndependentDate($scope.selectedPurchesedAddon.end_date), 'yyyy-MM-dd' )),
				noOfDays, startDayIndex;

			noOfDays = (moment(end_date) - moment(start_date)) / 86400000;
			noOfDays--;
			if (noOfDays <= 6) {
				$scope.daysOfWeekCopy = [];
				startDayIndex = start_date.getDay();
				if ($scope.selectedPurchesedAddon.is_allowance && $scope.selectedPurchesedAddon.is_consume_next_day) {
					startDayIndex++;
				}
				for (var index = 0; index <= noOfDays; index++) {

					if (startDayIndex < 7) {
						$scope.daysOfWeekCopy.push($scope.daysOfWeek[startDayIndex]);
						startDayIndex++;
					} else {
						$scope.daysOfWeekCopy.push($scope.daysOfWeek[startDayIndex - 7]);
						startDayIndex++;
					}
				}
				angular.copy($scope.daysOfWeekCopy, $scope.daysOfWeek);
			}
		};
	}
]);