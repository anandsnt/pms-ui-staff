admin.controller('ADStationaryCtrl',['$scope','ADStationarySrv',function($scope,ADStationarySrv){

	BaseCtrl.call(this, $scope);
	$scope.errorMessage = '';
	$scope.fileName = "Choose File....";
   	$scope.location_image_file = $scope.fileName;
   	

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
		$scope.goBackToPreviousState();
	};
	// Save changes button actions.
	$scope.clickedSave = function(){
		var postingData = dclone($scope.data,["guest_bill_template","hotel_logo"]);
		//calling the save api
		$scope.invokeApi(ADStationarySrv.saveStationary, postingData, successCallbackOfSaveDetails);
	};

	$scope.$watch(function(){
		return $scope.data.location_image;
	}, function(logo) {
				if(logo == 'false')
					$scope.fileName = "Choose File....";
				$scope.hotel_logo_file = $scope.fileName;
			}
		);
		/**
    *   To handle show hide status for the logo delete button
    */
    $scope.isLogoAvailable = function(logo){
    	if(logo != '/assets/logo.png' && logo != 'false')
    		return true;
    	else return false;
    };

}]);