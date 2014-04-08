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

		};
		$scope.invokeApi(adCheckinSrv.fetch, {},fetchCheckinDetailsSuccessCallback);
	};

	$scope.fetchCheckinDetails();

	$scope.hours = ["01","02","03","04","05","06","07","08","09","10","11","12"];
    $scope.minutes = ["00","15","30","45"];


    $scope.toggleCheckbox =  function(type){



    	if(type === 'send_alert')
    	{

    		// alert("fee")
    		// $scope.checkinData.is_send_alert = ($scope.checkinData.is_send_alert) ? false:true;
    	}
    }



}]);