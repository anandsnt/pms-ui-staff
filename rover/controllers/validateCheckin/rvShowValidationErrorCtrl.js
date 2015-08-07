sntRover.controller('RVShowValidationErrorCtrl',['$rootScope', '$scope', 'ngDialog','RVBillCardSrv',  function($rootScope, $scope, ngDialog, RVBillCardSrv){
	BaseCtrl.call(this, $scope);

	var init = function(){
		$scope.flag = {};
		$scope.flag.roomStatusReady = false;

	};

	var cancelPopup = function(){
		if($scope.callBackMethod){
			$scope.callBackMethod();
		}
		ngDialog.close();
	};


	$scope.okButtonClicked = function(){
		//If we chose the room status as ready, then we should make an API call to change the HK status
		if($scope.flag.roomStatusReady){
			/*
			 * "hkstatus_id": 1 for CLEAN
			 * "hkstatus_id": 2 for INSPECTED
			 */
			if($scope.reservationBillData.checkin_inspected_only === "true"){
				var data  = { "hkstatus_id": 2, "room_no":$scope.reservationBillData.room_number };
			}
			else{
				var data  = { "hkstatus_id": 1, "room_no":$scope.reservationBillData.room_number };
			}

			var houseKeepingStatusUpdateSuccess = function(data){
				$scope.$emit('hideLoader');
				cancelPopup();
			};
			$scope.invokeApi(RVBillCardSrv.changeHousekeepingStatus, data, houseKeepingStatusUpdateSuccess);
		//Room is set to be not ready by default in checkout process. So we don't need to change the HK status
		} else {
			cancelPopup();
		}
	};
	init();

}]);