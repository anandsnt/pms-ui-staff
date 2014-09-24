sntRover.controller('RVShowValidationErrorCtrl',['$rootScope', '$scope', 'ngDialog','RVBillCardSrv',  function($rootScope, $scope, ngDialog, RVBillCardSrv){
	BaseCtrl.call(this, $scope);
	
	var init = function(){
		$scope.roomStatusNotReady = true;

	};

	var cancelPopup = function(){
		console.log("cancelPopup");
		if($scope.callBackMethod){
			$scope.callBackMethod();
		}
		ngDialog.close();
	};


	$scope.okButtonClicked = function(){
		

		if(!roomStatusNotReady){
			console.log("room status ready");

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

			console.log("checkin_inspected_only----" + $scope.reservationBillData.checkin_inspected_only);
			console.log(data);

			var houseKeepingStatusUpdateSuccess = function(data){
				$scope.$emit('hideLoader');
				cancelPopup();
			};
			$scope.invokeApi(RVBillCardSrv.changeHousekeepingStatus, data, houseKeepingStatusUpdateSuccess);  

		} else {
			cancelPopup();
		}
	};

	// this.okButtonClicked = function(){
	// 	var checkinInspectedOnly = $("#headerDetails").attr('data-checkin-inspected-only');
	// 	var roomNumber = $("#headerDetails").attr('data-room-number');
	// 	if(that.myDom.find('#checkout_message').attr("data-enable-room-status") == "true"){
	// 		var isReady = that.myDom.find(".switch-button").hasClass('on');
		
	// 		if(isReady){
	// 			/*
	// 			 * "hkstatus_id": 1 for CLEAN
	// 			 * "hkstatus_id": 2 for INSPECTED
	// 			 */
	// 			if(checkinInspectedOnly === "true"){
	// 				var data  = { "hkstatus_id": 2, "room_no":roomNumber };
	// 			}
	// 			else{
	// 				var data  = { "hkstatus_id": 1, "room_no":roomNumber };
	// 			}
	// 			// API call for make room as READY
	// 			var webservice = new WebServiceInterface();
	// 			var options = {
	// 				requestParameters : data,
	// 				successCallBack : that.hide(callBack)
	// 			};
	// 			webservice.postJSON('/house/change_house_keeping_status.json', options);
	// 		}
	// 		else{
	// 			that.hide(callBack);
	// 		}
	// 	}
	// 	else{
	// 		that.hide(callBack);
	// 	}
		
	// };

	init();
	
}]);