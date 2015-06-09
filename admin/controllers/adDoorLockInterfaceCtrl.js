admin.controller('ADDoorLockInterfaceCtrl',['$scope', '$rootScope','ADDoorlockInterfaceSrv', function($scope, $rootScope,ADDoorlockInterfaceSrv){

	BaseCtrl.call(this, $scope);

	var init = function(){
		fetchInterfaceDetails();

	};

	var fetchInterfaceDetails = function(){
		var fetchSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.data = data;
			console.log(data);
		};
		$scope.invokeApi(ADDoorlockInterfaceSrv.fetch, {},fetchSuccessCallback);
	};

	$scope.clickedSave = function(){

		console.log($scope.data);
		var hotelSupportedCardTypes = [];
		for(var i in $scope.data.available_card_types){
			if($scope.data.available_card_types[i].is_selected_for_hotel){
				hotelSupportedCardTypes.push($scope.data.available_card_types[i].value);
			}
		}
		var unwantedKeys = ["key_systems", "available_card_types"];
		var saveData = dclone($scope.data, unwantedKeys);
		saveData.hotel_supported_card_types = hotelSupportedCardTypes;
		console.log(saveData);


		var saveSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			//$scope.data = data;
			console.log(data);
			$scope.goBackToPreviousState();	
		};
		$scope.invokeApi(ADDoorlockInterfaceSrv.save, saveData, saveSuccessCallback);



	};



	init();

}]);