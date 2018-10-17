sntZestStation.controller('zsAdminCtrl', [
    '$scope',
    '$state', 'zsEventConstants', 'zsGeneralSrv', 'zsLoginSrv', '$window', '$rootScope', '$timeout', 'zsReceiptPrintHelperSrv',
    function($scope, $state, zsEventConstants, zsGeneralSrv, zsLoginSrv, $window, $rootScope, $timeout, zsReceiptPrintHelperSrv) {

        BaseCtrl.call(this, $scope);
        var  isLightTurnedOn = false; // initially consider the HUE light status to be turned OFF.
        

        // hide nav buttons in login mode
        var hideNavButtons = function() {
            $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
            $scope.$emit(zsEventConstants.HIDE_CLOSE_BUTTON);
        };
        // show nav buttons on reaching admin screen
        var showNavButtons = function() {
            $scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
        };
        // when the back button clicked

        $scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function() {
            $state.go('zest_station.home');
        });

        $scope.navToPrev = function() {
            // go home, unless there is no workstation or workstation is OOS
            var noWorkstationSelected = $scope.workstation.selected === '',
                workstationInOrder = $scope.zestStationData.workstationStatus === 'in-order';

            if (!workstationInOrder || noWorkstationSelected) {
                $state.go('zest_station.outOfService');
            } else {
                $state.go('zest_station.home');    
            }
            

        };

        var refreshScroller = function() {
            $scope.refreshScroller('admin-screen');
        };

        /*
         * printer name convention has something like IPP://somename..
         * so lets pull out that IPP:// from the display to user, so they will see its
         * HP or other printer identifiers
         */
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
            var dots = '...';

            name = (name.length > 25) ? name.substring(0, 25) + dots : name;
            $scope.printerLabel = name;
        };

        // set the selected workstation
        if (typeof $scope.zestStationData.set_workstation_id !== 'undefined') {
            var selectedWorkStation = _.find($scope.zestStationData.workstations, function(workstation) {
                return workstation.id == $scope.zestStationData.set_workstation_id;
            });

            $scope.workstation = {};
            if (typeof selectedWorkStation !== 'undefined') {
                $scope.workstation.selected = parseInt(selectedWorkStation.id);
                $scope.workstation.printer = selectedWorkStation.printer;
                $scope.selectedWorkstationLightId = selectedWorkStation.hue_light_id;
            } else {
                $scope.workstation.selected = '';
                $scope.workstation.printer = '';
            }
            // set printer label
            setPrinterLabel($scope.workstation.printer);
        } else {
            // do nothing as no workstation was set
        }


        // if workstation changes -> change printer accordingly
        $scope.worksStationChanged = function() {
            var selectedWorkStation = _.find($scope.zestStationData.workstations, function(workstation) {
                return workstation.id == $scope.workstation.selected;
            });

            $scope.selectedWorkstationLightId = selectedWorkStation.hue_light_id;
            if (isLightTurnedOn) {
                $scope.turnOffLight($scope.selectedWorkstationLightId); // turn off light, if is in ON state
            }
            setPrinterLabel(selectedWorkStation.printer);
            $scope.setEncoderDiagnosticInfo(selectedWorkStation.name, selectedWorkStation.key_encoder_id); // in diagnostic info display the encoder name + id
        };

        /*
         * Submit action of login
         */
        var submitLogin = function() {
            $scope.hasLoader = true;
            $scope.callBlurEventForIpad();
            var onSuccess = function(response) {
                if (response.admin) {
                    $scope.mode = 'admin-screen-active';
                    $scope.adminLoginError = false;
                    $scope.subHeadingText = '';
                    refreshScroller();
                } else {
                    $scope.adminLoginError = true;
                    $scope.subHeadingText = 'ADMIN_LOGIN_ERROR';
                    console.warn('invalid admin login');
                    // prompt screen keyboard depending on the device, ios should call blur first for smooth transition
                    $scope.focusInputField('password_text');
                }
            };
            var onFail = function(response) {
                console.warn(response);
                $scope.adminLoginError = true;
                $scope.subHeadingText = 'ADMIN_LOGIN_ERROR';
                console.warn('failed admin login attempt');
                // prompt screen keyboard depending on the device, ios should call blur first for smooth transition
                $scope.focusInputField('password_text');
            };

            var options = {
                params: {
                    'apiUser': $scope.userName,
                    'apiPass': $scope.passWord
                },
                successCallBack: onSuccess,
                failureCallBack: onFail
            };

            $scope.callAPI(zsGeneralSrv.validate, options);
        };
        /*
         * Go to home page
         */
        var lastDemoModeSetting = $scope.zestStationData.demoModeEnabled,
            lastEditorModeSetting = $scope.zestStationData.editorModeEnabled,
            lastNCIModeSetting = $scope.zestStationData.noCheckInsDebugger,
            lastStationStatus = $scope.zestStationData.workstationStatus;

        $scope.cancelAdminSettings = function(a) {
            if (!a) {
                console.info('setting Demo, Editor, and NCI modes back to: ', lastDemoModeSetting, lastEditorModeSetting, lastNCIModeSetting);
                $scope.zestStationData.demoModeEnabled = lastDemoModeSetting;
                $scope.zestStationData.noCheckInsDebugger = lastNCIModeSetting;
                $scope.zestStationData.editorModeEnabled = lastEditorModeSetting;
                $scope.zestStationData.workstationStatus = lastStationStatus;

                $scope.setEditorModeCls();
            }
            $state.go('zest_station.home');
            setTimeout(function() {
                $rootScope.$broadcast('REFRESH_SETTINGS', {
                    'restart': true,
                    'from_cancel': true
                });
                
                $scope.setEncoderDiagnosticInfo(); // in diagnostic info display the encoder name + id
            }, 500);
        };

        $scope.testReadLocalDevice = function() {
            alert('starting reader');
            $scope.cardReader.startReader({
                'successCallBack': function() {
                    alert('success');
                },
                'failureCallBack': function() {
                    alert('failure');
                },
                'test': true
            });
        };
        /*
         *  Login button actions
         *  Go to username entry page
         */
        $scope.loginAdmin = function() {
            if (!$scope.inProd() && $scope.adminBtnPress >= 2){
                // simulate successful admin login, only in dev environemnt for faster dev/testing
                $scope.mode = 'admin-screen-active';
                $scope.adminLoginError = false;
                $scope.subHeadingText = '';
                refreshScroller();
            } else {
                $scope.mode = 'admin-name-mode';
                $scope.headingText = 'Admin Username'; // TODO: need to move this out to a tag.
                $scope.passwordField = false;
                showNavButtons();
                $scope.focusInputField('input_text');
            }
        };
        /*
         *  Input field button actions
         */
        $scope.goToNext = function() {
            // $scope.hideKeyboardIfUp();
            if ($scope.mode === 'admin-name-mode') {
                // user has entered username
                $scope.adminLoginError = false;
                $scope.userName = angular.copy($scope.input.inputTextValue);
                $scope.input.inputTextValue = '';
                $scope.mode = 'admin-password-mode';
                $scope.headingText = 'Admin Password'; // TODO: need to move this out to a tag.
                $scope.passwordField = true;
                // prompt screen keyboard depending on the device, ios should call blur first for smooth transition
                $scope.focusInputField('password_text');
            } else {
                // user has entered password
                $scope.adminLoginError = false;
                $scope.passWord = angular.copy($scope.input.inputTextValue);
                submitLogin();
            }
        };
        /*
         *  logout from the application
         */
        $scope.logOutApplication = function() {
            if (typeof chrome !== 'undefined') {
                var chromeAppId = $scope.zestStationData.chrome_app_id; // chrome app id 

                console.info('' + chromeAppId);
                // minimize the chrome app on loging out
                if ($scope.inChromeApp && !$scope.inElectron) {
                    (chromeAppId !== null && chromeAppId.length > 0) ? chrome.runtime.sendMessage(chromeAppId, 'zest-station-logout') : '';
                }
                console.info('login out from chrome');
            } else {
                console.info('login out');
            }
            $scope.reportGoingOffline('logout');
             $timeout(function() {
                $window.location.href = '/station_logout';
            }, 500);
            
        };

        var setStationVariables = function() {
            // we just need to set the printer and encoder across the app;
            // well again the state variable is used here. Need to change this :(
            sntZestStation.selectedPrinter = $scope.savedSettings.printer;
            if (typeof $scope.savedSettings.kiosk.workstation.key_encoder_id !== typeof undefined) {
                $scope.zestStationData.encoder = $scope.savedSettings.kiosk.workstation.key_encoder_id;
            } else {
                $scope.zestStationData.encoder = '';
            }
            $scope.zestStationData.emv_terminal_id = $scope.savedSettings.kiosk.workstation.emv_terminal_id;
            $scope.setEncoderDiagnosticInfo(); // in diagnostic info display the encoder name + id
        };
        var getTheSelectedWorkStation = function() {
            var selectedWorkStation = _.find($scope.zestStationData.workstations, function(workstation) {
                return workstation.id == $scope.workstation.selected;
            });

            return selectedWorkStation;
        };

        $scope.setEditorModeCls = function() {
            if ($scope.zestStationData.editorModeEnabled === 'true') {
                $rootScope.cls.editor = 'true';
            } else {
                $rootScope.cls.editor = 'false';
            }
        };

        $scope.toggleDiagnostics = function() {
            console.log(arguments);
            zestSntApp.debugTimers(true);
              $timeout(function() {
                $scope.runDigestCycle();
            }, 900);
        };
        /*
         *  save work station
         */
        var saveStation = function(runDemoClicked) {
            // save workstation printer 
            // save workstation to browser
            var successCallBack = function() {
                var selectedWorkstation = getTheSelectedWorkStation();

                selectedWorkstation.printer = $scope.savedSettings.printer;
                $scope.zestStationData.workstationName = selectedWorkstation.name;
                setStationVariables();
                restartTimers();
                $scope.setEditorModeCls();
                $scope.zestStationData.set_workstation_id = station.id;
                $rootScope.workstation_id = $scope.zestStationData.set_workstation_id;
                $scope.zestStationData.key_encoder_id = station.key_encoder_id;
                $scope.$emit(zsEventConstants.UPDATE_LOCAL_STORAGE_FOR_WS, {
                    'status': $scope.zestStationData.workstationStatus,
                    'reason': $scope.zestStationData.workstationOooReason
                });
                // set new Light ID
                $scope.zestStationData.selected_light_id = station.hue_light_id;
                var workStationstorageKey = 'snt_zs_workstation';

                localStorage.setItem(workStationstorageKey, $scope.savedSettings.kiosk.workstation.station_identifier);
                // navigate to home screen
                // 
                if ($scope.zestStationData.workstationStatus === 'out-of-order') {
                    $scope.addReasonToOOSLog('Admin');
                    $state.go('zest_station.outOfService');
                } else {
                    if (runDemoClicked) {
                        $state.go('zest_station.checkinKeySelection');
                        return;
                    }
                    $scope.cancelAdminSettings(true);
                }
            };
            var failureCallBack = function() {
                console.warn('unable to save workstation settings');
            };
            var params = {};
            var station = $scope.savedSettings.kiosk.workstation;

            if (station) {
                station.is_out_of_order = $scope.zestStationData.workstationStatus !== 'in-order' ? false : true;

                params = {
                    'default_key_encoder_id': station.key_encoder_id,
                    'identifier': station.station_identifier,
                    'name': station.name,
                    'rover_device_id': station.rover_device_id,
                    'is_out_of_order': station.is_out_of_order,
                    'out_of_order_msg': station.out_of_order_msg,
                    'emv_terminal_id': station.emv_terminal_id,
                    'id': station.id
                };
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
                // if no workstation is selected, we dont have an id to update settings for
                // since the workstation station_id itself is saved in the browser
                $scope.callAPI(zsGeneralSrv.updateWorkStations, options);
            }
        };

        /*
         * Save the admin settings
         **/
        $scope.saveSettings = function(runDemoClicked) {
            var getParams = function() {
                // CICO-42233
                if (!$scope.zestStationData.idle_timer.prompt) {
                    $scope.zestStationData.idle_timer.prompt = 0;
                }
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
            var successCallBack = function() {
                saveStation(runDemoClicked);
            };
            var failureCallBack = function(response) {
                console.warn('failed to save settings');
                console.log(response);
                console.info('save setting failed, set demo and editor mode to last setting');
                $scope.zestStationData.demoModeEnabled = lastDemoModeSetting;
                $scope.zestStationData.noCheckInsDebugger = lastNCIModeSetting;
                $scope.zestStationData.editorModeEnabled = lastEditorModeSetting;
                $scope.zestStationData.workstationStatus = lastStationStatus;
                $scope.setEditorModeCls();
            };
            var options = {
                params: params,
                successCallBack: successCallBack,
                failureCallBack: failureCallBack
            };

            $scope.callAPI(zsGeneralSrv.saveSettings, options);
        };

        var restartTimers = function() {
            $rootScope.$broadcast('START_TIMERS');
            $rootScope.$broadcast('REFRESH_SETTINGS');
        };

        $scope.openPrinterMenu = function() {

            if (typeof cordova !== typeof undefined) {
                // cordova.exec(onSuccess, onFail, 'RVCardPlugin', 'selectPrinter', [1024, 50])
                cordova.exec(
                    function(success) {
                        // sntZestStation.selectedPrinter = JSON.stringify(success);
                        if (typeof $scope.savedSettings === 'undefined') {
                            $scope.savedSettings = {};
                        }
                        $scope.savedSettings.printer = success; // save to the save params here
                        $scope.workstation.printer = $scope.savedSettings.printer;
                        setPrinterLabel($scope.savedSettings.printer);
                        $scope.$digest();
                    },
                    function() {
                        alert('printer selection failed');
                    }, 'RVCardPlugin', 'selectPrinter'
                );
            }
        };
        $scope.debugToggleCount = 0;
        $scope.toggleDebugMode = function() {
            // in develop or production, implementations may want to demo a template,
            // this will allow them to set any template into demo mode and go through the steps of a demo mode
            // which will [ simulate CreditCard swipe & Key creation ], but will check in a reservation
            $scope.debugToggleCount++;
            $timeout(function() {
                if ($scope.debugToggleCount > 3) {
                    $scope.showDebugModeOption = true;
                    // refresh view 
                    $scope.runDigestCycle();
                    // resize the view scroller so user can scroll to see demo mode
                    $timeout(refreshScroller, 500);
                    // reset the count
                    $timeout(function() {
                        $scope.debugToggleCount = 0;
                    }, 3000);
                }
            }, 2000);
        };

        $scope.refreshSocketConnection = function() {
            if ($scope.zestStationData.stationHandlerConnectedStatus !== "Connecting...") {
                $scope.$emit('CONNECT_WEBSOCKET');    
            }
        };

        $scope.testRunMobileKeyCheckin = function() {
            // save settings then go to the demo area
            var demoRunStarted = true;

            $scope.saveSettings(demoRunStarted);
            
        };
        $scope.reload = function() {
            location.reload(true);
        };
        $scope.toggleOOSHist = function() {
            $scope.show_oos_history = !$scope.show_oos_history;
        };

        $scope.showDebugModeOption = false;

        $scope.fetchDeviceStatus = function() {
            var callBacks = {
                'successCallBack': function(response) {
                    if (response.length > 0) {
                        $scope.zestStationData.connectedDeviceDetails = response[0];
                        if (!response[0].device_connection_state) {
                            $scope.zestStationData.connectedDeviceDetails.device_connection_state = response[0].device_connection_sate;
                        }
                    } else {
                        $scope.zestStationData.connectedDeviceDetails.device_short_name = 'No Devices found';
                        $scope.zestStationData.connectedDeviceDetails.device_connection_state = 'N/A';
                    }
                    $scope.runDigestCycle();
                },
                'failureCallBack': function(errorMessage) {
                    $scope.errorMessage = errorMessage;
                }
            };

            $scope.zestStationData.connectedDeviceDetails.device_connection_state = 'refreshing...';
            $scope.cardReader.getConnectedDeviceDetails(callBacks);
        };

        $scope.showPrintErrorPopup = false;
        $scope.printErrorMessage = "";

        $scope.closePrintErrorPopup = function () {
             $scope.showPrintErrorPopup = false;
        };
        $scope.printSampleReceipt = function() {
            var printRegCardData = {
                'room_number': '500'
            };
            var printString = zsReceiptPrintHelperSrv.setUpStringForReceiptRegCard(printRegCardData, $scope.zestStationData);

            var failureCallBack = function () {
                $scope.printErrorMessage = 'Printer Not connected';
                $scope.showPrintErrorPopup = true;
            };
            failureCallBack();
            console.log(printString);
        };

        // initialize
        (function() {
            var localDebugging = false, // change this if testing locally, be sure to make false if going up to dev/release/prod
                scrollerRefreshTime = 1000;

            $scope.adminLoginError = false;
            $scope.input = {
                'inputTextValue': ''
            };
            $scope.show_oos_history = false;
            $scope.userName = '';
            $scope.passWord = '';
            hideNavButtons();
            $scope.setScroller('admin-screen');

            if (localDebugging && !($scope.zestStationData.isAdminFirstLogin && ($scope.inChromeApp || $scope.isIpad))) {
                $scope.isIpad = true;
                $scope.zestStationData.isAdminFirstLogin = true;
            }

            // if invoked from chrome app or ipad
            // show direct admin without login
            if ($scope.zestStationData.isAdminFirstLogin && !$scope.zestStationData.fromAdminButton) {
                $scope.mode = 'admin-screen-active';
                $scope.zestStationData.isAdminFirstLogin = false;
            } else {
                $scope.mode = 'login-mode';
            }
            $scope.zestStationData.fromAdminButton = false;
            setTimeout(function() {
                refreshScroller(); // maybe need to update layout, but this works to fix scroll issue on admin after page load
            }, scrollerRefreshTime);
            $scope.setScreenIcon('checkin');
            if ($scope.zestStationData.theme === 'snt') {
                $scope.showDebugModeOption = true;
            }

            if (!$scope.zestStationData.demoMobileKeyModeEmailLinked) {
                $scope.zestStationData.demoMobileKeyModeEmailLinked = 'true';
                $scope.zestStationData.demoMobileKeyModeEnabled = 'true';
                $scope.zestStationData.demoMobileKeyModeUserEmailOnFile = 'true';
                $scope.zestStationData.thirdPartyMobileKey = 'false'; // TODO MOVE TO API SETTING
                
            }
            if ($scope.isIpad) {
                $scope.fetchDeviceStatus();
            }

        }());
    }
]);