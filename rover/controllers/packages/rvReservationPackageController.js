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

		$scope.shouldHideCount = function(addon) {
			var postType = addon.post_type.value.toUpperCase();

			if ((postType === 'WEEKDAY' || postType === 'WEEKEND' || postType === 'CUSTOM') && typeof addon.post_instances === 'undefined' 
				&& $scope.showCustomPosting() && $scope.addonPopUpData.addonPostingMode === 'reservation') {
				return true;
			}
			return false;
		};

		var getApplicableAddonsCount = function(amountType, numAdults, numChildren, numNights) {
			
			if (amountType === 'PERSON') {
				return (numAdults + numChildren) * numNights;
			} else if (amountType === 'ADULT') {
				return numAdults * numNights;
			} else if (amountType === 'CHILD') {
				return numChildren * numNights;
			} else if (amountType === 'FLAT' || amountType === 'ROOM') {
				return numNights;
			}
		};

		// Get addon count
		$scope.getAddonCount = function(addon) {
			var postingRythm = addon.post_type.frequency,
				postType = addon.post_type.value.toUpperCase(),
				amountType = addon.amount_type.value.toUpperCase(),
				numAdults = $scope.addonPopUpData.number_of_adults,
				numChildren = $scope.addonPopUpData.number_of_children,
				numNights = $scope.addonPopUpData.duration_of_stay,
				addonCount = 0,
				chargeFullWeeksOnly = addon.charge_full_weeks_only;
				
			if ($scope.showCustomPosting() && typeof addon.post_instances !== 'undefined') {
				numNights = _.filter(addon.post_instances, {active: true}).length;		
				addonCount = getApplicableAddonsCount(amountType, numAdults, numChildren, numNights);		
			} else {
				if (!postingRythm) {				
					if (postType === 'WEEK' || postType === 'EVERY WEEK' || postType === 'WEEKLY' || postType === 'WEEKDAY' || postType === 'WEEKEND') {
						postingRythm = 7;
					} else if (postType === 'STAY' || postType === 'NIGHTLY') {
						postingRythm = 1;
					} else if (postType === 'NIGHT' || postType === 'First Night' || postType === 'LAST_NIGHT' || postType === 'CUSTOM' || postType === 'POST ON LAST NIGHT') {
						postingRythm = 0;
					}
				}
				addonCount = RVReservationStateService.getApplicableAddonsCount(amountType, postType, postingRythm, numAdults, numChildren, numNights, chargeFullWeeksOnly);
			}

			return (addonCount * addon.addon_count);
		};

		$scope.getAddonTotal = function(addon) {
			if ($scope.shouldHideCount(addon)) {
				return addon.amount;
			}
			return $scope.getAddonCount(addon) * addon.amount;
		};

		$scope.selectedPurchesedAddon = "";
		
		$scope.selectPurchasedAddon = function(addon) {
			$scope.errorMessage = [];
			$scope.previousPostDays = {};
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
				} else if (addonPostingMode === 'allotments' || addonPostingMode === 'create_allotment') {
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
				$scope.selectedPurchesedAddon.start_date = $scope.addonPostingDate.startDate;
				$scope.selectedPurchesedAddon.end_date = $scope.addonPostingDate.endDate;
				
				if (typeof $scope.selectedPurchesedAddon.selected_post_days === 'undefined') {
					$scope.selectedPurchesedAddon.selected_post_days = {};
					$scope.togglePostDaysSelectionForAddon(true);
				}
				$scope.selectedPurchesedAddon.startDateObj = tzIndependentDate($scope.selectedPurchesedAddon.start_date);
				$scope.selectedPurchesedAddon.endDateObj = tzIndependentDate($scope.selectedPurchesedAddon.end_date);

				updateDaysOfWeek();

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
				angular.copy($scope.selectedPurchesedAddon.selected_post_days, $scope.previousPostDays);
			} else {
				// $scope.errorMessage = ["Custom posting can be configured only for nightly addons"];
				$scope.selectedPurchesedAddon = addon;
			}

		};

		var ordinal_suffix_of = function (i) {
		    var j = i % 10,
		        k = i % 100;

		    if (j === 1 && k !== 11) {
		        return i + "st";
		    }
		    if (j === 2 && k !== 12) {
		        return i + "nd";
		    }
		    if (j === 3 && k !== 13) {
		        return i + "rd";
		    }
		    return i + "th";
		};

		$scope.getCustomPostingInfo = function() {
			var posting_info = "";

			if (typeof $scope.selectedPurchesedAddon.frequency_type === 'undefined' || typeof $scope.selectedPurchesedAddon.frequency === 'undefined') {
				posting_info = "Posts daily";
			} else if ($scope.selectedPurchesedAddon.frequency_type === "days") {
				if ($scope.selectedPurchesedAddon.frequency === 1) {
					posting_info = "Posts daily";
				} else {
					posting_info = "Posts on every " + $scope.selectedPurchesedAddon.frequency + " days.";
				}
				
			} else if ($scope.selectedPurchesedAddon.frequency_type === "weeks") {
				if ($scope.selectedPurchesedAddon.frequency === 1) {
					posting_info = "Posts weekly, on " + $scope.selectedPurchesedAddon.post_day_of_the_week;
				} else {
					posting_info = "Posts every " + $scope.selectedPurchesedAddon.frequency + " weeks, on " +  $scope.selectedPurchesedAddon.post_day_of_the_week;
				}
				
			} else if ($scope.selectedPurchesedAddon.frequency_type === "months") {
				if ($scope.selectedPurchesedAddon.frequency === 1) {
					posting_info = "Posts every month, on " + ordinal_suffix_of($scope.selectedPurchesedAddon.post_day_of_the_month);
				} else {
					posting_info = "Posts every " + $scope.selectedPurchesedAddon.frequency + " months, on " +  ordinal_suffix_of($scope.selectedPurchesedAddon.post_day_of_the_month);
				}
				
			} else {
				posting_info = "Posts daily";
			}
			return posting_info;
		};

		$scope.showCustomPosting = function() {
			return $rootScope.featureToggles.addons_custom_posting;
		};

		$scope.shouldShowSelectAllDaysOfWeek = function() {
			var shouldShowSelectAllDaysOfWeek = false;

			if (!!$scope.selectedPurchesedAddon) {
				angular.forEach($scope.daysOfWeek, function(item) {
					if (!$scope.selectedPurchesedAddon.selected_post_days[item]) {
						shouldShowSelectAllDaysOfWeek = true;
					}
				});
			}
			return shouldShowSelectAllDaysOfWeek;
		};

		$scope.shouldShowSelectNoDaysOfWeek = function() {
			var shouldShowSelectNoDaysOfWeek = true;
			
			if (!!$scope.selectedPurchesedAddon) {
				angular.forEach($scope.daysOfWeek, function(item) {
					if (!$scope.selectedPurchesedAddon.selected_post_days[item]) {
						shouldShowSelectNoDaysOfWeek = false;
					}
				});
			}
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

		$scope.removeChosenAddons = function($event, index, addon) {
			$event.stopPropagation();
			$scope.selectedPurchesedAddon = "";

			if (addon.is_allowance && addon.is_consumed_allowance) {
				$scope.errorMessage = ["Cannot remove consumed allowance from staycard"];
			} else {
				if ($scope.packageData.existing_packages.length === 1) {
					$scope.closePopup();
				}
				$rootScope.$broadcast('REMOVE_ADDON', {
					addonPostingMode: $scope.addonPopUpData.addonPostingMode,
					index: index,
					addon: addon
				});
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
			angular.copy($scope.previousPostDays, $scope.selectedPurchesedAddon.selected_post_days);
			$scope.selectedPurchesedAddon = "";
		};

		$scope.shouldShowAddMoreButton = function() {
			var addonPostingMode = $scope.addonPopUpData.addonPostingMode;

			return (addonPostingMode === 'staycard' || addonPostingMode === 'group' || addonPostingMode === 'allotments');
		};

		var setPostingData = function() {
			angular.forEach($scope.packageData.existing_packages, function(existing_package) {
				if (existing_package.startDateObj) {
					existing_package.start_date = $filter('date')(tzIndependentDate(existing_package.startDateObj), $rootScope.dateFormatForAPI);
				}
				else {
					existing_package.start_date = $filter('date')(tzIndependentDate(existing_package.start_date), $rootScope.dateFormatForAPI);
				}
				if (existing_package.endDateObj) {
					existing_package.end_date = $filter('date')(tzIndependentDate(existing_package.endDateObj), $rootScope.dateFormatForAPI);
				}
				else {
					existing_package.end_date = $filter('date')(tzIndependentDate(existing_package.end_date), $rootScope.dateFormatForAPI);
				}

                angular.forEach(existing_package.post_instances, function(item) {
	                var postDate = new Date(item.post_date),
	                	day = $scope.daysOfWeek[postDate.getDay()];

						item.active = $scope.selectedPurchesedAddon.selected_post_days[day];
	            });
            });
			
		};

		var updateDaysOfWeek = function() {

			$scope.daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
			var start_date = $scope.selectedPurchesedAddon.startDateObj,
				end_date = $scope.selectedPurchesedAddon.endDateObj,
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