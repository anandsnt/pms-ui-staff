admin.controller('ADDoorLockInterfaceCtrl',['$scope', '$rootScope','ADDoorlockInterfaceSrv', function($scope, $rootScope,ADDoorlockInterfaceSrv){

	BaseCtrl.call(this, $scope);

	var init = function(){
		fetchInterfaceDetails();
		$scope.authenticationKeyTypes = [{
            "value": "KEY_A",
            "name": "Key A"
        },
        {
            "value": "KEY_B",
            "name": "Key B"
        }];

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

	//check if any selected key card types require authentication
	$scope.needToShowAuthKeys = function(){
		var needToShowAuthKeys = false;
		angular.forEach($scope.data.available_card_types, function(item, index) {
			if(item.require_authentication && item.is_selected_for_hotel){
				needToShowAuthKeys = true;
				return false;
			}
        }); 
        return needToShowAuthKeys;
	};

	init();

}]);