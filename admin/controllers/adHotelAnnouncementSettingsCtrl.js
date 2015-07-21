admin.controller('ADHotelAnnouncementSettingsCtrl', ['$scope','$rootScope', '$state', 'ADHotelAnnouncementSrv', function($scope, $rootScope,$state, ADHotelAnnouncementSrv){

	BaseCtrl.call(this, $scope);
	$scope.errorMessage = '';

	/*
	* success call back of details web service call
	*/
	var fetchCompletedOfSettingsDetails = function(data){
		$scope.$emit('hideLoader');
		$scope.data = data;
	};

	//fetching the settings details
	$scope.invokeApi(ADHotelAnnouncementSrv.fetchSettingsDetails, {}, fetchCompletedOfSettingsDetails);



	/*
	* success call back of details web service call
	*/
	var successCallbackOfSaveDetails = function(data){
		$scope.$emit('hideLoader');
	};

	$scope.save = function(){
		var postingData = {};
		postingData.guest_zest_welcome_message = $scope.data.guest_zest_welcome_message;
		postingData.guest_zest_checkout_complete_message = $scope.data.guest_zest_checkout_complete_message;
		postingData.key_delivery_email_message = $scope.data.key_delivery_email_message;

		//calling the save api
		$scope.invokeApi(ADHotelAnnouncementSrv.saveAnnoucementSettings, postingData, successCallbackOfSaveDetails);
	}

}]);