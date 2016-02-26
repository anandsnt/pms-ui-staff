sntZestStation.controller('zsHomeCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'zsModeConstants',
	'zsEventConstants','$stateParams','ngDialog','zsTabletSrv',
	function($scope, $rootScope, $state, zsModeConstants, zsEventConstants,$stateParams,ngDialog,zsTabletSrv) {

            
            $scope.keypath = '/assets/zest_station/css/icons/key.svg';
            
            
            /*
             * This is the main controller for the Home Screen + Admin Popup
             */
            $scope.storageKey = 'snt_zs_workstation';
            $scope.oosKey = 'snt_zs_workstation.in_oos';
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

	/**
	 * admin popup actions starts here
	 */
    var openAdminPopup = function() {
        $scope.idle_timer_enabled = false;
        $rootScope.$broadcast('STOP_TIMERS');
        $state.go('zest_station.admin-screen');
    };

    ($stateParams.isadmin == "true") ? openAdminPopup() : "";
        if (typeof cordova !== typeof undefined){
            $scope.ipad = true;
        } else {
            $scope.ipad = false;
        }

    $scope.cancelAdminSettings = function(){
        $state.go('zest_station.home');
        setTimeout(function(){
            $rootScope.$broadcast('REFRESH_SETTINGS',{'restart': true,'from_cancel': true});
        },500);
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
                    $scope.setPrinterLabel(sntZestStation.selectedPrinter);
                    $scope.$digest();
                }, function(error) {
                    alert('printer selection failed');
                }, 'RVCardPlugin', 'selectPrinter'
            );
        } 
    };
    
    $scope.selectedWorkstation;
    $scope.selectWorkStation = function(selected){
        if (selected === null){
            $scope.closeWorkStationList();
        } else {
            $scope.closeWorkStationList();
            if (selected){
                $scope.selectedWorkstationName = selected.name;
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
    $scope.saveAdminSettings = function(){
    	var saveCompleted = function(){
    		$scope.$emit('hideLoader');
                $scope.saveWorkStation();
    		$state.go('zest_station.home');
                $rootScope.$broadcast('UPDATE_IDLE_TIMER',$scope.savedSettings);
    	};
    	var params = {
            'kiosk': {
                'idle_timer':$scope.zestStationData.idle_timer
            }
        };
            console.info('$scope.zestStationData.selectedWorkStation: ',$scope.zestStationData.selectedWorkStation)
            params.kiosk.work_station = $scope.zestStationData.selectedWorkStation;
            if (!params.kiosk.work_station){
                $state.workstation_id = null;
                $scope.selectedWorkstation = null;
            } else {
                $state.workstation_id = params.kiosk.work_station.id;
                $scope.selectedWorkstation = params.kiosk.work_station.id;//for the workstation list view to show what is currently selected
            }
        //workstation.selected
        if (sntZestStation.selectedPrinter){
            params.printer = sntZestStation.selectedPrinter;
        }

        var options = {
    		params: 			params,
    		successCallBack: 	saveCompleted
        };
        $scope.savedSettings = params;
        $scope.callAPI(zsTabletSrv.saveSettings, options);
    };
    $scope.savedSettings = {};
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
                $rootScope.$broadcast('START_TIMERS');
                $rootScope.$broadcast('REFRESH_SETTINGS');
    	};
        var station = $scope.getWorkStation();
        var params = {};
        if (station){
            var params = {
                'default_key_encoder_id': station.key_encoder_id,
                'identifier': station.station_identifier,
                'name': station.name,
                'rover_device_id': station.rover_device_id,
                'is_out_of_order': station.is_out_of_order,
                'out_of_order_msg': station.out_of_order_msg,
                'emv_terminal_id': station.emv_terminal_id,
                'id':station.id
            };
            $scope.zestStationData.selectedWorkStation = station.id;
            $rootScope.$broadcast('UPDATE_WORKSTATION',{id: station.station_identifier});
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
    $scope.getStationIdFromName = function(name){
      if (name === ''){
          return null;
      }  else {
           for (var i in $scope.zestStationData.workstations){
            if ($scope.zestStationData.workstations[i].name === name){
                return $scope.zestStationData.workstations[i].id;
            }
        }
      }
    };
    $scope.initialWorkstation = false;
    $scope.$watch('workstation.selected',function(to, from){
        if (to){
            $scope.set_workstation_id = $scope.getStationIdFromName(to);
            $scope.initialWorkstation = true;
            $scope.setWorkstationPrinter($scope.set_workstation_id);
        }
        
    });
    $scope.saveWorkStation = function(){
        if ($scope.workstation !== ''){
            for (var i in $scope.zestStationData.workstations){
                if ($scope.zestStationData.workstations[i].name === $scope.workstation.selected){
                    $scope.zestStationData.selectedWorkStation = $scope.zestStationData.workstations[i].station_identifier;
                }
            }
        } else {
            $scope.zestStationData.selectedWorkStation = '';
        }
             $scope.saveSelected();
                //also update and save off the printer value to the workstation
            $scope.saveWorkStationPrinter();
            $scope.setStationEncoder();
    };
    
    
    $scope.saveSelected = function(){
        var storageKey = $scope.storageKey,
                storage = localStorage;
            try {
                storage.setItem(storageKey, $scope.zestStationData.selectedWorkStation);
            } catch(err){
                console.warn(err);
            }
    };
        $scope.checkOOSInBrowser = function(){
            return;
             var storageKey = $scope.oosKey,
                    storage = localStorage,
                    oos = {};
            
            try {
               oos = storage.getItem(storageKey);
            } catch(err){
                console.warn(err);
            }
            console.info('oos: ',oos)
            if (oos){
                $scope.oos_message = true;
                $scope.oos_message_value = $scope.zestStationData.oos_message_value;
               //storage.setItem(storageKey, false);
                //$rootScope.$broadcast(zsEventConstants.PUT_OOS);
                //$state.isOOS = true;
            } else {
                $state.isOOS = false;
            }
        };
        
    $scope.setStationEncoder = function(){
         var storageKeyEncoder = $scope.storageKeyEncoder,
                storage = localStorage;
        var station = $scope.getWorkStation();
        
            try {
                $scope.zestStationData.selectedWorkStation = station.station_identifier;
                console.info('saved selected workstation;')
                storage.setItem(storageKeyEncoder, station.station_identifier);
            } catch(err){
                console.warn(err);
            }
    };
    $scope.setWorkstationPrinter = function(id){
        var printer = '';
        for (var i in $scope.zestStationData.workstations){
            if ($scope.zestStationData.workstations[i].id === id){
                printer = $scope.zestStationData.workstations[i].printer;
                sntZestStation.selectedPrinter = printer;
                $scope.setPrinterLabel(printer); 
            }
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
                if (station){
                    for (var i in $scope.zestStationData.workstations){
                        if ($scope.zestStationData.workstations[i].id === station.id){
                            $scope.set_workstation_id = station.id;
                            $scope.zestStationData.workstations[i].selected = true;
                            $scope.zestStationData.selectedWorkStation = station.station_identifier;
                            $scope.selectedWorkstationName = $scope.zestStationData.workstations[i].name;
                            $scope.setPrinterLabel($scope.zestStationData.workstations[i].printer);
                            
                        } else {
                            $scope.zestStationData.workstations[i].selected = false;
                        }
                    }
                }
            } 
        } 
        return station;
    };  
    $scope.printerName = '';
    $scope.setPrinterLabel = function(name){
        if (name && typeof name === typeof 'str'){
             if (name.length > 1){
                 //printer name convention has something like IPP://somename..
                 //so lets pull out that IPP:// from the display to user, so they will see its
                 //HP or other printer identifiers
                 var str = name.split('ipp://');
                 if (str[1]){
                     name = str[1];
                 }
             } else {
                name = 'Select';
             }
        } else {
            name = 'Select';
        }
        $scope.printerName = name;
    };
    $scope.selectedWorkstationName = '';
    $scope.getWorkStation();
    
    $scope.openWorkStationList = function(){
        $scope.selectedWorkstation = $state.workstation_id;
        
    };
    
    $scope.workStationObj = {};
    $scope.$watch('zestStationData.workstations',function(){
        $scope.workStationObj = {};
        if ($scope.zestStationData){
            for (var i in $scope.zestStationData.workstations){
                if ($scope.zestStationData.workstations[i].id === $scope.zestStationData.selectedWorkStation){
                    $scope.workStationObj = $scope.zestStationData.workstations[i];
                }
            }
        }
    });
    $scope.theme = '';
    $scope.workstation = '';
    $scope.hasWorkstation = function(){
          //returns true/false if a workstation is currently assigned;
          // if no workstation assigned or if workstation status fetch fails, device should go OOS;
          var hasWorkstation = false;
          if (!$scope.zestStationData || $scope.zestStationData.workstations === 'Select'){
              if ($scope.zestStationData.workstations === 'Select'){
                  console.info('at least 1 workstation must be configured');
              }
              return false;//there are no workstations assigned, at least 1 workstation must be available
          } else {
              if ($state.hasWorkstation){
                  return true;
              }
          }
          return hasWorkstation;
        };
        $scope.checkWorkstation = function(){
            setTimeout(function(){
                if (!$scope.workstations || $scope.workstations.length === 0){
                    $scope.$emit(zsEventConstants.PUT_OOS);
                } else {
                    if (!$scope.hasWorkstation()){
                        $scope.$emit(zsEventConstants.PUT_OOS);
                    }
                }
            },500);
        };
        $scope.fetchWorkStations = function(){
            var onSuccess = function(response){
                if (response){
                    $scope.workstations = response.work_stations;
                    $scope.checkWorkstation();
                }
            };
            var onFail = function(response){
                console.warn('fetching workstation list failed:',response);
                $scope.$emit(zsEventConstants.PUT_OOS);
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
    $scope.$on ('THEME_UPDATE', function(event) {
        //set theme updates from state
        $scope.theme = $state.theme;
    });
    $scope.oos_message = false;
    $scope.oos_message_value = '';
    $scope.$on ('ZS_SETTINGS_UPDATE', function(event) {
        if ($scope.zestStationData.oos_message_value !== '' && $scope.zestStationData.is_oos){
            $scope.oos_message = true;
            $scope.oos_message_value = $scope.zestStationData.oos_message_value;
        } else {
            $scope.oos_message_value = '';
        }
        //if was oos and now back in service, put it back in servce..
        var shouldBeInOOS = $state.is_oos, isCurrentlyInOOS  = function(){
            return $state.current.name === "zest_station.oos";
        };
        if (!shouldBeInOOS && isCurrentlyInOOS()){
            $state.go ('zest_station.home');
        }
    });
    $scope.resetFlags = function(){
        $state.skipCheckinEmail = false;
        $state.updatedEmail = false;
        $state.skipCheckoutEmail = false;
        $state.checkout_finalmode = false;
        $state.emailEdited = false;
        $state.emailError = false;
    };
    $rootScope.$watch('iconsPath',function(to, from){
        if (to){
            $scope.iconsPath = $rootScope.iconsPath;
            $scope.icons = {
                url: {
                    key: $scope.iconsPath+'/key.svg',
                    checkin: $scope.iconsPath+'/checkin.svg',
                    checkout: $scope.iconsPath+'/checkout.svg'
                }
            };
        }
            
    });
    
    
    $scope.saveSettings = function(){
        //save settings 
        //update workstation printer
        //set in cache
        
        
        
    };
    
    
    
    $scope.init = function(){
        
        $scope.resetFlags();
        var current = $state.current.name;
        if (current === 'zest_station.admin-screen'){
           
        } else if (current === 'zest_station.oos'){
            $scope.$emit('REFRESH_SETTINGS');
        } else {

            $scope.theme = $state.theme;
            $scope.fetchWorkStations();
            $scope.checkOOSInBrowser(); //this will check if the device was put into OOS, if the device has been reset this should place it back into OOS
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
                $scope.$emit('REFRESH_SETTINGS');
        }
    };
    
    
    $scope.init();
    
}]);