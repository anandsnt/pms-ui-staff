admin.controller('ADCheckinCtrl',['$scope','adCheckinSrv', function($scope,adCheckinSrv){

	BaseCtrl.call(this, $scope);
	$scope.checkinData = {};
	
   /*
    * To fetch checkin details
    */
	$scope.fetchCheckinDetails = function(){
		var fetchCheckinDetailsSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.checkinData = data;

			$scope.checkinData.is_send_alert = ($scope.checkinData.is_send_alert === 'true') ? true:false;
			$scope.checkinData.is_send_checkin_staff_alert = ($scope.checkinData.is_send_checkin_staff_alert === 'true') ? true:false;
			$scope.checkinData.is_notify_on_room_ready = ($scope.checkinData.is_send_alert === 'true') ? true:false;
			$scope.checkinData.require_cc_for_checkin_email = ($scope.checkinData.require_cc_for_checkin_email=== 'true') ? true:false;


			//to be deleted 

			$scope.checkinData.checkin_alert_primetime = "PM";

		};
		$scope.invokeApi(adCheckinSrv.fetch, {},fetchCheckinDetailsSuccessCallback);
	};

	$scope.fetchCheckinDetails();

	$scope.hours = ["01","02","03","04","05","06","07","08","09","10","11","12"];
    $scope.minutes = ["00","15","30","45"];
    $scope.primeTimes = ["AM","PM"];


    $scope.saveCheckin = function(){

    	console.log($scope.checkinData);

    }



}]);