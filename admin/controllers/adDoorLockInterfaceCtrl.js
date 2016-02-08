admin.controller('ADDoorLockInterfaceCtrl',['$scope', '$rootScope','ADDoorlockInterfaceSrv', function($scope, $rootScope,ADDoorlockInterfaceSrv){

	BaseCtrl.call(this, $scope);

	var init = function(){
		fetchInterfaceDetails();
		$scope.authenticationKeyTypes = [{
            "value": "A",
            "name": "Key A"
        },
        {
            "value": "B",
            "name": "Key B"
        }];

	};

	var setInitialExcludedList = function(){
		angular.forEach($scope.data.ios_versions, function(version){
			version.isExcluded = $scope.data.excluded_ios_versions.indexOf(version.name) !== -1
			version.value = version.name;
		})

		angular.forEach($scope.data.android_versions, function(version){
			version.isExcluded = $scope.data.excluded_android_versions.indexOf(version.name) !== -1
			version.value = version.name;
		})
	}

	var setFinalExcludedList = function(){
		$scope.data.excluded_ios_versions = [], $scope.data.excluded_android_versions = [];
		angular.forEach($scope.data.ios_versions, function(version){
			if(version.isExcluded)
               $scope.data.excluded_ios_versions.push(version.name);
		})

		angular.forEach($scope.data.android_versions, function(version){
			if(version.isExcluded)
               $scope.data.excluded_android_versions.push(version.name);
		})
	}

	var fetchInterfaceDetails = function(){
		var fetchSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.data = data;
			setInitialExcludedList();
		};
		$scope.invokeApi(ADDoorlockInterfaceSrv.fetch, {},fetchSuccessCallback);
	};

	$scope.clickedSave = function(){

		var hotelSupportedCardTypes = [];
		for(var i in $scope.data.available_card_types){
			if($scope.data.available_card_types[i].is_selected_for_hotel){
				hotelSupportedCardTypes.push($scope.data.available_card_types[i].value);
			}
		}
		setFinalExcludedList();
		var unwantedKeys = ["key_systems", "available_card_types"];
		var saveData = dclone($scope.data, unwantedKeys);
		saveData.hotel_supported_card_types = hotelSupportedCardTypes;


		var saveSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
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