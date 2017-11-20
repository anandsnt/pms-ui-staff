angular.module('sntRover').controller('RvOverBookingMainCtrl', [
	'$scope',
	'rvOverBookingSrv',
	'$rootScope',
	'ngDialog',
	'$filter',
	'$timeout',
	'completeRoomTypeListData',
	'overBookingGridData',
	function($scope, rvOverBookingSrv, $rootScope, ngDialog, $filter, $timeout, completeRoomTypeListData, overBookingGridData) {

	BaseCtrl.call(this, $scope);
	// Initialization..
	var init = function() {

		$scope.heading = $filter('translate')('MENU_OVER_BOOKING');
		$scope.setTitle($filter('translate')('MENU_OVER_BOOKING'));
		$scope.$emit('updateRoverLeftMenu', 'overbooking');

		$scope.overBookingObj = {
			roomTypeList: completeRoomTypeListData,
			overBookingGridData: overBookingGridData,
			startDate: moment(tzIndependentDate($rootScope.businessDate)).format($rootScope.momentFormatForAPI),
			endDate: moment(tzIndependentDate($rootScope.businessDate)).add(13, 'd').format($rootScope.momentFormatForAPI),
			isShowRoomsLeftToSell: false,
			isShowRoomTypeFilter: false
		};
	};
	
	/*
	 *	Generating List of Selected Room Type Ids, used for calling fetchGridData API.
	 *  @return { Array }
	 */
	var getSelectedRoomTypeIdList = function() {
		var selectedRommTypeIdList = [];

			_.map($scope.overBookingObj.roomTypeList, function(value) {
				if (value.isChecked) {
					selectedRommTypeIdList.push(value.id);
				}
		});
		return selectedRommTypeIdList;
	};

	/*
	 *  Common Handler method for Genearting the RoomType - Date grid data.
	 *	Responce from API is modified in Service Layer - Ref : rvOverBookingSrv.js
	 */
	var fetchGridData = function() {

		var onFetchGridDataSuccess = function( data ) {
			$scope.overBookingObj.overBookingGridData = data;
		},
		onFetchGridDataFailure = function( errorMessage ) {
			$scope.$errorMessage = errorMessage;
		},
		dataToSend = {
            'start_date': moment(tzIndependentDate($scope.overBookingObj.startDate)).format($rootScope.momentFormatForAPI),
            'end_date': moment(tzIndependentDate($scope.overBookingObj.endDate)).format($rootScope.momentFormatForAPI),
            'show_rooms_left_to_sell': true,
            'room_type_ids': getSelectedRoomTypeIdList()
        };

		$scope.callAPI(rvOverBookingSrv.fetchOverBookingGridData, {
			successCallBack: onFetchGridDataSuccess,
			failureCallBack: onFetchGridDataFailure,
			params: dataToSend
		});
	};

	// Catching the REFRESH_OVERBOOKING_GRID event from child controllers..
	var listenerOverbooking = $scope.$on('REFRESH_OVERBOOKING_GRID', function() {
		fetchGridData();
	});

	// Cleaning listener.
    $scope.$on('$destroy', listenerOverbooking);

	init();

}]);
