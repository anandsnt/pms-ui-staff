sntZestStation.controller('zsPrintBillCtrl', [
    '$scope',
    '$state',
    'zsCheckoutSrv', '$stateParams', '$window', '$timeout', '$filter', '$translate', 'zsReceiptPrintHelperSrv', '$log',
    function($scope, $state, zsCheckoutSrv, $stateParams, $window, $timeout, $filter, $translate, zsReceiptPrintHelperSrv, $log) {

        /** ******************************************************************************
         **      This is not a sperate state. It's an ng-included ctrl inside 
         **      zsReservationBill.html
         **      Expected state params -----> nothing              
         **      Exit function -> nextPageActions                             
         **                                                                       
         *********************************************************************************/

        BaseCtrl.call(this, $scope);
        $scope.showAddressOptions = false;
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
            $scope.zestStationData.consecutivePrintFailure = printopted === 'true' ? 0 : $scope.zestStationData.consecutivePrintFailure;
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
            $scope.zestStationData.consecutivePrintFailure++;
            if ($scope.zestStationData.consecutivePrintFailure >= $scope.zestStationData.kioskOutOfOrderTreshold) {
                $scope.zestStationData.workstationOooReason = $filter('translate')(errorMessage);
                $scope.zestStationData.workstationStatus = 'out-of-order';
                $scope.addReasonToOOSLog('CHECKOUT_PRINT_FAILED');
            }
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
                    var receiptPrinterParams;

                    if ($scope.zestStationData.zest_printer_option === 'RECEIPT') {
                        // Adding this condition here for easy debuging from browser in iPad mode
                        receiptPrinterParams = zsReceiptPrintHelperSrv.setUpStringForReceiptBill($scope.printData, $scope.zestStationData);
                        $log.info(receiptPrinterParams);
                    }
                    var printSuccessActions = function () {
                        var printopted = 'true';

                        nextPageActions(printopted);
                    };

                /*
                 * ======[ PRINTING!! JS EXECUTION IS PAUSED ]======
                 */
                    if ($scope.isIpad && typeof cordova !== typeof undefined) { // CICO-40934 removed the sntapp load from zestJsAssetList, now just check for ipad/iphone
                        if ($scope.zestStationData.zest_printer_option === 'RECEIPT') {
                            cordova.exec(
                                printSuccessActions,
                                function() {
                                    // To ensure the error message from receipt printer is not recorded,
                                    //  we will show our generic print error message
                                    printFailedActions();
                                },
                                'RVCardPlugin',
                                'printReceipt',
                                [ receiptPrinterParams ]);
                        } else {
                            cordova.exec(
                                printSuccessActions,
                                printFailedActions,
                                'RVCardPlugin',
                                'printWebView', ['filep', '1', $scope.zestStationData.defaultPrinter]);
                        }

                    } else {
                        if ($scope.zestStationData.zest_printer_option === 'STAR_TAC' && $scope.zestStationData.kiosk_use_socket_print) {
                        // we will call websocket services to print
                            handleStarTacPrinterActions();
                        } else {
                            $timeout(function() {
                                $scope.$emit('PRINT_CURRENT_PAGE');
                                $timeout(function() {
                                    printSuccessActions();
                                }, 100);
                            }, 500);
                            
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

        var executePrint = function(addressType) {
            $scope.printData.addressType = addressType;
            if (addressType === 'ta') {
                $scope.printData.billingInfo = $scope.printData.ta_card_details;
            } else if (addressType === 'company') {
                $scope.printData.billingInfo = $scope.printData.company_card_details;
            } else {
                $scope.printData.billingInfo = $scope.printData.guest_info;
            }
            
            // add the orientation
            addPrintOrientation();
            // print section - if its from device call cordova.
            handleBillPrint();
        };

        var sendEmailAlongWithPrint = false;

        $scope.$on('EMAIL_TO_BE_SEND_WITH_PRINT', function(ev, data) {
            sendEmailAlongWithPrint = data.sendEmail;
        });

        $scope.addressSelected = function(addressType) {
            executePrint(addressType);
            if (sendEmailAlongWithPrint) {
                $scope.emailInvoice(addressType);
            }
        };

        var fetcCompanyTADetails = function() {
            var successCallBack = function(response) {
                $scope.printData.guest_info = response.guest;
                $scope.printData.company_card_details = response.company_card;
                if (response &&
                    (response.company_card && response.company_card.name)) {
                    $scope.showAddressOptions = true;
                } else {
                    executePrint('guest');
                }
            };

            var data = {
                'reservation_id': $scope.reservation_id
            };
            var options = {
                params: data,
                successCallBack: successCallBack
            };
            
            $scope.callAPI(zsCheckoutSrv.fetchCompanyTADetails, options);
        };

        var fetchBillData = function() {
            var data = {
                reservation_id: $scope.reservation_id,
                bill_number: 1,
                locale: $translate.use()
            };

            var fetchBillSuccess = function(response) {
                $scope.printData = response;
                fetcCompanyTADetails();
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
