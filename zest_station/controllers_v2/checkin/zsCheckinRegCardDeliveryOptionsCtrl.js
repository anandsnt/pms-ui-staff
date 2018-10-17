sntZestStation.controller('zsCheckinRegCardDeliveryOptionsCtrl', [
    '$scope',
    '$state',
    'zsEventConstants',
    '$stateParams',
    'zsCheckinSrv',
    'zsUtilitySrv',
    'zsGeneralSrv',
    '$filter',
    '$timeout',
    '$window',
    '$translate',
    'zsReceiptPrintHelperSrv',
    '$log',
    function($scope, $state, zsEventConstants, $stateParams, zsCheckinSrv, zsUtilitySrv, zsGeneralSrv, $filter, $timeout, $window, $translate, zsReceiptPrintHelperSrv, $log) {

		/** ********************************************************************************************
		 **		Expected state params -----> reservation_id, room_no,  first_name, guest_id, key_success
		 *       and email
		 **		Exit function ->nextPageActions
		 **
		 ***********************************************************************************************/

        BaseCtrl.call(this, $scope);
		/**
		 * MODES IN THE SCREEN
		 * 1.EMAIL_ENTRY_MODE
		 * 2.EMAIL_INVLAID_MODE
		 * 3.DELIVERY_OPTIONS_MODE
		 * 4.EMAIL_SEND_MODE
		 */

		/**
		 * when the back button clicked
		 * @param  {[type]} event
		 * @return {[type]}
		 */
        $scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function() {
			// back button action from email send mode page will
			// take to 2 options page
            $scope.mode = 'DELIVERY_OPTIONS_MODE'; // hide back buttons in 2 options page
            $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
        });

        var generalError = function() {
            $scope.$emit('GENERAL_ERROR');
        };

        var nextPageActions = function(printopted, emailopted, actionStatus) {
            var stateParams = {
                key_success: $stateParams.key_success,
                key_type: $stateParams.key_type
            };

            if (printopted) {
                stateParams.print_opted = 'true';
                stateParams.print_status = actionStatus;
            } else {
                stateParams.email_opted = 'true';
                stateParams.email_status = actionStatus;
            }
            $state.go('zest_station.zsCheckinFinal', stateParams);
        };

		/**
		 * [clickedPrint description]
		 * @return {[type]} [description]
		 */
        $scope.clickedPrint = function() {
            var getTermsPrintable = function(terms) {
                sntZestStation.filter('unsafe', function($sce) {
                    return function(terms) {
                        return $sce.trustAsHtml(terms);
                    };
                });
            };

            var printFailedActions = function(errorMessage) {

                $scope.$emit('hideLoader');
                $scope.runDigestCycle();
                var printopted = true;
                var emailopted = false;
                var actionStatus = 'failed';

                errorMessage = _.isUndefined(errorMessage) ? 'CHECKIN_PRINT_FAIL' : errorMessage;
                if ($stateParams.key_success === 'true') {
                    $scope.zestStationData.workstationOooReason = $filter('translate')(errorMessage);
                    $scope.addReasonToOOSLog('CHECKIN_PRINT_FAIL');
                } else {
                    $scope.zestStationData.workstationOooReason = $filter('translate')('CHECKIN_KEY_FAIL_PRINT_FAIL');
                    $scope.addReasonToOOSLog('CHECKIN_KEY_FAIL_PRINT_FAIL');
                }
                $scope.zestStationData.workstationStatus = 'out-of-order';


                nextPageActions(printopted, emailopted, actionStatus);
            };
            var printSuccessActions = function() {

                $scope.$emit('hideLoader');
                $scope.runDigestCycle();
                var printopted = true;
                var emailopted = false;
                var actionStatus = 'success';

                nextPageActions(printopted, emailopted, actionStatus);
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
                        var receiptPrinterParams;

                        if ($scope.isIpad && $scope.zestStationData.zest_printer_option === 'RECEIPT') {
                            // Adding this condition here for easy debuging from browser in iPad mode
                            receiptPrinterParams = zsReceiptPrintHelperSrv.setUpStringForReceiptRegCard($scope.printRegCardData, $scope.zestStationData);
                            $log.info(receiptPrinterParams);
                        }
					/*
					 * ======[ PRINTING!! JS EXECUTION IS PAUSED ]======
					 */

                        if ($scope.isIpad && typeof cordova !== typeof undefined) { // CICO-40934 removed the sntapp load from zestJsAssetList, now just check for ipad/iphone
                            if ($scope.zestStationData.zest_printer_option === 'RECEIPT') {
                                cordova.exec(
                                    printSuccessActions,
                                    printFailedActions,
                                    'RVCardPlugin',
                                    'printReceipt', ['filep', '1', 'receipt_printer', receiptPrinterParams]);
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
		/**
		 * [selectEmailDelivery description]
		 * @return {[type]} [description]
		 */
        $scope.selectEmailDelivery = function() {
            $scope.mode = 'EMAIL_SEND_MODE';
			// show back buttons in email send mode page
            $scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
        };
		/**
		 * [sendEmail description]
		 * @return {[type]} [description]
		 */
        $scope.sendEmail = function() {
            $scope.trackEvent('CI - Email Registration', 'user_selected');

            var registrationCardSendingFailed = function() {
                $scope.trackEvent('CI - RegCardEmail - Failed', 'email_status');
                var printopted = false;
                var emailopted = true;
                var actionStatus = 'failed';

                nextPageActions(printopted, emailopted, actionStatus);
            };
            var registrationCardSent = function() {
                $scope.trackEvent('CI - RegCardEmail - Success', 'email_status');
                var printopted = false;
                var emailopted = true;
                var actionStatus = 'success';

                nextPageActions(printopted, emailopted, actionStatus);
            };

            var options = {
                params: {
                    'id': $stateParams.reservation_id,
                    'application': 'KIOSK'
                },
                successCallBack: registrationCardSent,
                failureCallBack: registrationCardSendingFailed
            };
            
            if ($scope.inDemoMode()) {
                registrationCardSent();
            } else {
                $scope.callAPI(zsCheckinSrv.sendRegistrationByEmail, options);    
            }
            
        };

		/**
		 * [reEnterText description]
		 * @return {[type]} [description]
		 */
        $scope.editEmailAddress = function(reenter) {
            if (!reenter) {
                $scope.trackEvent('CI - Edit Email', 'user_selected');    
            } else {
                $scope.trackEvent('CI - Re-Enter Edit Email (Reg-Delivery)', 'user_selected');
            }

            $scope.mode = 'EMAIL_ENTRY_MODE';
            $scope.focusInputField('email-entry');
        };

        $scope.$on('RE_EMAIL_ENTRY_MODE', function() {
            $scope.editEmailAddress(true);
        });


        $scope.$on('EMAIL_UPDATION_SUCCESS', function() {
            $scope.trackEvent('CI - Success', 'update_email');
            $scope.mode = 'EMAIL_SEND_MODE';
            $scope.callBlurEventForIpad();
        });


        $scope.$on('EMAIL_UPDATION_FAILED', function() {
            $scope.trackEvent('CI - Failed', 'update_email');
            var  stateParams = {
                'message': 'Email Updation Failed.'
            };
            
            $state.go('zest_station.speakToStaff', stateParams);
        });
		/**
		 * [initializeMe description]
		 */
        (function() {// initializeMe
			// show back button
            $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON); // hide back buttons in 2 options page
			// show close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
            if ($stateParams.email) {
                $scope.email = $stateParams.email.length > 0 && zsUtilitySrv.isValidEmail($stateParams.email) ? $stateParams.email : '';

            } else {
                $scope.email = '';
            }
            $scope.guestId = $stateParams.guest_id;

            $scope.from = $stateParams.from;
            if ($scope.zestStationData.registration_card.auto_print) {
                $scope.clickedPrint();
            } else {
                $scope.mode = 'DELIVERY_OPTIONS_MODE';
            }
        }());

    }
]);
