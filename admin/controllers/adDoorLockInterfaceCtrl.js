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

        if (!inProd()){
            $scope.dirtyQuickList = false;
            watchQuickListChange();
            $scope.inProd = false;
        } else {
            $scope.inProd = true;
        }
	};
        
        var watchQuickListChange = function(){
            if ($scope.watchingList){
                return;
            }
            $scope.watchingList = true;
            $scope.$watch('data.selected_quick_key_system',function(to, from){
                console.log('selected_quick_key_system: ',arguments);
                if ($scope.dirtyQuickList){
                    if (to === 'Saflok - ATLAS'){
                        setToSaflokAtlas();
                    } else if (to === 'Salto - Space'){
                        setToSaltoSpace();
                    } else if (to === 'Salto - HAMS'){
                        setToSaltoHams();
                    } else if (to === 'Saflok - 6000'){
                        setToSaflokSixK();
                    }
                    //if you would like to use this for others, please add to the settings below
                    //just put the settings into the browser door lock interface page, open debugging network, click save, and view the request payload string, then add that similar to the below strings
                }
                if (!$scope.dirtyQuickList){
                    $scope.dirtyQuickList = true;
                }
            });
        };
        var setToSaflokSixK = function(){
            $scope.dirtyQuickList = false;
            var saveData = JSON.parse('{"enable_remote_encoding":true,"remove_leading_zero":false,"enable_mobile_app_key":false,"selected_key_system":2,"key_access_url":"http://71.163.154.179/LensPMSWebService","key_access_port":"","key_username":"DummyUser","key_password":"DummyPwd","mi_fare_authentication_key_a":"","mi_fare_authentication_key_b":"","mi_fare_authentication_aid":"","authentication_keytype":"A","max_primary_retries":"","secondary_key_access_url":"","secondary_key_access_port":"","secondary_key_username":"","max_secondary_retries":"","secondary_revert_time":"","secondary_key_password":"","is_mobile_key_supporting_ios":false,"min_ios_version_supported":"","excluded_ios_versions":[],"is_mobile_key_supporting_android":false,"min_android_version_supported":[],"excluded_android_versions":[],"ios_versions":[{"name":"8.0","value":"8.0","isExcluded":false},{"name":"8.1","value":"8.1","isExcluded":false},{"name":"8.1.1","value":"8.1.1","isExcluded":false},{"name":"8.2","value":"8.2","isExcluded":false},{"name":"8.3","value":"8.3","isExcluded":false},{"name":"8.4","value":"8.4","isExcluded":false},{"name":"8.4.1","value":"8.4.1","isExcluded":false},{"name":"9.0","value":"9.0","isExcluded":false},{"name":"9.0.1","value":"9.0.1","isExcluded":false},{"name":"9.0.2","value":"9.0.2","isExcluded":false},{"name":"9.1","value":"9.1","isExcluded":false},{"name":"9.2","value":"9.2","isExcluded":false},{"name":"9.2.1","value":"9.2.1","isExcluded":false},{"name":"9.3","value":"9.3","isExcluded":false}],"android_versions":[{"name":"4.0","value":"4.0","isExcluded":false},{"name":"4.0.1","value":"4.0.1","isExcluded":false},{"name":"4.0.2","value":"4.0.2","isExcluded":false},{"name":"4.0.3","value":"4.0.3","isExcluded":false},{"name":"4.0.4","value":"4.0.4","isExcluded":false},{"name":"4.1","value":"4.1","isExcluded":false},{"name":"4.1.1","value":"4.1.1","isExcluded":false},{"name":"4.1.2","value":"4.1.2","isExcluded":false},{"name":"4.2","value":"4.2","isExcluded":false},{"name":"4.2.1","value":"4.2.1","isExcluded":false},{"name":"4.2.2","value":"4.2.2","isExcluded":false},{"name":"4.3","value":"4.3","isExcluded":false},{"name":"4.4","value":"4.4","isExcluded":false},{"name":"4.4.1","value":"4.4.1","isExcluded":false},{"name":"4.4.2","value":"4.4.2","isExcluded":false},{"name":"4.4.3","value":"4.4.3","isExcluded":false},{"name":"4.4.4","value":"4.4.4","isExcluded":false},{"name":"5.0","value":"5.0","isExcluded":false},{"name":"5.0.1","value":"5.0.1","isExcluded":false},{"name":"5.0.2","value":"5.0.2","isExcluded":false},{"name":"5.1","value":"5.1","isExcluded":false},{"name":"5.1.1","value":"5.1.1","isExcluded":false},{"name":"6.0","value":"6.0","isExcluded":false},{"name":"6.0.1","value":"6.0.1","isExcluded":false}],"is_eod_in_progress":false,"is_eod_manual_started":false,"hotel_supported_card_types":[1,2,3,4,5,6]}');
		$scope.invokeApi(ADDoorlockInterfaceSrv.save, saveData, init);
        };
        var setToSaflokAtlas = function(){
            $scope.dirtyQuickList = false;
            var saveData = JSON.parse('{"enable_remote_encoding":true,"remove_leading_zero":false,"enable_mobile_app_key":false,"selected_key_system":"2","key_access_url":"http://71.163.154.179/ATLASKLIWS","key_access_port":"","key_username":"DummyUser","key_password":"DummyPwd","mi_fare_authentication_key_a":"","mi_fare_authentication_key_b":"","mi_fare_authentication_aid":"","authentication_keytype":"A","max_primary_retries":"","secondary_key_access_url":"","secondary_key_access_port":"","secondary_key_username":"","max_secondary_retries":"","secondary_revert_time":"","secondary_key_password":"","is_mobile_key_supporting_ios":false,"min_ios_version_supported":"","excluded_ios_versions":[],"is_mobile_key_supporting_android":false,"min_android_version_supported":[],"excluded_android_versions":[],"ios_versions":[{"name":"8.0","value":"8.0","isExcluded":false},{"name":"8.1","value":"8.1","isExcluded":false},{"name":"8.1.1","value":"8.1.1","isExcluded":false},{"name":"8.2","value":"8.2","isExcluded":false},{"name":"8.3","value":"8.3","isExcluded":false},{"name":"8.4","value":"8.4","isExcluded":false},{"name":"8.4.1","value":"8.4.1","isExcluded":false},{"name":"9.0","value":"9.0","isExcluded":false},{"name":"9.0.1","value":"9.0.1","isExcluded":false},{"name":"9.0.2","value":"9.0.2","isExcluded":false},{"name":"9.1","value":"9.1","isExcluded":false},{"name":"9.2","value":"9.2","isExcluded":false},{"name":"9.2.1","value":"9.2.1","isExcluded":false},{"name":"9.3","value":"9.3","isExcluded":false}],"android_versions":[{"name":"4.0","value":"4.0","isExcluded":false},{"name":"4.0.1","value":"4.0.1","isExcluded":false},{"name":"4.0.2","value":"4.0.2","isExcluded":false},{"name":"4.0.3","value":"4.0.3","isExcluded":false},{"name":"4.0.4","value":"4.0.4","isExcluded":false},{"name":"4.1","value":"4.1","isExcluded":false},{"name":"4.1.1","value":"4.1.1","isExcluded":false},{"name":"4.1.2","value":"4.1.2","isExcluded":false},{"name":"4.2","value":"4.2","isExcluded":false},{"name":"4.2.1","value":"4.2.1","isExcluded":false},{"name":"4.2.2","value":"4.2.2","isExcluded":false},{"name":"4.3","value":"4.3","isExcluded":false},{"name":"4.4","value":"4.4","isExcluded":false},{"name":"4.4.1","value":"4.4.1","isExcluded":false},{"name":"4.4.2","value":"4.4.2","isExcluded":false},{"name":"4.4.3","value":"4.4.3","isExcluded":false},{"name":"4.4.4","value":"4.4.4","isExcluded":false},{"name":"5.0","value":"5.0","isExcluded":false},{"name":"5.0.1","value":"5.0.1","isExcluded":false},{"name":"5.0.2","value":"5.0.2","isExcluded":false},{"name":"5.1","value":"5.1","isExcluded":false},{"name":"5.1.1","value":"5.1.1","isExcluded":false},{"name":"6.0","value":"6.0","isExcluded":false},{"name":"6.0.1","value":"6.0.1","isExcluded":false}],"is_eod_in_progress":false,"is_eod_manual_started":false,"hotel_supported_card_types":[1,2,3,4,5,6]}');
		$scope.invokeApi(ADDoorlockInterfaceSrv.save, saveData, init);
        };
        var setToSaltoHams = function(){
            $scope.dirtyQuickList = false;
            var saveData = JSON.parse('{"enable_remote_encoding":false,"remove_leading_zero":false,"enable_mobile_app_key":false,"selected_key_system":3,"key_access_url":"71.163.154.179","key_access_port":"8095","key_username":"","key_password":"","mi_fare_authentication_key_a":"15B5E04C4166","mi_fare_authentication_key_b":"EAAFCCB09D4C","mi_fare_authentication_aid":"","authentication_keytype":"B","max_primary_retries":"","secondary_key_access_url":"","secondary_key_access_port":"","secondary_key_username":"","max_secondary_retries":"","secondary_revert_time":"","secondary_key_password":"","is_mobile_key_supporting_ios":false,"min_ios_version_supported":"","excluded_ios_versions":[],"is_mobile_key_supporting_android":false,"min_android_version_supported":[],"excluded_android_versions":[],"ios_versions":[{"name":"8.0","value":"8.0","isExcluded":false},{"name":"8.1","value":"8.1","isExcluded":false},{"name":"8.1.1","value":"8.1.1","isExcluded":false},{"name":"8.2","value":"8.2","isExcluded":false},{"name":"8.3","value":"8.3","isExcluded":false},{"name":"8.4","value":"8.4","isExcluded":false},{"name":"8.4.1","value":"8.4.1","isExcluded":false},{"name":"9.0","value":"9.0","isExcluded":false},{"name":"9.0.1","value":"9.0.1","isExcluded":false},{"name":"9.0.2","value":"9.0.2","isExcluded":false},{"name":"9.1","value":"9.1","isExcluded":false},{"name":"9.2","value":"9.2","isExcluded":false},{"name":"9.2.1","value":"9.2.1","isExcluded":false},{"name":"9.3","value":"9.3","isExcluded":false}],"android_versions":[{"name":"4.0","value":"4.0","isExcluded":false},{"name":"4.0.1","value":"4.0.1","isExcluded":false},{"name":"4.0.2","value":"4.0.2","isExcluded":false},{"name":"4.0.3","value":"4.0.3","isExcluded":false},{"name":"4.0.4","value":"4.0.4","isExcluded":false},{"name":"4.1","value":"4.1","isExcluded":false},{"name":"4.1.1","value":"4.1.1","isExcluded":false},{"name":"4.1.2","value":"4.1.2","isExcluded":false},{"name":"4.2","value":"4.2","isExcluded":false},{"name":"4.2.1","value":"4.2.1","isExcluded":false},{"name":"4.2.2","value":"4.2.2","isExcluded":false},{"name":"4.3","value":"4.3","isExcluded":false},{"name":"4.4","value":"4.4","isExcluded":false},{"name":"4.4.1","value":"4.4.1","isExcluded":false},{"name":"4.4.2","value":"4.4.2","isExcluded":false},{"name":"4.4.3","value":"4.4.3","isExcluded":false},{"name":"4.4.4","value":"4.4.4","isExcluded":false},{"name":"5.0","value":"5.0","isExcluded":false},{"name":"5.0.1","value":"5.0.1","isExcluded":false},{"name":"5.0.2","value":"5.0.2","isExcluded":false},{"name":"5.1","value":"5.1","isExcluded":false},{"name":"5.1.1","value":"5.1.1","isExcluded":false},{"name":"6.0","value":"6.0","isExcluded":false},{"name":"6.0.1","value":"6.0.1","isExcluded":false}],"is_eod_in_progress":false,"is_eod_manual_started":false,"hotel_supported_card_types":[1,2,3,4,5,6]}');
		$scope.invokeApi(ADDoorlockInterfaceSrv.save, saveData, init);
        };
        var setToSaltoSpace = function(){
            $scope.dirtyQuickList = false;
            var saveData = JSON.parse('{"enable_remote_encoding":true,"remove_leading_zero":false,"enable_mobile_app_key":false,"selected_key_system":3,"key_access_url":"71.163.154.179","key_access_port":"8095","key_username":"","key_password":"","mi_fare_authentication_key_a":"BDCEBFB3FB3F275","mi_fare_authentication_key_b":"E09A90103E33","mi_fare_authentication_aid":"","authentication_keytype":"B","max_primary_retries":"","secondary_key_access_url":"","secondary_key_access_port":"","secondary_key_username":"","max_secondary_retries":"","secondary_revert_time":"","secondary_key_password":"","is_mobile_key_supporting_ios":false,"min_ios_version_supported":"","excluded_ios_versions":[],"is_mobile_key_supporting_android":false,"min_android_version_supported":[],"excluded_android_versions":[],"ios_versions":[{"name":"8.0","value":"8.0","isExcluded":false},{"name":"8.1","value":"8.1","isExcluded":false},{"name":"8.1.1","value":"8.1.1","isExcluded":false},{"name":"8.2","value":"8.2","isExcluded":false},{"name":"8.3","value":"8.3","isExcluded":false},{"name":"8.4","value":"8.4","isExcluded":false},{"name":"8.4.1","value":"8.4.1","isExcluded":false},{"name":"9.0","value":"9.0","isExcluded":false},{"name":"9.0.1","value":"9.0.1","isExcluded":false},{"name":"9.0.2","value":"9.0.2","isExcluded":false},{"name":"9.1","value":"9.1","isExcluded":false},{"name":"9.2","value":"9.2","isExcluded":false},{"name":"9.2.1","value":"9.2.1","isExcluded":false},{"name":"9.3","value":"9.3","isExcluded":false}],"android_versions":[{"name":"4.0","value":"4.0","isExcluded":false},{"name":"4.0.1","value":"4.0.1","isExcluded":false},{"name":"4.0.2","value":"4.0.2","isExcluded":false},{"name":"4.0.3","value":"4.0.3","isExcluded":false},{"name":"4.0.4","value":"4.0.4","isExcluded":false},{"name":"4.1","value":"4.1","isExcluded":false},{"name":"4.1.1","value":"4.1.1","isExcluded":false},{"name":"4.1.2","value":"4.1.2","isExcluded":false},{"name":"4.2","value":"4.2","isExcluded":false},{"name":"4.2.1","value":"4.2.1","isExcluded":false},{"name":"4.2.2","value":"4.2.2","isExcluded":false},{"name":"4.3","value":"4.3","isExcluded":false},{"name":"4.4","value":"4.4","isExcluded":false},{"name":"4.4.1","value":"4.4.1","isExcluded":false},{"name":"4.4.2","value":"4.4.2","isExcluded":false},{"name":"4.4.3","value":"4.4.3","isExcluded":false},{"name":"4.4.4","value":"4.4.4","isExcluded":false},{"name":"5.0","value":"5.0","isExcluded":false},{"name":"5.0.1","value":"5.0.1","isExcluded":false},{"name":"5.0.2","value":"5.0.2","isExcluded":false},{"name":"5.1","value":"5.1","isExcluded":false},{"name":"5.1.1","value":"5.1.1","isExcluded":false},{"name":"6.0","value":"6.0","isExcluded":false},{"name":"6.0.1","value":"6.0.1","isExcluded":false}],"is_eod_in_progress":false,"is_eod_manual_started":false,"hotel_supported_card_types":[1,5]}');
		$scope.invokeApi(ADDoorlockInterfaceSrv.save, saveData, init);
        };
        //var setToSaltoHams = function(){
            //$scope.dirtyQuickList = false;
            //var saveData = JSON.parse('{"enable_remote_encoding":true,"remove_leading_zero":false,"enable_mobile_app_key":false,"selected_key_system":3,"key_access_url":"71.163.154.179","key_access_port":"8095","key_username":"","key_password":"","mi_fare_authentication_key_a":"BDCEBFB3FB3F275","mi_fare_authentication_key_b":"E09A90103E33","mi_fare_authentication_aid":"","authentication_keytype":"B","max_primary_retries":"","secondary_key_access_url":"","secondary_key_access_port":"","secondary_key_username":"","max_secondary_retries":"","secondary_revert_time":"","secondary_key_password":"","is_mobile_key_supporting_ios":false,"min_ios_version_supported":"","excluded_ios_versions":[],"is_mobile_key_supporting_android":false,"min_android_version_supported":[],"excluded_android_versions":[],"ios_versions":[{"name":"8.0","value":"8.0","isExcluded":false},{"name":"8.1","value":"8.1","isExcluded":false},{"name":"8.1.1","value":"8.1.1","isExcluded":false},{"name":"8.2","value":"8.2","isExcluded":false},{"name":"8.3","value":"8.3","isExcluded":false},{"name":"8.4","value":"8.4","isExcluded":false},{"name":"8.4.1","value":"8.4.1","isExcluded":false},{"name":"9.0","value":"9.0","isExcluded":false},{"name":"9.0.1","value":"9.0.1","isExcluded":false},{"name":"9.0.2","value":"9.0.2","isExcluded":false},{"name":"9.1","value":"9.1","isExcluded":false},{"name":"9.2","value":"9.2","isExcluded":false},{"name":"9.2.1","value":"9.2.1","isExcluded":false},{"name":"9.3","value":"9.3","isExcluded":false}],"android_versions":[{"name":"4.0","value":"4.0","isExcluded":false},{"name":"4.0.1","value":"4.0.1","isExcluded":false},{"name":"4.0.2","value":"4.0.2","isExcluded":false},{"name":"4.0.3","value":"4.0.3","isExcluded":false},{"name":"4.0.4","value":"4.0.4","isExcluded":false},{"name":"4.1","value":"4.1","isExcluded":false},{"name":"4.1.1","value":"4.1.1","isExcluded":false},{"name":"4.1.2","value":"4.1.2","isExcluded":false},{"name":"4.2","value":"4.2","isExcluded":false},{"name":"4.2.1","value":"4.2.1","isExcluded":false},{"name":"4.2.2","value":"4.2.2","isExcluded":false},{"name":"4.3","value":"4.3","isExcluded":false},{"name":"4.4","value":"4.4","isExcluded":false},{"name":"4.4.1","value":"4.4.1","isExcluded":false},{"name":"4.4.2","value":"4.4.2","isExcluded":false},{"name":"4.4.3","value":"4.4.3","isExcluded":false},{"name":"4.4.4","value":"4.4.4","isExcluded":false},{"name":"5.0","value":"5.0","isExcluded":false},{"name":"5.0.1","value":"5.0.1","isExcluded":false},{"name":"5.0.2","value":"5.0.2","isExcluded":false},{"name":"5.1","value":"5.1","isExcluded":false},{"name":"5.1.1","value":"5.1.1","isExcluded":false},{"name":"6.0","value":"6.0","isExcluded":false},{"name":"6.0.1","value":"6.0.1","isExcluded":false}],"is_eod_in_progress":false,"is_eod_manual_started":false,"hotel_supported_card_types":[1,5]}');
		//$scope.invokeApi(ADDoorlockInterfaceSrv.save, saveData, init);
        //};
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
        
        var inProd = function(){
            var notProd = false;
            var url = true ? document.location : window.location;
            if (url.hostname){
                if (typeof url.hostname === typeof 'str'){
                    if (url.hostname.indexOf('pms-dev') !==-1 || //not listing release to verify this is not shown in near-production view
                        url.hostname.indexOf('192.168.1.218') !==-1 || 
                        url.hostname.indexOf('192.168.1.239') !==-1 || 
                        url.hostname.indexOf('localhost') !==-1){
                        notProd = true;
                    }
                }
            }
            if (!notProd){//in production, dont allow this function
                return true;
            } else return false;
        };
	var fetchInterfaceDetails = function(){
		var fetchSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.data = data;
                        if (!inProd()){
                            $scope.data.quick_key_systems = [
                                {value:'Saflok - 6000',name:'Saflok - 6000'}, 
                                {value: 'Saflok - ATLAS',name: 'Saflok - ATLAS'}, 
                                {value: 'Salto - HAMS',name: 'Salto - HAMS'}, 
                                {value: 'Salto - Space',name: 'Salto - Space'}
                               // {value:'VingCard', name: 'VingCard'}
                            ];
                        }
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
                if (!inProd()){
                    unwantedKeys.push("quick_key_systems");
                }
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