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
				isReleaseDays = $scope.ngDialogData.isReleaseDays || false,
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
					each.start_date = formatDateForAPI(timeLineStart);
					each.end_date = formatDateForAPI($scope.massUpdateEndDate);
				});
				//we changed something
				$scope.releaseDateChanging();

				// Save room block now.
				$scope.saveReleaseDays();

			}
			// Copying contract or held counts
			else {
				var roomTypeData  = $scope.selectedRoomType,
					occupancy 	  = $scope.ngDialogData.occupancy,
					isContract 	  = $scope.ngDialogData.isContract || false;

				copyValuesThroughDates(roomTypeData.dates, occupancy, value);
				roomTypeData.copy_values_to_all = true;
				roomTypeData.start_date = formatDateForAPI(timeLineStart);
				roomTypeData.end_date = formatDateForAPI($scope.massUpdateEndDate);

				//we changed something
				$scope.bookingDataChanging();

				// Save room block now.
				$scope.saveRoomBlock(false, isContract, true);
			}

			//$scope.showSaveButton = false;
			$timeout($scope.closeDialog, 100);
		};

		$scope.clickedOnApplyToHeldCountsButton = function() {
			copyValuesThroughDates($scope.selectedRoomType.dates, $scope.ngDialogData.occupancy.split("_")[0], $scope.ngDialogData.value);
			$scope.$parent.clickedOnApplyToHeldCountsButton(true);
			$timeout($scope.closeDialog, 100);
		};

		$scope.clickedOnApplyToHeldToContractButton = function() {
			copyValuesThroughDates($scope.selectedRoomType.dates, $scope.ngDialogData.occupancy+"_contract", $scope.ngDialogData.value);
			$scope.$parent.clickedOnApplyToHeldToContractButton(true);
			$timeout($scope.closeDialog, 100);
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
			var maxDate = new tzIndependentDate(summaryData.block_to);
			maxDate.setDate(maxDate.getDate()-1);
			$scope.massUpdateEndDate = new tzIndependentDate(maxDate);

			$scope.massUpdateEndDateOptions = _.extend({
				minDate: $scope.timeLineStartDate,
				maxDate: maxDate,
				onSelect: onEndDatePicked,
			}, commonDateOptions);
		};

		var init = function () {
			BaseCtrl.call(this, $scope);
			$scope.showSaveButton = true;
			setDatePickers();
		};
		init();
	}
]);