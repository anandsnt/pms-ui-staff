admin.controller('ADGuestReviewSetupCtrl', ['$scope', '$state', 'ADGuestReviewSetupSrv','$rootScope', function($scope, $state, ADGuestReviewSetupSrv,$rootScope){

	/*
	* controller class for guest review setup
	*/

	BaseCtrl.call(this, $scope);
	$scope.errorMessage = '';

	//scope varibales
	$scope.rating_list = [{'name':'1', 'value': '1'}, {'name':'2', 'value': '2'}, {'name':'3', 'value': '3'}, {'name':'4', 'value': '4'}, {'name':'5', 'value': '5'}];



	/*
	* success call back of details web service call
	*/
	var fetchCompletedOfSettingsDetails = function(data){
		$scope.$emit('hideLoader');
		$scope.data = data;

	};

	//fetching the settings details
	$scope.invokeApi(ADGuestReviewSetupSrv.fetchGuestSetupDetails, {}, fetchCompletedOfSettingsDetails);

	/*
	* success call back of details web service call
	*/
	var successCallbackOfSaveDetails = function(data){
		$scope.$emit('hideLoader');
	};

	$scope.save = function(){
		var postingData = {};
		postingData.is_guest_reviews_on = $scope.data.is_guest_reviews_on;
		postingData.number_of_reviews = $scope.data.number_of_reviews;
		postingData.rating_limit = $scope.data.rating_limit;

		//calling the save api
		$scope.invokeApi(ADGuestReviewSetupSrv.saveGuestReviewSetup, postingData, successCallbackOfSaveDetails);
	};

}]);