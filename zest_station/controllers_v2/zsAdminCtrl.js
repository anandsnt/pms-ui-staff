sntZestStation.controller('zsAdminCtrl', [
    '$scope',
    '$state', 'zsEventConstants', 'zsTabletSrv', 'zsLoginSrv', '$window', '$rootScope',
    function($scope, $state, zsEventConstants, zsTabletSrv, zsLoginSrv, $window, $rootScope) {

        BaseCtrl.call(this, $scope);

        //hide nav buttons in login mode
        var hideNavButtons = function() {
            $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
            $scope.$emit(zsEventConstants.HIDE_CLOSE_BUTTON);
        };
        //show nav buttons on reaching admin screen
        var showNavButtons = function() {
            $scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
        };
        // when the back button clicked
        $scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
            $state.go('zest_station.home');
        });

        $scope.navToPrev = function(){
            $state.go('zest_station.home');
        };

        var refreshScroller = function() {
            $scope.refreshScroller('admin-screen');
        };

        /**
         * printer name convention has something like IPP://somename..
         * so lets pull out that IPP:// from the display to user, so they will see its
         * HP or other printer identifiers
         ***/
        var setPrinterLabel = function(name) {
            if (name && typeof name === typeof 'str') {
                if (name.length > 1) {
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
            name = (name.length > 25) ? name.substring(0, 25) + dots : name;
            $scope.printerLabel = name;
        };

        //set the selected workstation
        if (typeof $scope.zestStationData.set_workstation_id !== "undefined") {
            var selectedWorkStation = _.find($scope.zestStationData.workstations, function(workstation) {
                return workstation.id == $scope.zestStationData.set_workstation_id;
            });
            $scope.workstation = {
                'selected': selectedWorkStation.id
            };
            $scope.workstation.printer = selectedWorkStation.printer;
            setPrinterLabel(selectedWorkStation.printer);
        } else {
            //do nothing as no workstation was set
        };

        //if workstation changes -> change printer accordingly
        $scope.worksStationChanged = function() {
            var selectedWorkStation = _.find($scope.zestStationData.workstations, function(workstation) {
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
        /**
         * Go to home page
         **/
        $scope.cancelAdminSettings = function() {
            $state.go('zest_station.home');
            setTimeout(function() {
                $rootScope.$broadcast('REFRESH_SETTINGS', {
                    'restart': true,
                    'from_cancel': true
                });
            }, 500);
        };
        /**
         *  Login button actions
         *  Go to username entry page
         **/
        $scope.loginAdmin = function() {
            $scope.mode = "admin-name-mode";
            $scope.headingText = 'Admin Username';
            $scope.passwordField = false;
            showNavButtons();
        };
        /**
         *  Input field button actions
         **/
        $scope.goToNext = function() {
            // $scope.hideKeyboardIfUp();
            if ($scope.mode === "admin-name-mode") {
                //user has entered username
                $scope.adminLoginError = false;
                $scope.userName = angular.copy($scope.input.inputTextValue);
                $scope.input.inputTextValue = "";
                $scope.mode = "admin-password-mode";
                $scope.headingText = 'Admin Password';
                $scope.passwordField = true;
            } else {
                //user has entered password
                $scope.adminLoginError = false;
                $scope.passWord = angular.copy($scope.input.inputTextValue);
                submitLogin();
            }
        };
        /**
         *  logout from the application
         **/
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

        var setStationVariables = function() {
            //we just need to set the printer and encoder across the app;
            //well again the state variable is used here. Need to change this :(
            sntZestStation.selectedPrinter = $scope.savedSettings.printer;
            if (typeof $scope.savedSettings.kiosk.workstation.key_encoder_id !== typeof undefined) {
                $scope.zestStationData.encoder = $scope.savedSettings.kiosk.workstation.key_encoder_id;
            } else {
                $scope.zestStationData.encoder = '';
            }
            $scope.zestStationData.emv_terminal_id = $scope.savedSettings.kiosk.workstation.emv_terminal_id;
        };
        var getTheSelectedWorkStation = function() {
            var selectedWorkStation = _.find($scope.zestStationData.workstations, function(workstation) {
                return workstation.id == $scope.workstation.selected;
            });
            return selectedWorkStation;
        };
        /**
         *  save work station
         **/
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
                $scope.$emit(zsEventConstants.UPDATE_LOCAL_STORAGE_FOR_WS, {
                    'status': $scope.zestStationData.workstationStatus,
                    'reason': $scope.zestStationData.workstationOooReason
                });
                $scope.zestStationData.workstationStatus === 'out-of-order' ? $state.go('zest_station.outOfService') : $scope.cancelAdminSettings(); //navigate to home screen
            };
            var failureCallBack = function(response) {
                console.warn('unable to save workstation settings');
            };
            var params = {};
            var station = $scope.savedSettings.kiosk.workstation;

            if (station) {
                station.is_out_of_order = ($scope.zestStationData.workstationStatus !== 'in-order' ? false : true);

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
            };

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

        /**
         * Save the admin settings
         **/
        $scope.saveSettings = function() {
            var getParams = function() {
                var params = {
                    'kiosk': {
                        'idle_timer': $scope.zestStationData.idle_timer,
                        'workstation': getTheSelectedWorkStation()
                    },
                    'printer': $scope.workstation.printer
                };
                return params;
            };
            var params = getParams();
            $scope.savedSettings = angular.copy(params);
            delete params.kiosk.workstation;
            delete params.printer;
            var successCallBack = function(response) {
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

        var restartTimers = function() {
            $rootScope.$broadcast('START_TIMERS');
            $rootScope.$broadcast('REFRESH_SETTINGS');
        };

        $scope.openPrinterMenu = function() {

            if (typeof cordova !== typeof undefined) {
                //cordova.exec(onSuccess, onFail, 'RVCardPlugin', 'selectPrinter', [1024, 50])
                cordova.exec(
                    function(success) {
                        //sntZestStation.selectedPrinter = JSON.stringify(success);
                        (typeof $scope.savedSettings === "undefined") ? $scope.savedSettings = {}: "";
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

        var initialize = function() {
            $scope.adminLoginError = false;
            $scope.input = {
                "inputTextValue": ""
            };
            $scope.userName = "";
            $scope.passWord = "";
            hideNavButtons();
            $scope.setScroller('admin-screen');

            //if invoked from chrome app or ipad
            //show direct admin without login
            if ($scope.zestStationData.isAdminFirstLogin) {
                $scope.mode = "admin-screen-active";
                $scope.zestStationData.isAdminFirstLogin = false;
            } else {
                $scope.mode = 'login-mode';
            };

        }();
    }
]);