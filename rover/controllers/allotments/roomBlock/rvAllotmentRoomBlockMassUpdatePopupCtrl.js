sntRover.controller('rvAllotmentRoomBlockMassUpdatePopupCtrl', [
	'$scope',
	'$rootScope',
	'$filter',
	'rvPermissionSrv',
	'ngDialog',
	'$timeout',
	'rvUtilSrv',
	'rvAllotmentConfigurationSrv',
	function($scope,
		$rootScope,
		$filter,
		rvPermissionSrv,
		ngDialog,
		$timeout,
		util,
		rvAllotmentConfigurationSrv) {

		var formatDateForAPI = function(date) {
			return $filter('date')(date, $rootScope.dateFormatForAPI)
		};

		/**
		 * Utility for checking date validity.
		 * @param {String} Date in API format
		 * @return {Boolean} validity
		 */
		var isDateInsideLimit = function(date) {
			var day = new tzIndependentDate(date);
			return (day <= $scope.massUpdateEndDate);
		};

		/**
		 * Utility function to propogate a value of a property through an array
		 * @param {Array} Array containing objects
		 * @param {String} property whose value is to be changed
		 * @param {Integer} new value
		 * @return {undefined}
		 */
		var copyValuesThroughDates = function(dates, property, value) {
			dates.every(function(each) {
				if(isDateInsideLimit(each.date)) {
					each[property] = parseInt(value);
					return true;
				}
				return false;
			});
		};

		/**
		 * Tells room block controller to save roomblock data with selected end date.
		 * @return {undefined}
		 */
		$scope.clickedOnSaveButton = function () {

			var roomBlockData = $scope.allotmentConfigData.roomblock,
				isReleaseDays = $scope.ngDialogData.isReleaseDays,
				value 		  = $scope.ngDialogData.value,
				timeLineStart = $scope.timeLineStartDate,
				endDate 	  = $scope.massUpdateEndDate;

			// If we are updating release days the logic defers.
			if (isReleaseDays) {
				// copy values horizontally
				copyValuesThroughDates(roomBlockData.selected_room_types_and_occupanies, 'ui_release_days', value);

				_.each(roomBlockData.selected_room_types_and_bookings, function(each) {
					// propogate values
					copyValuesThroughDates(each.dates, 'release_days', value);
					each.copy_values_to_all = true;
					each.start_date = formatDateForAPI($scope.allotmentConfigData.summary.block_from);
					each.end_date = formatDateForAPI($scope.massUpdateEndDate);
				});
				//we changed something
				$scope.releaseDateChanging();

			}
			// Copying contract or held counts
			else {
				var roomTypeData  = $scope.selectedRoomType,
					occupancy 	  = $scope.ngDialogData.occupancy;

				copyValuesThroughDates(roomTypeData.dates, occupancy, value);
				roomTypeData.copy_values_to_all = true;
				roomTypeData.start_date = formatDateForAPI($scope.allotmentConfigData.summary.block_from);
				roomTypeData.end_date = formatDateForAPI($scope.massUpdateEndDate);

				//we changed something
				$scope.bookingDataChanging();
			}

			$scope.closeDialog();
		};

		var onEndDatePicked = function (date, datePickerObj) {
			$scope.massUpdateEndDate = new tzIndependentDate(util.get_date_from_date_picker(datePickerObj));
		};

		/**
		 * Set end date selection options. default to allotment end date.
		 * @return {undefined}
		 */
		var setDatePickers = function () {
			var summaryData = $scope.allotmentConfigData.summary;
			var commonDateOptions = {
				dateFormat: $rootScope.jqDateFormat,
				numberOfMonths: 1
			};
			$scope.massUpdateEndDate = new tzIndependentDate(summaryData.block_to);
			$scope.massUpdateEndDateOptions = _.extend({
				minDate: $scope.timeLineStartDate,
				maxDate: summaryData.block_to,
				onSelect: onEndDatePicked,
			}, commonDateOptions);
		};

		var init = function () {
			BaseCtrl.call(this, $scope);

			setDatePickers();
		};
		init();
	}
]);