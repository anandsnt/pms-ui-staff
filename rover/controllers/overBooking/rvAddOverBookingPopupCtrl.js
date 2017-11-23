angular.module('sntRover').controller('rvAddOverBookingPopupCtrl', ['$scope', '$rootScope', 'ngDialog', 'rvOverBookingSrv', function($scope, $rootScope, ngDialog, rvOverBookingSrv) {

	var init = function() {
		$scope.addOverBookingObj = {
			fromDate: moment(tzIndependentDate($rootScope.businessDate)).format($rootScope.momentFormatForAPI),
			toDate: moment(tzIndependentDate($rootScope.businessDate)).format($rootScope.momentFormatForAPI),
			weekDayList: [
				{ name: 'MON', id: 1, isChecked: true },
				{ name: 'TUE', id: 2, isChecked: true },
				{ name: 'WED', id: 3, isChecked: true },
				{ name: 'THU', id: 4, isChecked: true },
				{ name: 'FRI', id: 5, isChecked: true },
				{ name: 'SAT', id: 6, isChecked: true },
				{ name: 'SUN', id: 0, isChecked: true }
			],
			applyForHouse: true,
			applyForRoomTypes: false,
			limitType: 'RMS',	// Value will be 'RMS' or 'PERCENT' ( future story )
			roomTypeList: dclone($scope.overBookingObj.completeRoomTypeListData, []),
			limitValue: ''
		};
		$scope.setScroller('roomTypeFilterList');
	};

	// Handle click action on each checkbox inside week days.
	$scope.clickedRoomTypeCheckbox = function ( index ) {
		var item = $scope.addOverBookingObj.weekDayList[index];

		item.isChecked = !item.isChecked;
	};
	$scope.clickedApplyForHouse = function() {
		$scope.addOverBookingObj.applyForHouse = !$scope.addOverBookingObj.applyForHouse;
	};

	$scope.clickedApplyForRoomTypes = function() {
		$scope.addOverBookingObj.applyForRoomTypes = !$scope.addOverBookingObj.applyForRoomTypes;
		$scope.refreshScroller('roomTypeFilterList');
	};

	// Handle click action on each checkbox inside filter.
	$scope.clickedRoomTypeCheckbox = function ( index ) {
		var item = $scope.addOverBookingObj.roomTypeList[index];

		item.isChecked = !item.isChecked;
	};

	// Handle click action on each checkbox in week days.
	$scope.clickedWeekDay = function ( index ) {
		var item = $scope.addOverBookingObj.weekDayList[index];

		item.isChecked = !item.isChecked;
	};

    /*
	 *	Generating List of Selected Ids from inputList.
	 *  @input [Array] conatains 'id' as one key.
	 *  @return { Array }
	 */
	var getSelectedIdList = function( inputList ) {
		var selectedIdList = [];

		_.map( inputList , function(value) {
			if (value.isChecked) {
				selectedIdList.push(value.id);
			}
		});
		return selectedIdList;
	};

	/*
	 *  ADD OVER BOOKING API CALL
	 *	Responce from API is modified in Service Layer - Ref : rvOverBookingSrv.js
	 */
	$scope.addOverBookingApiCall = function() {

		var onAddOverBookingApiSuccess = function() {
			$scope.$errorMessage = '';
			$scope.$emit('REFRESH_OVERBOOKING_GRID');
			$scope.closeDialog();
		},
		onAddOverBookingApiFailure = function( errorMessage ) {
			$scope.$errorMessage = errorMessage;
		},
		dataToSend = {
            'start_date': moment(tzIndependentDate($scope.addOverBookingObj.fromDate)).format($rootScope.momentFormatForAPI),
            'end_date': moment(tzIndependentDate($scope.addOverBookingObj.toDate)).format($rootScope.momentFormatForAPI),
            'house_overbooking': $scope.addOverBookingObj.applyForHouse,
            'wdays_selected': getSelectedIdList($scope.addOverBookingObj.weekDayList),
            'room_type_ids': getSelectedIdList($scope.addOverBookingObj.roomTypeList),
            'limit': $scope.addOverBookingObj.limitValue
        };

		$scope.callAPI(rvOverBookingSrv.addOrEditOverBooking, {
			successCallBack: onAddOverBookingApiSuccess,
			failureCallBack: onAddOverBookingApiFailure,
			params: dataToSend
		});
	};

	$scope.disableAddLimitButton = function() {
		var limit = $scope.addOverBookingObj.limitValue;

		return ( limit === '' || limit === null );
	};

	$scope.closeDialog = function() {
        ngDialog.close();
    };

	init();
}]);