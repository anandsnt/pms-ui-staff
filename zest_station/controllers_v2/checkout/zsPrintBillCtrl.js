sntZestStation.controller('zsPrintBillCtrl', [
    '$scope',
    '$state',
    'zsCheckoutSrv', '$stateParams', '$window', '$timeout', '$filter', '$translate',
    function($scope, $state, zsCheckoutSrv, $stateParams, $window, $timeout, $filter, $translate) {

        /** ******************************************************************************
         **      This is not a sperate state. It's an ng-included ctrl inside 
         **      zsReservationBill.html
         **      Expected state params -----> nothing              
         **      Exit function -> nextPageActions                             
         **                                                                       
         *********************************************************************************/

        BaseCtrl.call(this, $scope);
        /**
         *  general failure actions inside bill screen
         **/
        var failureCallBack = function() {
            // if key card was inserted we need to eject that
            $scope.$emit('EJECT_KEYCARD');
            $state.go('zest_station.speakToStaff');
        };
        var nextPageActions = function(printopted) {
            $scope.$emit('hideLoader');
            $scope.runDigestCycle();
            // for overlay the email collection is before print and for 
            // stand alone its after print bil
            if ($scope.zestStationData.guest_bill.email && $scope.zestStationData.is_standalone) {
                if (!$scope.inDemoMode()) {
                    $scope.stateParamsForNextState.printopted = printopted;    
                }
                $state.go('zest_station.emailBill', $scope.stateParamsForNextState);
            } else {
                var stateParams = {};

                if (!$scope.inDemoMode()) {
                    stateParams = {
                        'printopted': printopted,
                        'email_sent': $scope.stateParamsForNextState.email_sent,
                        'email_failed': $scope.stateParamsForNextState.email_failed
                    };
                }

                $state.go('zest_station.reservationCheckedOut', stateParams);
            }
        };
        var printFailedActions = function(errorMessage) {
            $scope.$emit('hideLoader');
            errorMessage = _.isUndefined(errorMessage) ? 'CHECKOUT_PRINT_FAILED' : errorMessage;
            $scope.zestStationData.workstationOooReason = $filter('translate')(errorMessage);
            $scope.zestStationData.workstationStatus = 'out-of-order';
            $scope.addReasonToOOSLog('CHECKOUT_PRINT_FAILED');
            var printopted = 'false';

            $scope.runDigestCycle();
            nextPageActions(printopted);
        };

        var handleStarTacPrinterActions = function() {

            var printData = '';

            /** ** Socket actions starts here *****/
            $scope.$on('SOCKET_FAILED', function() {
                printFailedActions();
            });
            $scope.$on('WS_PRINT_SUCCESS', function() {
                var printopted = 'true';

                nextPageActions(printopted);
            });
            $scope.$on('WS_PRINT_FAILED', function(event, data) {
                printFailedActions(data.error_message);
            });
            $scope.$on('SOCKET_CONNECTED', function() {
                $scope.socketOperator.startPrint(printData);
                $scope.$emit('showLoader');
            });
            /** ** Socket actions ends here *****/

            var fetchSatrTacBillSuccess = function(response) {
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
                'reservation_id': $scope.reservation_id,
                'language_code': $translate.use()
            };
            var startTacDataFailedActions = function() {
                printFailedActions();
            };
            var options = {
                params: data,
                successCallBack: fetchSatrTacBillSuccess,
                failureCallBack: startTacDataFailedActions
            };

            $scope.callAPI(zsCheckoutSrv.fetchStarTacPrinterData, options);
        };

        var handleBillPrint = function() {
            $scope.$emit('hideLoader');
            setBeforePrintSetup();
           
            try {
            // this will show the popup with full bill
                $timeout(function() {
                /*
                 * ======[ PRINTING!! JS EXECUTION IS PAUSED ]======
                 */
                    if ($scope.isIpad && typeof cordova !== typeof undefined) { // CICO-40934 removed the sntapp load from zestJsAssetList, now just check for ipad/iphone
                        var printer = sntZestStation.selectedPrinter;

                        cordova.exec(function(success) {
                            var printopted = 'true';

                            nextPageActions(printopted);
                        }, function(error) {
                            printFailedActions();
                        }, 'RVCardPlugin', 'printWebView', ['filep', '1', printer]);
                    } else {
                        if ($scope.zestStationData.zest_printer_option === 'STAR_TAC' && $scope.zestStationData.kiosk_use_socket_print) {
                        // we will call websocket services to print
                            handleStarTacPrinterActions();
                        } else {
                            $scope.$emit('PRINT_CURRENT_PAGE');
                            setTimeout(function() {
                                var printopted = 'true';

                                nextPageActions(printopted);
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
                var printopted = 'true';
            }, 100);
        };


        var fetchBillData = function() {
            var data = {
                'reservation_id': $scope.reservation_id,
                'bill_number': 1
            };

            var fetchBillSuccess = function(response) {
                $scope.printData = response;
                // add the orientation
                addPrintOrientation();
                // print section - if its from device call cordova.
                handleBillPrint();
            };
            var options = {
                params: data,
                successCallBack: fetchBillSuccess,
                failureCallBack: failureCallBack
            };

            $scope.callAPI(zsCheckoutSrv.fetchBillPrintData, options);
        };

        $scope.printBill = function() {
            $scope.trackEvent('CO - Print Bill', 'user_selected');
            fetchBillData();
        };

        $scope.clickedNoThanks = function() {
            $scope.trackEvent('CO - No Thanks, Dont Print', 'user_selected');
            var printopted = 'false';

            nextPageActions(printopted);
        };

    }
]);