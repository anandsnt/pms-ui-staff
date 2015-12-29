sntZestStation.controller('zsHomeCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'zsModeConstants',
	'zsEventConstants','$stateParams','ngDialog','zsTabletSrv',
	function($scope, $rootScope, $state, zsModeConstants, zsEventConstants,$stateParams,ngDialog,zsTabletSrv) {
            
            /*
             * This is the main controller for the Home Screen + Admin Popup
             */
            
            
            $scope.storageKey = 'snt_zs_workstation';
         //   $scope.oosKey = 'snt_zs_workstation.in_oos';
            $scope.storageKeyEncoder = 'snt_zs_encoder';
	/**
	 * when we clicked on pickup key from home screen
	 */
	$scope.clickedOnPickUpKey = function() {
            $state.mode = zsModeConstants.PICKUP_KEY_MODE;
            $state.lastAt = 'home';
            $state.isPickupKeys = true;
            $state.mode = zsModeConstants.PICKUP_KEY_MODE;
            $state.go('zest_station.reservation_search', {
                mode: zsModeConstants.PICKUP_KEY_MODE
            });
	};

	/**
	 * when we clicked on checkin from home screen
	 */
	$scope.clickedOnCheckinButton = function() {
            $state.mode = zsModeConstants.CHECKIN_MODE;
            $state.isPickupKeys = false;
            $state.lastAt = 'home';
            $state.mode = zsModeConstants.CHECKIN_MODE;
            $state.go('zest_station.find_reservation_input_last', {
                mode: zsModeConstants.CHECKIN_MODE
            });
	};

	/**
	 * when we clicked on checkout from home screen
	 */
	$scope.clickedOnCheckoutButton = function() {
            $state.lastAt = 'home';
            $state.isPickupKeys = false;
            $state.mode = zsModeConstants.CHECKOUT_MODE;
            $state.go('zest_station.reservation_search', {
                mode: zsModeConstants.CHECKOUT_MODE
            });
	};

	/**
	 * [initializeMe description]
	 */
	var initializeMe = function() {
		//show back button
		$scope.$emit (zsEventConstants.HIDE_BACK_BUTTON);

		//show close button
		$scope.$emit (zsEventConstants.HIDE_CLOSE_BUTTON);
	}();



        
        //$scope.oosStatus = 'disabled';
        /*
        $scope.getOOSCurrentSetting = function(){
             var storageKey = $scope.oosKey,
                    storage = localStorage;
                console.log('storageKey: ',storageKey);
            try {
               if (storage.getItem(storageKey)){
                   $scope.oosStatus = 'enabled';
               } else {
                   $scope.oosStatus = 'disabled';
               }
               console.log('oos is currently '+$scope.oosStatus);
            } catch(err){
                console.warn(err);
            }
            console.info(storage.getItem(storageKey));
        };
        */
        
	/**
	 * admin popup actions starts here
	 */
    var openAdminPopup = function() {
       // $scope.oosStatus = 'test';
       // $scope.getOOSCurrentSetting();
        $scope.idle_timer_enabled = false;
        ngDialog.open({
            template: '/assets/partials/rvAdminPopup.html',
          //  className: 'ngdialog-theme-default',
            closeByDocument: false,
            scope: $scope,
            closeByEscape: false
        });

        setTimeout(function(){
            $('.ngdialog-close').hide();
            $('.ngdialog-content').css("padding", "0");
        },50);
    };

    ($stateParams.isadmin == "true") ? openAdminPopup() : "";
        if (typeof cordova !== typeof undefined){
            $scope.ipad = true;
        } else {
            $scope.ipad = false;
        }

    $scope.cancelAdminSettings = function(){
    	$scope.closeDialog();
    };

    $scope.updateSettings = function(value){
    	$scope.zestStationData.idle_timer.enabled = (value === 'true') ? true:false;
    };
    

    $scope.openPrinterMenu = function(){
        var onSuccess = function(success){
            alert(JSON.stringify(success));
        };
        var onFail = function(err){
            alert(JSON.stringify(err));
        };
        
        if (typeof cordova !== typeof undefined){
            //cordova.exec(onSuccess, onFail, 'RVCardPlugin', 'selectPrinter', [1024, 50])
        cordova.exec(
                function(success){
                    //sntZestStation.selectedPrinter = JSON.stringify(success);
                    sntZestStation.selectedPrinter = success;

                }, function(error) {
                    alert('printer selection failed');
                }, 'RVCardPlugin', 'selectPrinter'
            );
        } 
    };
    
    
    
    $scope.selectWorkStation = function(selected){
        if (selected === null){
            $scope.closeWorkStationList();
        } else {
            $scope.closeWorkStationList();
            if (selected){
                for (var i in $scope.zestStationData.workstations){
                    if ($scope.zestStationData.workstations[i].id === selected.id){
                        $scope.zestStationData.workstations[i].selected = true;
                        $scope.zestStationData.selectedWorkStation = selected.station_identifier;
                    } else {
                        $scope.zestStationData.workstations[i].selected = false;
                    }
                }
            }
        }
    };
    /*
    $scope.toggleOOS = function(){
        console.info('toggleOOS');
        if ($state.isOOS){
            $rootScope.$emit(zsEventConstants.OOS_OFF);
        } else {
            $rootScope.$emit(zsEventConstants.OOS_OFF);
        }
    };
            */
        
    $scope.saveAdminSettings = function(){
    	var saveCompleted = function(){
    		$scope.$emit('hideLoader');
                $scope.saveWorkStation();
    		$scope.closeDialog();
    	};
    	var params = {
            'kiosk': {
                'idle_timer':$scope.zestStationData.idle_timer
            }
        };
        
        if ($scope.zestStationData.selectedWorkStation !== 'Select'){
            params.kiosk.work_station = $scope.zestStationData.selectedWorkStation;
            $state.workstation_id = params.kiosk.work_station.id;
        }
        
        if (sntZestStation.selectedPrinter){
            params.printer = sntZestStation.selectedPrinter;
        }

        var options = {
    		params: 			params,
    		successCallBack: 	saveCompleted
        };
        $scope.callAPI(zsTabletSrv.saveSettings, options);
    };
    $scope.browserStorageSupported = false;
    $scope.checkBrowserStorageSupport = function(){
        if(typeof(Storage) !== "undefined") {
            $scope.browserStorageSupported = true;
        } else {
            $scope.browserStorageSupported = false;
        }
    };
    $scope.saveWorkStationPrinter = function(){
        var saveCompleted = function(){
    		$scope.$emit('hideLoader');
    	};
        var station = $scope.getWorkStation();
        var params = {};
        if (station){
            var params = {
                'default_key_encoder_id': station.key_encoder_id,
                'identifier': station.station_identifier,
                'name': station.name,
                'id':station.id
            };
        };
       
        if (typeof params.default_key_encoder_id !== typeof undefined){
        //first set as a convenient global, then save to localstorage
            sntZestStation.encoder = params.default_key_encoder_id;
        }
       
        if (sntZestStation.selectedPrinter){
            params.printer = sntZestStation.selectedPrinter;
        }

        var options = {
    		params: 			params,
    		successCallBack: 	saveCompleted
        };
        if (station){
           $scope.callAPI(zsTabletSrv.updateWorkStations, options);
        }
    };
    $scope.saveWorkStation = function(){
         var storageKey = $scope.storageKey,
                storage = localStorage;
            try {
                storage.setItem(storageKey, $scope.zestStationData.selectedWorkStation);
            } catch(err){
                console.warn(err);
            }
            //also update and save off the printer value to the workstation
            $scope.saveWorkStationPrinter();
            $scope.setStationEncoder();
    };
    /*
        $scope.checkOOSInBrowser = function(){
             var storageKey = $scope.oosKey,
                    storage = localStorage,
                    oos = {};
            
                console.log('storageKey: ',storageKey);
            try {
               oos = storage.getItem(storageKey);
            } catch(err){
                console.warn(err);
            }
            console.info('oos; ',oos);
            if (oos){
                $rootScope.$broadcast(zsEventConstants.PUT_OOS);
                $state.isOOS = true;
            } else {
                $state.isOOS = false;
            }
        };
        */
        
    $scope.setStationEncoder = function(){
         var storageKeyEncoder = $scope.storageKeyEncoder,
                storage = localStorage;
        var encoder = $scope.getWorkStation();
        
            try {
                storage.setItem(storageKeyEncoder, encoder.station_identifier);
            } catch(err){
                console.warn(err);
            }
    };
    $scope.getWorkStation = function(){
        /*
         * This method will get the device's last saved workstation, and from the last fetched list of workstations
         * will set the workstation for the UI, which is also used in determining the device's default printer
         */
         var storageKey = $scope.storageKey,
                storage = localStorage,
                storedWorkStation = '',
                station;
        
        try {
           storedWorkStation = storage.getItem(storageKey);
        } catch(err){
            console.warn(err);
        }
        if ($scope.zestStationData){
            if ($scope.zestStationData.workstations && $scope.zestStationData.workstations.length > 0){
                for (var i in $scope.zestStationData.workstations){
                    if ($scope.zestStationData.workstations[i].station_identifier === storedWorkStation){
                        $scope.zestStationData.selectedWorkStation = storedWorkStation;
                        station = $scope.zestStationData.workstations[i];
                    }
                }
            } 
        } 
        return station;
    };  
    $scope.getWorkStation();
    $scope.showWorkStationList = false;
    
    $scope.openWorkStationList = function(){
        $scope.showWorkStationList = true;
       // $('.ngdialog-content').addClass('zoku-style');
        
    };
    $scope.closeWorkStationList = function(){
        $scope.showWorkStationList = false;
    };
    
    $scope.workStationObj = {};
    /*
    $scope.$watch('zestStationData.selectedWorkStation',function(){
        $scope.workStationObj = {};
        for (var i in $scope.zestStationData.workstations){
            if ($scope.zestStationData.workstations[i].id === $scope.zestStationData.selectedWorkStation){
                $scope.workStationObj = $scope.zestStationData.workstations[i];
            }
        }
    });
    */
    $scope.$watch('zestStationData.workstations',function(){
        $scope.workStationObj = {};
        for (var i in $scope.zestStationData.workstations){
            if ($scope.zestStationData.workstations[i].id === $scope.zestStationData.selectedWorkStation){
                $scope.workStationObj = $scope.zestStationData.workstations[i];
            }
        }
    });
    
        $scope.fetchWorkStations = function(){
            var onSuccess = function(response){
                if (response){
                    $scope.workstations = response.work_stations;
                  //  $scope.setWorkStation();
                }
            };
            var onFail = function(response){
                console.warn('fetching workstation list failed:',response);
                //$scope.$emit(zsEventConstants.PUT_OOS);
            };
            var options = {
                params:                 {
                    page: 1,
                    per_page: 100,
                    query:'',
                    sort_dir: true,
                    sort_field: 'name'
                },
                successCallBack: 	onSuccess,
                failureCallBack:        onFail
            };
            $scope.callAPI(zsTabletSrv.fetchWorkStations, options);
        };  
    
    $scope.init = function(){
        $scope.fetchWorkStations();
     //   $scope.checkOOSInBrowser(); //this will check if the device was put into OOS, if the device has been reset this should place it back into OOS
        $state.input = {};  
            if (typeof cordova !== typeof undefined){
            setTimeout(function(){
                    $('.modal-content').addClass('ng-hide');
                    $('.tablet-popup').addClass('size-up');

                    setTimeout(function(){
                        $('.modal-content').removeClass('ng-hide');
                        $scope.$apply();
                    },100);
                        $scope.$apply();
                },50);
            }
    };
    
    
    $scope.init();
    
}]);