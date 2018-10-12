sntZestStation.controller('zsPickupKeyRegistartionCardPrintCtrl', [
    '$scope',
    '$state',
    'zsEventConstants',
    '$stateParams',
    'zsCheckinSrv',
    '$filter',
    '$timeout',
    '$window',
    '$translate',
    function($scope, $state, zsEventConstants, $stateParams, zsCheckinSrv, $filter, $timeout, $window, $translate) {

        /** ********************************************************************************************
         **     Expected state params -----> reservation_id
         **
         ***********************************************************************************************/

        BaseCtrl.call(this, $scope);


        /**
         * [clickedPrint description]
         * @return {[type]} [description]
         */
        var startPrint = function() {
            var getTermsPrintable = function(terms) {
                sntZestStation.filter('unsafe', function($sce) {
                    return function(terms) {
                        return $sce.trustAsHtml(terms);
                    };
                });
            };

            var setMessage = function(printSuccess) {
                var keySucess = $stateParams.key_created === 'true';

                if (printSuccess && keySucess) {
                    $scope.mode = 'PRINT_SUCCESS_AND_KEY_SUCCESS';
                } else if (!printSuccess && keySucess) {
                    $scope.mode = 'PRINT_FAILED_AND_KEY_SUCCESS';
                } else if (printSuccess && !keySucess) {
                    $scope.mode = 'PRINT_SUCCESS_AND_KEY_FAILED';
                } else if (!printSuccess && !keySucess) {
                    $scope.mode = 'PRINT_FAILED_AND_KEY_FAILED';
                } else {
                    $scope.subtext = '';
                }
            };

            var printFailedActions = function(errorMessage) {
                $scope.$emit('hideLoader');
                var printSuccess = false;

                $scope.showDoneButton = true;
                setMessage(printSuccess);
                errorMessage = _.isUndefined(errorMessage) ? 'DISPENSE_KEY_PRINT_FAIL' : errorMessage;
                $scope.zestStationData.workstationOooReason = $filter('translate')(errorMessage);
                $scope.addReasonToOOSLog('DISPENSE_KEY_PRINT_FAIL');
                $scope.zestStationData.workstationStatus = 'out-of-order';
                $scope.runDigestCycle();

                $scope.trackEvent('PUK - Error', 'Print-Status');
                $scope.trackEvent('PUK', 'Flow-End-Success');
                $scope.trackSessionActivity('PUK', 'Print-Error', 'R' + $stateParams.reservation_id, 'FLOW_END_SUCCESS', true);

            };
            var printSuccessActions = function() {

                $scope.$emit('hideLoader');
                $scope.showDoneButton = true;
                var printSuccess = true;

                setMessage(printSuccess);
                $scope.runDigestCycle();

                $scope.trackEvent('PUK - Success', 'Print-Status');
                $scope.trackEvent('PUK', 'Flow-End-Success');
                $scope.trackSessionActivity('PUK', 'Print-Success', 'R' + $stateParams.reservation_id, 'FLOW_END_SUCCESS', true);
            };

            var handleStarTacPrinterActions = function() {
                var printData = '';

                /** ** Socket actions starts here *****/
                $scope.$on('SOCKET_FAILED', function() {
                    printFailedActions();
                });
                $scope.$on('WS_PRINT_SUCCESS', function() {
                    printSuccessActions();
                });
                $scope.$on('WS_PRINT_FAILED', function(event, data) {
                    printFailedActions(data.error_message);
                });
                $scope.$on('SOCKET_CONNECTED', function() {
                    $scope.socketOperator.startPrint(printData);
                    $scope.$emit('showLoader');
                });
                /** ** Socket actions ends here *****/

                var fetchSatrTacDataSuccess = function(response) {
                    printData = response.bill_details;
                    // check if socket is open
                    if ($scope.socketOperator.returnWebSocketObject().readyState === 1) {
                        $scope.socketOperator.startPrint(printData);
                        $scope.$emit('showLoader');
                    } else {
                        $scope.$emit('CONNECT_WEBSOCKET'); // connect socket
                    }
                };

                var data = {
                    'reservation_id': $stateParams.reservation_id,
                    'language_code': $translate.use()
                };

                var startTacDataFailedActions = function() {
                    printFailedActions();
                };

                var options = {
                    params: data,
                    successCallBack: fetchSatrTacDataSuccess,
                    failureCallBack: startTacDataFailedActions
                };

                $scope.callAPI(zsCheckinSrv.fetchStarTacPrinterData, options);
            };

            var handleBillPrint = function() {
                // add the orientation
                addPrintOrientation();
                setBeforePrintSetup();
                try {
                    // this will show the popup with full bill
                    $timeout(function() {
                        /*
                         * ======[ PRINTING!! JS EXECUTION IS PAUSED ]======
                         */

                        if ($scope.isIpad && typeof cordova !== typeof undefined) { // CICO-40934 removed the sntapp load from zestJsAssetList, now just check for ipad/iphone
                            var printer = sntZestStation.selectedPrinter;

                            cordova.exec(function() {
                                printSuccessActions();
                            }, function() {
                                printFailedActions();
                            }, 'RVCardPlugin', 'printWebView', ['filep', '1', printer]);
                        } else {
                            if ($scope.zestStationData.zest_printer_option === 'STAR_TAC' && $scope.zestStationData.kiosk_use_socket_print) {
                                // we will call websocket services to print
                                handleStarTacPrinterActions();
                            } else {

                                $scope.$emit('PRINT_CURRENT_PAGE');
                                setTimeout(function() {
                                    printSuccessActions();
                                }, 100);
                            }
                        }
                        // provide a delay for preview to appear

                    }, 100);

                } catch (e) {
                    console.info('something went wrong while attempting to print--->' + e);
                    printFailedActions();

                }

                setTimeout(function() {
                    // CICO-9569 to solve the hotel logo issue
                    $('header .logo').removeClass('logo-hide');
                    $('header .h2').addClass('text-hide');

                    // remove the orientation after similar delay
                    removePrintOrientation();

                }, 100);
            };

            var fetchPrintViewCompleted = function(data) {
                var d = new Date();

                $scope.currentDateTime = d.getTime();
                $scope.$emit('hideLoader');
                // print section - if its from device call cordova.
                $scope.printRegCardData = data;
                $scope.departDate = $scope.printRegCardData.dep_date;
                $scope.departDate = $scope.returnDateObjBasedOnDateFormat($scope.printRegCardData.dep_date);
                $scope.printRegCardData.terms_conditions_html = getTermsPrintable($scope.printRegCardData.terms_conditions);
                handleBillPrint();
            };

            var options = {
                params: {
                    'id': $stateParams.reservation_id,
                    'application': 'KIOSK'
                },
                successCallBack: fetchPrintViewCompleted,
                failureCallBack: printFailedActions
            };

            $scope.callAPI(zsCheckinSrv.fetchRegistrationCardPrintData, options);
        };

        startPrint();


        /**
         * [initializeMe description]
         */
        (function() { // initializeMe
            // show back button
            $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON); // hide back buttons in 2 options page
            // show close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
            $scope.showDoneButton = false;
        }());

    }
]);
