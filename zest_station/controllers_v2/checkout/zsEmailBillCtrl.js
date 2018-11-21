sntZestStation.controller('zsEmailBillCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    'zsEventConstants',
    'zsUtilitySrv',
    'zsCheckoutSrv',
    'zsGeneralSrv',
    function($scope, $stateParams, $state, zsEventConstants, zsUtilitySrv, zsCheckoutSrv, zsGeneralSrv) {

		/** *********************************************************************************************
		 **		Expected state params -----> printopted, reservation_id, email and guest_detail_id			  
		 **		Exit functions -> checkOutSuccess							
		 **																		 
		 ************************************************************************************************/


		/** MODES in the screen
		 *   1.EMAIL_BILL_GUEST_OPTIONS --> two options - send email and edit email
		 *   2.EMAIL_BILL_EDIT_MODE --> email entry mode
		 *   3.GUEST_BILL_EMAIL_SENT --> checked out and mail has been sent/mail sending failed
		 *   4.emailError --> invalid email
		 **/

		/*
		 *  general failure actions
		 **/
        var failureCallBack = function() {
			// if key card was inserted we need to eject that
            $scope.$emit('EJECT_KEYCARD');
            $state.go('zest_station.speakToStaff');
        };


        var checkIfEmailIsBlacklisted = function(afterBlackListValidation, onBlackListedEmailFound, onValidationAPIFailure) {
            var blacklistCheckOptions = {
                params: {
                    'email': $scope.email
                },
                successCallBack: function(data) {
					// onSuccess, 
                    if (!data.black_listed_email) {
                        afterBlackListValidation();

                    } else {
                        console.warn('email is black listed, request different email address');
                        onBlackListedEmailFound();
                    }
                },
                failureCallBack: onValidationAPIFailure
            };

            $scope.callAPI(zsGeneralSrv.emailIsBlackListed, blacklistCheckOptions);
        };

        var callSaveEmail = function() {
            $scope.callBlurEventForIpad();

            var afterBlackListValidation = function() {
                var params = {
                    'guest_detail_id': $stateParams.guest_detail_id,
                    'email': $scope.email
                };
                var emailSaveSuccess = function() {
                    $scope.mode = 'EMAIL_BILL_GUEST_OPTIONS';
                };
                var options = {
                    params: params,
                    successCallBack: emailSaveSuccess,
                    failureCallBack: failureCallBack
                };

                $scope.callAPI(zsCheckoutSrv.saveEmail, options);
            };

            var onBlackListedEmailFound = function() {
                $scope.emailError = true;
                $scope.focusInputField('email_text');
            };
            var onValidationAPIFailure = function() {
                updateGuestEmailFailed();
            };
			//
			// future story, enable black-list check here
			//
			// checks if new email is blacklisted, if so, set invalid email mode
			// otherwise, continue updating guest email
			// checkIfEmailIsBlacklisted(afterBlackListValidation, onBlackListedEmailFound, onValidationAPIFailure);

            afterBlackListValidation();

        };

        $scope.editEmailAddress = function() {
            $scope.mode = 'EMAIL_BILL_EDIT_MODE';
            $scope.focusInputField('email_text');
        };


        $scope.goToNextScreen = function() {
            $scope.callBlurEventForIpad();
            // for overlay we will be checking out at this point
            if (!$scope.zestStationData.is_standalone) {
                $scope.checkOutGuest();
            } else {
                $scope.emailSendingFailed = true;
                $scope.mode = 'GUEST_BILL_EMAIL_SENT';
            }
        };

        $scope.sendEmail = function() {
			// future story, add black-list check here

            var sendBillSuccess = function() {
                $scope.emailSent = true;
                $scope.mode = 'GUEST_BILL_EMAIL_SENT';
            };
            var sendBillFailure = function() {
                $scope.emailSendingFailed = true;
                $scope.mode = 'GUEST_BILL_EMAIL_SENT';
            };
            var params = {
                reservation_id: $stateParams.reservation_id,
                bill_number: '1'
            };
            var options = {
                params: params,
                successCallBack: sendBillSuccess,
                failureCallBack: sendBillFailure
            };

            $scope.callBlurEventForIpad();

            $scope.callAPI(zsCheckoutSrv.sendBill, options);
        };

        /**
         *  Checkout the Guest
         */
        $scope.checkOutGuest = function() {
            var params = {
                'reservation_id': $stateParams.reservation_id,
                'is_kiosk': true
            };
            var checkOutSuccess = function() {
                $scope.$emit('CAPTURE_KEY_CARD');
                if ($scope.zestStationData.guest_bill.print) { // go to print nav
                    $scope.stateParamsForNextState = {
                        email_sent: 'true'
                    };
                    $scope.reservation_id = $stateParams.reservation_id;
                    $scope.mode = 'PRINT_MODE';
                } else {
                    var stateParams = {
                        'printopted': 'false',
                        'email_sent': 'true',
                    };

                    $state.go('zest_station.reservationCheckedOut', stateParams);
                }
            };
            var options = {
                params: params,
                successCallBack: checkOutSuccess,
                failureCallBack: failureCallBack
            };

            $scope.callAPI(zsCheckoutSrv.checkoutGuest, options);
        };

		/**
		 * [saveEmail to save the email to the reservation]
		 * @return {[type]} [description]
		 */
        $scope.saveEmail = function() {
            if ($scope.email.length === 0) {
                return;
            } 
			// check if email is valid
            if (zsUtilitySrv.isValidEmail($scope.email)) {
                callSaveEmail();
            } else {
                $scope.emailError = true;
                $scope.callBlurEventForIpad();
            }
        };

        $scope.reTypeEmail = function() {
            $scope.editEmailAddress();
            $scope.emailError = false;
        };

		/**
		 * [initializeMe description]
		 */
        (function() {// initializeMe
            BaseCtrl.call(this, $scope);
			// hide back button
            $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
			// hide close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
            $scope.email = $stateParams.email;
			// check if print was done
            $scope.printOpted = $stateParams.printopted === 'true';
			// if user already has email provide two options
			// else prompt for email entry
            $scope.mode = $scope.email && zsUtilitySrv.isValidEmail($scope.email) ? 'EMAIL_BILL_GUEST_OPTIONS' : 'EMAIL_BILL_EDIT_MODE';
            if ($scope.mode === 'EMAIL_BILL_EDIT_MODE') {
                $scope.focusInputField('email_text');
            }
            $scope.printMode = false;// this is for non-standalone

             if ($stateParams.isQuickJump === 'true') {
                $scope.email = "guest@hotel.com";
                if ($stateParams.quickJumpMode === 'EMAIL_BILL_GUEST_OPTIONS') {
                    $stateParams.mode = 'EMAIL_BILL_GUEST_OPTIONS';
                    $scope.mode = 'EMAIL_BILL_GUEST_OPTIONS';
                } else {
                    $scope.mode = 'EMAIL_BILL_EDIT_MODE';
                }
            }

        }());


    }
]);