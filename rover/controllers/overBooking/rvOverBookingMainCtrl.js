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

	var init = function() {

	    $scope.heading = $filter('translate')('MENU_OVER_BOOKING');
	    $scope.setTitle($filter('translate')('MENU_OVER_BOOKING'));
	    $scope.$emit('updateRoverLeftMenu', 'overbooking');

		$scope.overBookingObj = {
			roomTypeList: completeRoomTypeListData,
			overBookingGridData: overBookingGridData,
			startDate: moment(tzIndependentDate($rootScope.businessDate)).format($rootScope.momentFormatForAPI),
			endDate: moment(tzIndependentDate($rootScope.businessDate)).add(13, 'd').format($rootScope.momentFormatForAPI),
			isShowRoomsLeftToSell: false
		};
	};

	var getSelectedRommTypeIdList = function() {
		var selectedRommTypeIdList = [];

		_.map($scope.overBookingObj.roomTypeList, function(value) {
		  	if (value.isChecked) {
				selectedRommTypeIdList.push(value.id);
		  	}
		});
		return selectedRommTypeIdList;
	};

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
            'show_rooms_left_to_sell': $scope.overBookingObj.isShowRoomsLeftToSell,
            'room_type_ids': getSelectedRommTypeIdList()
        };

		$scope.callAPI(rvOverBookingSrv.fetchOverBookingGridData, {
			successCallBack: onFetchGridDataSuccess,
			failureCallBack: onFetchGridDataFailure,
			params: dataToSend
		});
	};
	
	$scope.$on('REFRESH_OVERBOOKING_GRID', function() {
		fetchGridData();
	});

	init();

}]);
