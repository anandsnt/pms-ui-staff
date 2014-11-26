admin.controller('ADStationaryCtrl',['$scope','ADStationarySrv',function($scope,ADStationarySrv){

	BaseCtrl.call(this, $scope);
	$scope.errorMessage = '';

	$scope.init = function(){
		var successCallbackOfFetch = function(data){
			$scope.data = {};
			$scope.data = data;
			$scope.$emit('hideLoader');
		};
		$scope.invokeApi(ADStationarySrv.fetch, {}, successCallbackOfFetch);
	};

	$scope.init();

	$scope.toggleShowHotelAddress = function(){
		$scope.data.show_hotel_address = !$scope.data.show_hotel_address;
	};
	/*
	* success call back of details web service call
	*/
	var successCallbackOfSaveDetails = function(data){
		$scope.$emit('hideLoader');	
		$scope.errorMessage = '';
	};
	// Save changes button actions.
	$scope.clickedSave = function(){
		var postingData = dclone($scope.data,["guest_bill_template","hotel_logo"]);
		//calling the save api
		$scope.invokeApi(ADStationarySrv.saveStationary, postingData, successCallbackOfSaveDetails);
	};

}]);