admin.controller('ADSocialLobbySettingsCtrl', ['$scope','$rootScope', '$state', 'ADSocialLobbySrv', function($scope, $rootScope,$state, ADSocialLobbySrv){

   	/*
	* controller class for social lobby settings
	*/
	BaseCtrl.call(this, $scope);
	$scope.errorMessage = '';

	//scope varibales
	$scope.arrival_grace_days_list = [{'name':'1', 'value': '1'}, {'name':'2', 'value': '2'}, {'name':'3', 'value': '3'}, {'name':'4', 'value': '4'}, {'name':'5', 'value': '5'}];
	$scope.departure_grace_days_list = [{'name':'1', 'value': '1'}, {'name':'2', 'value': '2'}, {'name':'3', 'value': '3'}, {'name':'4', 'value': '4'}, {'name':'5', 'value': '5'}];


	/*
	* success call back of details web service call
	*/
	var fetchCompletedOfSettingsDetails = function(data){
		$scope.$emit('hideLoader');
		$scope.data = data;

	};

	//fetching the settings details
	$scope.invokeApi(ADSocialLobbySrv.fetchSettingsDetails, {}, fetchCompletedOfSettingsDetails);



	/*
	* success call back of details web service call
	*/
	var successCallbackOfSaveDetails = function(data){
		$scope.$emit('hideLoader');
	};

	$scope.save = function(){
		var postingData = {};
		postingData.is_social_lobby_on = $scope.data.is_social_lobby_on;
		postingData.is_my_group_on = $scope.data.is_my_group_on;
		postingData.arrival_grace_days = $scope.data.arrival_grace_days;
		postingData.departure_grace_days = $scope.data.departure_grace_days;

		//calling the save api
		$scope.invokeApi(ADSocialLobbySrv.saveSocialLobbySettings, postingData, successCallbackOfSaveDetails);
	};

}]);