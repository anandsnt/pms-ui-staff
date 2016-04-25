sntZestStation.controller('zsHomeCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'zsModeConstants',
	'zsEventConstants','$stateParams','ngDialog','zsTabletSrv','$window',
	function($scope, $rootScope, $state, zsModeConstants, zsEventConstants,$stateParams,ngDialog,zsTabletSrv,$window) {

            /*
             * This is the main controller for the Home Screen + Admin Popup
             */
            $scope.storageKey = 'snt_zs_workstation';
            $scope.oosReason = 'snt_zs_workstation.oos_reason';
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
        
        var appWentToOOS = false;//no other way to handle this
        //oos is been called from here and there, i can't track like this
        if($scope.zestStationData.wsIsOos &&  appWentToOOS){
                //update work station status
                $scope.zestStationData.workstationOooReason = angular.copy($scope.zestStationData.wsFailedReason);
                $scope.$emit(zsEventConstants.UPDATE_LOCAL_STORAGE_FOR_WS,{'status':'out-of-order','reason':$scope.zestStationData.workstationOooReason});
                appWentToOOS = true;
                $state.go('zest_station.oos');
        }
	/**
	 * when we clicked on checkout from home screen
	 */
	$scope.clickedOnCheckoutButton = function() {
            $state.lastAt = 'home';
            $state.isPickupKeys = false;
            $state.mode = zsModeConstants.CHECKOUT_MODE;


            if(!$scope.zestStationData.checkout_keycard_lookup){
                $state.go('zest_station.reservation_search', {
                    mode: zsModeConstants.CHECKOUT_MODE
                });
            }
            else{
                $state.go('zest_station.checkout_options');
            };
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
    // var openAdminPopup = function() {
    //     $scope.idle_timer_enabled = false;
    //     $rootScope.$broadcast('STOP_TIMERS');
    //     $state.go('zest_station.admin-screen');
    // };

    // ($stateParams.isadmin == "true") ? openAdminPopup() : "";
    //     if (typeof cordova !== typeof undefined){
    //         $scope.ipad = true;
    //     } else {
    //         $scope.ipad = false;
    //     }

    // $scope.cancelAdminSettings = function(){
    //     $state.go('zest_station.home');
    //     setTimeout(function(){
    //         $rootScope.$broadcast('REFRESH_SETTINGS',{'restart': true,'from_cancel': true});
    //     },500);
    // };

    // //to logout
    // $scope.logOutApplication = function(){
    //     if (typeof chrome !== "undefined"){
    //         var chromeAppId = $scope.zestStationData.chrome_app_id; // chrome app id 
    //         console.info("chrome app id"+chromeAppId);
    //         //minimize the chrome app on loging out
    //         (chromeAppId !== null && chromeAppId.length > 0) ? chrome.runtime.sendMessage(chromeAppId,"zest-station-logout"):"";
    //         console.info("login out from chrome");
    //     }
    //     else{
    //          console.info("login out");
    //     };
    //     $window.location.href = '/station_logout'; 
    // };

    $scope.updateSettings = function(value){
    	$scope.zestStationData.idle_timer.enabled = (value === 'true') ? true:false;
    };
    

    // $scope.openPrinterMenu = function(){
    //     var onSuccess = function(success){
    //         alert(JSON.stringify(success));
    //     };
    //     var onFail = function(err){
    //         alert(JSON.stringify(err));
    //     };
        
    //     if (typeof cordova !== typeof undefined){
    //         //cordova.exec(onSuccess, onFail, 'RVCardPlugin', 'selectPrinter', [1024, 50])
    //     cordova.exec(
    //             function(success){
    //                 //sntZestStation.selectedPrinter = JSON.stringify(success);
    //                 $scope.savedSettings.printer = success;//save to the save params here
                    
    //                 $scope.setPrinterLabel($scope.savedSettings.printer);
    //                 $scope.$digest();
    //             }, function(error) {
    //                 alert('printer selection failed');
    //             }, 'RVCardPlugin', 'selectPrinter'
    //         );
    //     } 
    // };
    
    // $scope.selectedWorkstation;
    // $scope.getCurrentWorkstation = function(){
    //     for (var i in $scope.zestStationData.workstations){
    //         if ($scope.zestStationData.workstations[i].id === $scope.set_workstation_id){
    //             return $scope.zestStationData.workstations[i];
    //         } 
    //     }
    //     return '';
        
    // };
    
    
    
    // $scope.selectWorkStation = function(selected){
    //     if (selected === null){
    //         $scope.closeWorkStationList();
    //     } else {
    //         $scope.closeWorkStationList();
    //         if (selected){
    //             $scope.selectedWorkstationName = selected.name;
    //             for (var i in $scope.zestStationData.workstations){
    //                 if ($scope.zestStationData.workstations[i].id === selected.id){
    //                     $scope.zestStationData.workstations[i].selected = true;
    //                     $scope.zestStationData.selectedWorkStation = selected.station_identifier;
    //                 } else {
    //                     $scope.zestStationData.workstations[i].selected = false;
    //                 }
    //             }
    //         }
    //     }
    // };
    
    
    // $scope.onAdminSaveComplete = function(response){
    //     $scope.$emit('hideLoader');
    //     $state.go('zest_station.home');
    //     $rootScope.$broadcast('UPDATE_IDLE_TIMER',$scope.savedSettings);
    // };
    // $scope.saveWorkstationInfo = function(id){
    //     //save workstation to state/cache
    //     //update workstation with printer info
    //     if (!id){
    //         $state.workstation_id = '';
    //         $scope.selectedWorkstation = '';
    //     } else {
    //         $state.workstation_id = id;
    //         $scope.selectedWorkstation = id;//for the workstation list view to show what is currently selected
    //     }
    //     $scope.saveWorkStation(id);
        
    // };
    // $scope.saveAdminSettings = function(){
    //     var params = $scope.getSettings();
    //     $scope.saveWorkstationInfo(params.kiosk.workstation.station_identifier);
    //     delete params.kiosk.workstation;
    //     var options = {
    // 		params: 			params,
    // 		successCallBack: 	$scope.onAdminSaveComplete
    //     };
    //     $scope.savedSettings = params;
    //     $scope.callAPI(zsTabletSrv.saveSettings, options);
    // };
    $scope.savedSettings = {};
    $scope.browserStorageSupported = false;
    $scope.checkBrowserStorageSupport = function(){
        if(typeof(Storage) !== "undefined") {
            $scope.browserStorageSupported = true;
        } else {
            $scope.browserStorageSupported = false;
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
        }
       // $scope.setWorkstationPrinter($scope.set_workstation_id);
        
    });
    
    $scope.getSavedWorkStation = function(){
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
        var station = $scope.getSavedWorkStationObj(storedWorkStation);
        if (typeof station === typeof undefined){
            return null;
        }
        else{
        
           $scope.zestStationData.workstationStatus = station.is_out_of_order ? 'out-of-order':'in-order';
           //$scope.zestStationData.workstationOooReason = station.out_of_order_msg;



            var oosStorageKey = 'snt_zs_workstation.in_oos',
                oosReasonKey  = 'snt_zs_workstation.oos_reason',
                storage = localStorage;
            try {
             //  workstationStatus = storage.getItem(oosStorageKey);
               $scope.zestStationData.workstationOooReason = storage.getItem(oosReasonKey);
              // $scope.zestStationData.workstationStatus = workstationStatus;
            } catch(err){
                console.warn(err);
            }
        }
        return station;
    };  
    $scope.getSavedWorkStationObj = function(stored_station_id){
        var station;
        if ($scope.zestStationData){
            var stations = $scope.zestStationData.workstations;
            if (stations && stations.length > 0){
                for (var i in stations){
                    if (stations[i].station_identifier === stored_station_id){
                        station = stations[i];
                    }
                }
                
                
            } 
        } 
        return station;  
    };
    $scope.printer = {
        name: ''
    };
    $scope.setSavedWorkstation = function(){
        $scope.savedStationObj = $scope.getSavedWorkStation();
        
    };
    $scope.selectedWorkstationName = '';
    
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
        $scope.oosIfNoWorkstations = function(){
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
                    $scope.oosIfNoWorkstations();//if no workstations are available, place oos
                    // if ($state.current.name === 'zest_station.admin-screen'){
                        $scope.setAdminSettings();
                    // }
                }
            };
            var onFail = function(response){
                console.warn('fetching workstation list failed:',response);
                $scope.$emit(zsEventConstants.PUT_OOS);
            };
            var options = {
                params: {
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
        
        
        
    $scope.resetFlags = function(){
        $state.skipCheckinEmail = false;
        $state.updatedEmail = false;
        $state.skipCheckoutEmail = false;
        $state.checkout_finalmode = false;
        $state.emailEdited = false;
        $state.emailError = false;
    };
    
    // $scope.currentPrinter = '';
    // $scope.currentWorkstationId = '';
    // $scope.getSettings = function(){
    //     var workstation = $scope.getCurrentWorkstation();
    //     var params = {
    //         'kiosk': {
    //             'idle_timer':$scope.zestStationData.idle_timer,
    //             'workstation':workstation
    //         },
    //         'printer':workstation.printer
    //     };
    //     return params;
    // };
    
    
    
    
    
    
    
    /*
     * Fetching / Saving Settings in Station Admin
     */
    
        $scope.setAdminSettings = function(){
            if ($scope.zestStationData.isAdminFirstLogin) {
                $scope.setSavedWorkstation();
                var station = $scope.getSavedWorkStation();
                $scope.workstation = {
                    selected: station
                };

                $scope.initialWorkstation = true;
                if (station !== null) {
                    $scope.zestStationData.set_workstation_id = $scope.set_workstation_id = $scope.getStationIdFromName(station.name);
                    // $scope.setWorkstationPrinter(station.id);
                }
            } else {
                //do nothing
            };
          
            //if application is launched either in chrome app or ipad go to login page
            var isIpad = navigator.userAgent.match(/iPad/i) !== null && window.cordova;
            if($scope.zestStationData.isAdminFirstLogin && ($scope.inChromeApp || isIpad)){
                $state.go('zest_station.admin');
            }
            else{
                //we want to treat other clients are normal, ie need to provide 
                //user credentials before accesing admin
                $scope.zestStationData.isAdminFirstLogin = false;
            }

        };
        
      //   $scope.saveSettings = function(){
      //       var params = $scope.getSettings();
      //       $scope.savedSettings = angular.copy(params);
      //       delete params.kiosk.workstation;
      //       delete params.printer;
      //       var successCallBack = function(response){
      //           $scope.$emit('hideLoader');
      //           $scope.saveStation();
      //       };
      //       var failureCallBack = function(response){
      //           $scope.$emit('hideLoader');
      //           console.warn('failed to save settings');
      //           console.log(response);
      //       };
      //        var options = {
    		// params: 			params,
      //           successCallBack:                successCallBack,
      //           failureCallBack:                failureCallBack
      //       };
      //       $scope.callAPI(zsTabletSrv.saveSettings, options);
      //   };
        // $scope.saveStation = function(){
        //   //save workstation printer 
        //   //save workstation to browser
        //     var successCallBack = function(response){
        //         $scope.$emit('hideLoader');
        //         $scope.setStationVariables();
        //         $scope.restartTimers();
        //         $scope.onAdminSaveComplete();
        //     };
        //     var failureCallBack = function(response){
        //         $scope.$emit('hideLoader');
        //         console.warn('unable to save workstation settings');
        //     };
        //     var station = $scope.savedSettings.kiosk.workstation;
        //     var params = {};
        //     if (station){
        //         var params = {
        //             'default_key_encoder_id': station.key_encoder_id,
        //             'identifier': station.station_identifier,
        //             'name': station.name,
        //             'rover_device_id': station.rover_device_id,
        //             'is_out_of_order': station.is_out_of_order,
        //             'out_of_order_msg': station.out_of_order_msg,
        //             'emv_terminal_id': station.emv_terminal_id,
        //             'id':station.id
        //         };
        //         $rootScope.$broadcast('UPDATE_WORKSTATION',{id: station.station_identifier});
        //     };
            
        //     if ($scope.savedSettings.printer){
        //         params.printer = $scope.savedSettings.printer;
        //     }
        //     var options = {
        //             params: 			params,
        //             successCallBack:            successCallBack,
        //             failureCallBack:            failureCallBack
        //     };
        //     if (station){
        //         //if no workstation is selected, we dont have an id to update settings for
        //         //since the workstation station_id itself is saved in the browser
        //         $scope.callAPI(zsTabletSrv.updateWorkStations, options);
        //     }
        // };

        // $scope.saveStationInCache = function(){//saves both encoder and workstation info to cache for quick access
        //     var storage = localStorage;
        //     try {
        //         var id = $scope.savedSettings.kiosk.station_identifier;//currently we are using the encoder id (station_identifier) for both encoder and workstation identity
        //         storage.setItem($scope.storageKey, id);
        //     } catch(err){
        //         console.warn(err);
        //     }
        // };
        
        // $scope.setStationVariables = function(){
        //     //we just need to set the printer and encoder across the app;
        //     sntZestStation.selectedPrinter = $scope.savedSettings.printer;
        //     if (typeof $scope.savedSettings.kiosk.workstation.key_encoder_id !== typeof undefined){
        //         $state.encoder = $scope.savedSettings.kiosk.workstation.key_encoder_id;
        //     } else {
        //         $state.encoder = '';
        //     }
        //     $state.emv_terminal_id = $scope.savedSettings.kiosk.workstation.emv_terminal_id;
        // };
    
        $scope.restartTimers = function(){
            $rootScope.$broadcast('START_TIMERS');
            $rootScope.$broadcast('REFRESH_SETTINGS');
        };
    
    
    $scope.init = function(){
        //reset early check-in flags
        $state.reservation_in_early_checkin_window = false;
        $state.earlyCheckinPurchased = false;
        $state.is_early_prepaid = false;
        $state.earlyCheckinOfferId = null;
        
        $state.qr_code = null;
        $state.search = false;
        //for change into default language after 120sec
        $scope.startLanguageCounter();
        $scope.resetFlags();
        var current = $state.current.name;
        if (current === 'zest_station.admin-screen'){
           //do nothing
        } else if (current === 'zest_station.oos'){
            $scope.$emit('REFRESH_SETTINGS');
        } else {
            $scope.theme = $state.theme;
            $scope.fetchWorkStations();
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
    
    
    
    
        /*
         * EVENTS to handle
         */
        $scope.$on ('THEME_UPDATE', function(event) {
            //set theme updates from state
            $scope.theme = $state.theme;
        });

        $scope.oos_message = false;
        $scope.oos_message_value = '';
        $scope.$on ('ZS_SETTINGS_UPDATE', function(event, obj) {
            if (obj.out_of_order_msg !== '' && obj.is_out_of_order){
                $scope.oos_message = true;
                $scope.oos_message_value = obj.out_of_order_msg;
            } else {
                $scope.oos_message_value = '';
            }
            $state.encoder = obj.key_encoder_id;
            $state.emv_terminal_id = obj.emv_terminal_id;
            //if was oos and now back in service, put it back in servce..
            var shouldBeInOOS = obj.is_out_of_order;
            if (!shouldBeInOOS && $state.current.name === "zest_station.oos"){
                $state.go ('zest_station.home');
            }
        });
    
    
    
    
    
    
    
    
    
    $scope.init();
    
}]);