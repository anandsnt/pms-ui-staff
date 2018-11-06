sntZestStation.controller('zsCheckInTermsConditionsCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    'zsEventConstants',
    'zsCheckinSrv',
    '$timeout',
    '$sce',
    'zsUtilitySrv',
    function($scope, $rootScope, $state, $stateParams, zsEventConstants, zsCheckinSrv, $timeout, $sce, zsUtilitySrv) {

		/** ********************************************************************************************
		 **		Please note that, not all the stateparams passed to this state will not be used in this state, 
		 **      however we will have to pass this so as to pass again to future states which will use these.
		 **
		 **      Expected state params -----> reservation_id,  first_name, guest_id ,payment_type_id
		 **       ,deposit_amount , guest_email_blacklisted, room_no, room_status and email           
		 **      Exit function -> updateComplete                             
		 **                                                                       
		 ***********************************************************************************************/

        // TODO: will have to rename this state. 
        // This is the junction from which the navigations to different screens happens. checkinSuccess,collectNationality,checkinKeyDispense,checkInEmailCollection etc.
        // For now, this page will just redirect to next pages.
        // We will use the logic we added for bypass T&C to handle for now.

        BaseCtrl.call(this, $scope);

   //      var init = function() {
			// // hide back button
   //          $scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
			// // show close button
   //          $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
			// // back button action
   //          $scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
   //              if ($stateParams.is_from_addons === 'true') {
   //                  $state.go('zest_station.addOnUpsell', {
   //                      'is_from_room_upsell': $stateParams.is_from_room_upsell
   //                  });
   //              } else if ($stateParams.is_from_room_upsell === 'true') {
   //                  $state.go('zest_station.roomUpsell');
   //              } else {
   //                  $state.go('zest_station.checkInReservationDetails', $stateParams);
   //              }
   //          });
			// // starting mode
   //          $scope.mode = 'TERMS_CONDITIONS';
   //          $scope.setScreenIcon('bed');
   //      };

		/**
		 * [checkIfEmailIsBlackListedOrValid description]
		 * @return {[type]} [description]
		 */
        var checkIfEmailIsBlackListedOrValid = function() {
            var email = $stateParams.guest_email ? $stateParams.guest_email : $stateParams.email;
            
            if (!email) {
                email = '';
            }

            return email.length > 0 && !($stateParams.guest_email_blacklisted === 'true') && zsUtilitySrv.isValidEmail(email);
        };
		/**
		 * [afterGuestCheckinCallback description]
		 * @param  {[type]} response [description]
		 * @return {[type]}          [description]
		 */
        var afterGuestCheckinCallback = function(response) {
			// if email is valid and is not blacklisted
            var haveValidGuestEmail = checkIfEmailIsBlackListedOrValid(),
                collectNationalityEnabled = $scope.zestStationData.check_in_collect_nationality;

            console.warn('afterGuestCheckinCallback :: current state params: ', $stateParams);
            var stateParams = {
                'guest_id': $stateParams.guest_id,
                'reservation_id': $stateParams.reservation_id,
                'room_no': $stateParams.room_no,
                'first_name': $stateParams.first_name,
                'email': $stateParams.guest_email
            };

            console.info('haveValidGuestEmail: ', haveValidGuestEmail);

            if ($scope.zestStationData.is_kiosk_ows_messages_active) {
                $scope.setScreenIcon('checkin');
                $state.go('zest_station.checkinSuccess', stateParams);
            }
            // if collectiing nationality after email, but email is already valid
            else if (collectNationalityEnabled && haveValidGuestEmail) {
                $state.go('zest_station.collectNationality', stateParams);

            } else if (haveValidGuestEmail) {
                $state.go('zest_station.checkinKeyDispense', stateParams);

            } else {
                // if email is invalid, collect email
                console.warn('to email collection: ', stateParams);
                $state.go('zest_station.checkInEmailCollection', stateParams);
            }

        };
        
        var collectPassportEnabled = $scope.zestStationData.check_in_collect_passport;

        var checkInGuest = function() {
            var signature = $scope.signatureData;
            var checkinParams = {
                'reservation_id': $stateParams.reservation_id,
                'workstation_id': $scope.zestStationData.set_workstation_id,
                'authorize_credit_card': false,
                'do_not_cc_auth': false,
                'is_promotions_and_email_set': false,
//               "no_post": "",//handled by the API CICO-35315
                'is_kiosk': true,
                'signature': signature
            };
            var options = {
                params: checkinParams,
                successCallBack: afterGuestCheckinCallback
            };

            if (collectPassportEnabled) {
                $scope.zestStationData.checkinGuest = function() {// make a reference to current checkInGuest method used if passport scanning
                    
                    if ($scope.zestStationData.noCheckInsDebugger === 'true') {
                        afterGuestCheckinCallback({ 'status': 'success' });
                    } else {
                        $scope.callAPI(zsCheckinSrv.checkInGuest, options);
                    }
                    
                };   
            }

            if ($scope.zestStationData.kiosk_manual_id_scan) {
                $state.go('zest_station.checkInIdVerification', {
                    params: JSON.stringify($stateParams)
                });
            }
            else if ($scope.zestStationData.noCheckInsDebugger === 'true') {
                if (collectPassportEnabled && !$stateParams.passports_scanned) {
                    $state.go('zest_station.checkInScanPassport', $stateParams);
                } else {
                    afterGuestCheckinCallback({ 'status': 'success' });
                }
                
            } else {

                if (collectPassportEnabled && !$stateParams.passports_scanned) {
                    $state.go('zest_station.checkInScanPassport', $stateParams);
                } else {
                    $scope.callAPI(zsCheckinSrv.checkInGuest, options);
                }

            }
        };


        var goToDepositScreen = function() {
            console.warn('to deposit screen: ', $stateParams.first_name);
            var stateparams = {
                'guest_email': $stateParams.guest_email,
                'guest_email_blacklisted': $stateParams.guest_email_blacklisted,
                'payment_type_id': $stateParams.payment_type_id,
                'deposit_amount': $stateParams.deposit_amount,
                'first_name': $stateParams.first_name,
                'room_no': $stateParams.room_no,
                'room_status': $stateParams.room_status,
                'reservation_id': $stateParams.reservation_id,
                'guest_id': $stateParams.guest_id,
                'mode': 'DEPOSIT',
                'balance_amount': $stateParams.balance_amount,
                'confirmation_number': $stateParams.confirmation_number,
                'pre_auth_amount_for_zest_station': $stateParams.pre_auth_amount_for_zest_station,
                'authorize_cc_at_checkin': $stateParams.authorize_cc_at_checkin
            };
			// check if this page was invoked through pickupkey flow

            if ($stateParams.pickup_key_mode) {
                stateparams.pickup_key_mode = 'manual';
            }
            if ($scope.zestStationData.paymentGateway === 'MLI' && $scope.zestStationData.hotelSettings.mli_cba_enabled) {
                stateparams.payment_method = $stateParams.payment_method;
                var toParamsJson = JSON.stringify(stateparams);
                
                $state.go('zest_station.checkInMLIAndCBACCCollection', {params: toParamsJson});
            } else {
                $state.go('zest_station.checkInDeposit', stateparams);
            }
        };


        var depositAmount = function() {
            if ($stateParams.deposit_amount) {
                return Math.ceil(parseFloat($stateParams.deposit_amount));
            } else {
                return 0;
            }
        };
        var depositRequired = function() {
            console.log('$scope.zestStationData.enforce_deposit: ', $scope.zestStationData.enforce_deposit);
            console.log('depositAmount: ', depositAmount());
            return $scope.zestStationData.enforce_deposit && depositAmount() > 0;
        };
        var goToCreditCardAuthScreen = function() {
            var stateParams = {
                'reservation_id': $stateParams.reservation_id,
                'guest_email': $stateParams.guest_email,
                'guest_email_blacklisted': $stateParams.guest_email_blacklisted,
                'payment_type_id': $stateParams.payment_type_id,
                'deposit_amount': $stateParams.deposit_amount,
                'room_no': $stateParams.room_no,
                'room_status': $stateParams.room_status,
                'id': $stateParams.reservation_id,
                'confirmation_number': $stateParams.confirmation_number,
                'guest_id': $stateParams.guest_id,
                'first_name': $stateParams.first_name,
                'mode': 'CREDIT_CARD_AUTH',
                'balance_amount': $stateParams.balance_amount,
                'pre_auth_amount_for_zest_station': $stateParams.pre_auth_amount_for_zest_station,
                'authorize_cc_at_checkin': $stateParams.authorize_cc_at_checkin
            };
			// check if this page was invoked through pickupkey flow

            if ($stateParams.pickup_key_mode) {
                stateParams.pickup_key_mode = 'manual';
            }
            if ($scope.zestStationData.paymentGateway === 'MLI' && $scope.zestStationData.hotelSettings.mli_cba_enabled) {
                // In case of CBA + MLI - if CC is already present use that CC for 
                // further actions. Else collect a new CC using MLI
                if ($stateParams.payment_method === 'CC') {
                    checkInGuest();
                } else {
                    var toParamsJson = JSON.stringify(stateParams);

                    $state.go('zest_station.checkInMLIAndCBACCCollection',  {params: toParamsJson});
                }
            } else {
                $state.go('zest_station.checkInCardSwipe', stateParams);
            }
        };

        var nextPageActions = function(byPassCC) {
			// check if depsoit is to be paid
            if (depositRequired() && !$scope.zestStationData.bypass_kiosk_cc_auth) {
                goToDepositScreen();
            } else if (!byPassCC && !$scope.zestStationData.bypass_kiosk_cc_auth) {
                goToCreditCardAuthScreen();
            } else {
                checkInGuest(); // by-pass CC
            }
        };

        var checkIfNeedToSkipCC = function(showDeposit) {

            var checkIfCCToBeBypassed = function(response) {
				// 1. If Routing is setup, bypass the credit card collection screen.
				// 2. If guest has $0 balance  AND there are no other Bill Windows present, 
				// bypass the credit card collection screen
				// 3. If guest payment type is PP - Pre Payment or DB - Direct Bill, 
				// bypass the credit card collection screen
				// 4. if No Routing and balance > 0, credit card prompt like normal.
                return response.routing_setup_present ||
					parseInt($stateParams.balance_amount) === 0 && response.no_of_bill_windows === 1 ||
					(response.paymenet_type === 'PP' || response.paymenet_type === 'DB');
            };
            var onSuccess = function(response) {
                var byPassCC = checkIfCCToBeBypassed(response) ? true : false;

                nextPageActions(byPassCC);
            };
			// states are not to store varaiable, use service
            var options = {
                params: {
                    'reservation_id': $stateParams.reservation_id
                },
                successCallBack: onSuccess
            };

            if ($scope.zestStationData.bypass_cc_for_prepaid_reservation) {
                if ($scope.usingFakeReservation()) {
                    nextPageActions(false);
                    
                } else {
                    $scope.callAPI(zsCheckinSrv.fetchReservationBalanceDetails, options);    
                }
                

            } else {
                var byPassCC = false;

                nextPageActions(byPassCC);
            }

        };

        checkIfNeedToSkipCC();
    }
]);