sntZestStation.controller('zsAdminCtrl', [
    '$scope',
    '$state', 'zsEventConstants', 'zsTabletSrv', 'zsLoginSrv', '$window', '$rootScope',
    function($scope, $state, zsEventConstants, zsTabletSrv, zsLoginSrv, $window, $rootScope) {

        BaseCtrl.call(this, $scope);

        var refreshScroller = function(){
            $scope.refreshScroller('admin-screen');
        };
        var setPrinterLabel = function(name) {
            if (name && typeof name === typeof 'str') {
                if (name.length > 1) {
                    //printer name convention has something like IPP://somename..
                    //so lets pull out that IPP:// from the display to user, so they will see its
                    //HP or other printer identifiers
                    var str = name.split('ipp://');
                    if (str[1]) {
                        name = str[1];
                    }
                } else {
                    name = 'Select';
                }
            } else {
                name = 'Select';
            }
              var dots = "...";
          if(name.length > 25)
          {
            name = name.substring(0,25) + dots;
            }
           // $scope.zestStationData.printer = "printer";
            $scope.printerLabel = name;
        };
        //set the selected workstation
        if(typeof $scope.zestStationData.set_workstation_id !== "undefined"){
             var selectedWorkStation = _.find($scope.zestStationData.workstations, function(workstation) {
                return workstation.id == $scope.zestStationData.set_workstation_id;
            });
            $scope.workstation = { 'selected' :  selectedWorkStation.id};
            $scope.workstation.printer = selectedWorkStation.printer;
            setPrinterLabel(selectedWorkStation.printer);
          
        }else{
            //do nothing;
        };

        var hideNavButtons = function() {
            //hide back button
            $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
            //hide close button
            $scope.$emit(zsEventConstants.HIDE_CLOSE_BUTTON);
        };
        var showNavButtons = function() {
            //show back button
            $scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
            //show close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
        };

        //if workstation changes -> change printer accordingly
        $scope.worksStationChanged = function(){
            var selectedWorkStation = _.find($scope.zestStationData.workstations, function(workstation) {
                setCurrentStation($scope.set_workstation_id);
                return workstation.id == $scope.workstation.selected;
            });
            setPrinterLabel(selectedWorkStation.printer);
        };

        /*
         * Submit action of login
         */
        var submitLogin = function() {
            $scope.hasLoader = true;
            var onSuccess = function(response) {
                if (response.admin) {
                    $scope.mode = "admin-screen-active";
                    $scope.adminLoginError = false;
                    $scope.subHeadingText = '';
                    refreshScroller();
                } else {
                    $scope.adminLoginError = true;
                    $scope.subHeadingText = 'ADMIN_LOGIN_ERROR';
                    console.warn('invalid admin login');
                }
            };
            var onFail = function(response) {
                console.warn(response);
                $scope.adminLoginError = true;
                $scope.subHeadingText = 'ADMIN_LOGIN_ERROR';
                console.warn('failed admin login attempt');
            };

            var options = {
                params: {
                    "apiUser": $scope.userName,
                    "apiPass": $scope.passWord
                },
                successCallBack: onSuccess,
                failureCallBack: onFail
            };
            $scope.callAPI(zsTabletSrv.validate, options);
        };


        var getWorkStationList = function() {
            var onSuccess = function(response) {
                $scope.zestStationData.workstations = response.work_stations;
            };
            var onFail = function(response) {
                console.warn('fetching workstation list failed:', response);
                $scope.zestStationData.workstations = [];
            };
            var options = {
                params: {
                    page: 1,
                    per_page: 100,
                    query: '',
                    sort_dir: true,
                    sort_field: 'name'
                },
                successCallBack: onSuccess,
                failureCallBack: onFail
            };
            $scope.callAPI(zsTabletSrv.fetchWorkStations, options);
        };
        var lastDemoModeSetting = $scope.zestStationData.demoModeEnabled;
        var initialize = function() {
            
            if ($scope.zestStationData.workstationStatus === 'in-order'){
                $scope.inServiceAtStart = true;
            } else {
                $scope.inServiceAtStart = false;
            }
            $scope.adminLoginError = false;
            $scope.input = {
                "inputTextValue": ""
            };
            $scope.userName = "";
            $scope.passWord = "";
            $scope.zestStationData.workstations = [];
            hideNavButtons();
            getWorkStationList();
            $scope.setScroller('admin-screen');
            //mode
            //$scope.zestStationData.isAdminFirstLogin = true;//debugging, remove/comment out before pushing up
            if ($scope.zestStationData.isAdminFirstLogin) {
                $scope.mode = "admin-screen-active";
                $scope.zestStationData.isAdminFirstLogin = false;
            } else {
                $scope.mode = 'login-mode';
            };

        };

        //* when the back button clicked
        $scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
            initialize();
        });

        //* when we clicked on exit button
        $scope.navToPrev = function() {
            $state.go('zest_station.home');
        };

        $scope.loginAdmin = function() {
            $scope.mode = "admin-name-mode";
            $scope.headingText = 'Admin Username';
            $scope.passwordField = false;
            showNavButtons();
        };



        $scope.goToNext = function() {
            $scope.hideKeyboardIfUp();
            if ($scope.mode === "admin-name-mode") {
                $scope.adminLoginError = false;
                $scope.userName = angular.copy($scope.input.inputTextValue);
                $scope.input.inputTextValue = "";
                $scope.mode = "admin-password-mode";
                $scope.headingText = 'Admin Password';
                $scope.passwordField = true;
            } else {
                $scope.adminLoginError = false;
                $scope.passWord = angular.copy($scope.input.inputTextValue);
                submitLogin();
            }
        };


        $scope.cancelAdminSettings = function(a) {
            if (!a){
                console.info('setting demo mode back to: ',lastDemoModeSetting);
                $scope.zestStationData.demoModeEnabled = lastDemoModeSetting;
            }
            $state.go('zest_station.home');
            setTimeout(function() {
                $rootScope.$broadcast('REFRESH_SETTINGS', {
                    'restart': true,
                    'from_cancel': true
                });
            }, 500);
        };

        //to logout
        $scope.logOutApplication = function() {
            if (typeof chrome !== "undefined") {
                var chromeAppId = $scope.zestStationData.chrome_app_id; // chrome app id 
                console.info("chrome app id" + chromeAppId);
                //minimize the chrome app on loging out
                (chromeAppId !== null && chromeAppId.length > 0) ? chrome.runtime.sendMessage(chromeAppId, "zest-station-logout"): "";
                console.info("login out from chrome");
            } else {
                console.info("login out");
            };
            $window.location.href = '/station_logout';
        };


        var saveStation = function() {
            //save workstation printer 
            //save workstation to browser
            var successCallBack = function(response) {
                getTheSelectedWorkStation().printer = $scope.savedSettings.printer;
                setStationVariables();
                restartTimers();
                 $scope.$emit('UPDATE_WORKSTATION', {
                    id: station.station_identifier
                });  
                $scope.zestStationData.set_workstation_id = station.id;
                $rootScope.workstation_id = $scope.zestStationData.set_workstation_id;
                
                var reason;
                if ($scope.inServiceAtStart && station.is_out_of_order){
                    reason = 'ADMIN_OOS';
                    $scope.zestStationData.workstationOooReason = reason;
                } else {
                    reason = $scope.zestStationData.workstationOooReason;
                }
                $scope.$emit(zsEventConstants.UPDATE_LOCAL_STORAGE_FOR_WS,{'status':$scope.zestStationData.workstationStatus,'reason':reason});
                
                setTimeout(function(){
                    $scope.cancelAdminSettings(true);    
                },2000);
                
            };
            var failureCallBack = function(response) {
                console.warn('unable to save workstation settings');
            };
            var params = {};
            var station = $scope.savedSettings.kiosk.workstation;
            
            if (station) {
                station.is_out_of_order = ($scope.zestStationData.workstationStatus !== 'in-order' ? true : false);
                var params = {
                    'default_key_encoder_id': station.key_encoder_id,
                    'identifier': station.station_identifier,
                    'name': station.name,
                    'rover_device_id': station.rover_device_id,
                    'is_out_of_order': station.is_out_of_order,
                    'out_of_order_msg': station.out_of_order_msg,
                    'emv_terminal_id': station.emv_terminal_id,
                    'id': station.id
                };
                saveWorkStation(station.id);
            };
            if (!station.is_out_of_order){
                $scope.prepForInService();
            }
            if ($scope.savedSettings.printer) {
                params.printer = $scope.savedSettings.printer;
            }
            var options = {
                params: params,
                successCallBack: successCallBack,
                failureCallBack: failureCallBack
            };
            if (station) {
                //if no workstation is selected, we dont have an id to update settings for
                //since the workstation station_id itself is saved in the browser
                
                $scope.callAPI(zsTabletSrv.updateWorkStations, options);
            }
        };
        
    var setWorkstationInSession = function(){
            var workstation = $scope.sessionStation;
            var successCallBack = function(response){
                $scope.$emit('hideLoader');
            };
            var failureCallBack = function(response){
                $scope.$emit('hideLoader');
                console.warn('failed to set workstation in session');
                console.log(response);
            };
             var options = {
    		params: 			workstation,
                successCallBack:                successCallBack,
                failureCallBack:                failureCallBack
            };
            $scope.callAPI(zsTabletSrv.setSessionWorkstation, options);
    };
    
    
    var setCurrentStation = function(id){
        console.info('setting: ',id)
        $scope.sessionStation;
        for (var i in $scope.zestStationData.workstations){
            if ($scope.zestStationData.workstations[i].id === id){
                $scope.zestStationData.workstations[i].is_workstation_present = true;
                $scope.sessionStation = $scope.zestStationData.workstations[i];
            }
        }
    }
        saveWorkStation = function(id){
            console.info('save workstation')
            if ($scope.workstation !== ''){
                for (var i in $scope.zestStationData.workstations){
                    if ($scope.zestStationData.workstations[i].station_identifier === id){
                        $scope.zestStationData.selectedWorkStation = $scope.zestStationData.workstations[i].station_identifier;
                        setWorkstationInSession($scope.zestStationData.selectedWorkStation);
                    }
                }
            } else {
                $scope.zestStationData.selectedWorkStation = '';
            }

        };
        
        var getTheSelectedWorkStation = function() {
            var selectedWorkStation = _.find($scope.zestStationData.workstations, function(workstation) {
                return workstation.id == $scope.workstation.selected;
            });
            return selectedWorkStation;
        };
        var getSettings = function() {
            var params = {
                'kiosk': {
                    'idle_timer': $scope.zestStationData.idle_timer,
                    'workstation': getTheSelectedWorkStation()
                },
                'printer': $scope.workstation.printer
            };
            return params;
        };


        $scope.saveSettings = function() {
            console.info('saving: demo mdoe: ',$scope.zestStationData.demoModeEnabled);
            var params = getSettings();
            $scope.savedSettings = angular.copy(params);
            delete params.kiosk.workstation;
            delete params.printer;
            var successCallBack = function(response) {
                $scope.updateSavedIdleTimer($scope.savedSettings.kiosk.idle_timer)
                saveStation();
            };
            var failureCallBack = function(response) {
                console.warn('failed to save settings');
                console.log(response);
            };
            var options = {
                params: params,
                successCallBack: successCallBack,
                failureCallBack: failureCallBack
            };
            $scope.callAPI(zsTabletSrv.saveSettings, options);
        };

        var setStationVariables = function() {
            //we just need to set the printer and encoder across the app;
            //well again the state variable is used here. Need to change this :(
            sntZestStation.selectedPrinter = $scope.savedSettings.printer;
            if (typeof $scope.savedSettings.kiosk.workstation.key_encoder_id !== typeof undefined) {
                $state.encoder = $scope.savedSettings.kiosk.workstation.key_encoder_id;
            } else {
                $state.encoder = '';
            }
            $state.emv_terminal_id = $scope.savedSettings.kiosk.workstation.emv_terminal_id;
        };
        var restartTimers = function() {
            $rootScope.$broadcast('START_TIMERS');
            $rootScope.$broadcast('REFRESH_SETTINGS');
        };



        $scope.saveStationInCache = function() { //saves both encoder and workstation info to cache for quick access
            var storage = localStorage;
            try {
                var id = $scope.savedSettings.kiosk.station_identifier; //currently we are using the encoder id (station_identifier) for both encoder and workstation identity
                storage.setItem($scope.storageKey, id);
            } catch (err) {
                console.warn(err);
            }
        };
        $scope.isIpad = (navigator.userAgent.match(/iPad/i) !== null || navigator.userAgent.match(/iPhone/i) !== null) && window.cordova;
        $scope.openPrinterMenu = function() {

            if (typeof cordova !== typeof undefined) {
                //cordova.exec(onSuccess, onFail, 'RVCardPlugin', 'selectPrinter', [1024, 50])
                cordova.exec(
                    function(success) {
                        //sntZestStation.selectedPrinter = JSON.stringify(success);
                        (typeof $scope.savedSettings === "undefined") ? $scope.savedSettings = {} : "";
                        $scope.savedSettings.printer = success; //save to the save params here
                        $scope.workstation.printer = $scope.savedSettings.printer;
                        setPrinterLabel($scope.savedSettings.printer);
                        $scope.$digest();
                    },
                    function(error) {
                        alert('printer selection failed');
                    }, 'RVCardPlugin', 'selectPrinter'
                );
            }
        };
        initialize();
    }
]);