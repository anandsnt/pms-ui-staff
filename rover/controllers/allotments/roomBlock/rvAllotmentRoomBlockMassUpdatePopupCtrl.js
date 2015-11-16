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


		/**
		 * Tells room block controller to save roomblock data with selected end date.
		 */
		$scope.clickedOnSaveButton = function () {
			var roomTypeData = $scope.selectedRoomType,
				occupancy 	 = $scope.ngDialogData.occupancy,
				value 		 = $scope.ngDialogData.value;

			// Confirmed. propogate values to show.
			_.each(roomTypeData.dates, function(element) {
				element[occupancy] = value;
			});
			roomTypeData.copy_values_to_all = true;
			roomTypeData.start_date = $scope.formatDateForAPI($scope.allotmentConfigData.summary.block_from);
			roomTypeData.end_date = $scope.formatDateForAPI($scope.massUpdateEndDate);

			//we changed something
			$scope.bookingDataChanging();

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