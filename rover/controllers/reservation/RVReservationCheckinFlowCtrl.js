angular.module('sntRover').controller('RVReservationCheckInFlowCtrl',
    ['$scope', '$rootScope', 'RVHotelDetailsSrv', '$log', 'RVCCAuthorizationSrv', 'ngDialog', '$timeout', 'RVBillCardSrv',
        '$state',
        function ($scope, $rootScope, RVHotelDetailsSrv, $log, RVCCAuthorizationSrv, ngDialog, $timeout, RVBillCardSrv,
                  $state) {

            // NOTE rvBillCardCtrl is a parent for this controller! and a few variables and methods from the parent's scope are used in here

            // Object to store listener handles
            var listeners = {};

            var getPaymentMethodId = function () {
                return ($scope.billData.credit_card_details && $scope.billData.credit_card_details['payment_id']) || '';
            };

            var fetchAuthInfo = function () {
                $scope.callAPI(RVCCAuthorizationSrv.fetchPendingAuthorizations, {
                    loader: false,
                    params: $scope.reservationBillData.reservation_id,
                    successCallBack: function (response) {
                        var billRoutingInfo = $scope.reservationBillData.routing_info,
                            canPayIncidentalsOnly = response.is_cc_authorize_for_incidentals_active &&
                                (billRoutingInfo.incoming_from_room || billRoutingInfo.out_going_to_comp_tra);


                        $scope.authorizationInfo = response;
                        // Default the authorization amount to full; can be set to the incidentals if user chooses so
                        $scope.checkInState.authorizationAmount = response.pre_auth_amount_at_checkin || 0;
                        angular.extend($scope.authorizationInfo, {
                            routingToRoom: billRoutingInfo.out_going_to_room,
                            routingFromRoom: billRoutingInfo.incoming_from_room,
                            routingToAccount: billRoutingInfo.out_going_to_comp_tra,
                            canPayIncidentalsOnly: canPayIncidentalsOnly
                        });
                        $scope.checkInState.isAuthInfoFetchComplete = true;
                    },
                    failureCallBack: function (errorMessage) {
                        $scope.errorMessage = errorMessage;
                        $scope.checkInState.isAuthInfoFetchComplete = true;
                    }
                });
            };

            // STEP A PROMPT TO SELECT AMOUNT
            var promptForAuthorizationAmount = function () {
                ngDialog.open({
                    template: '/assets/partials/authorization/rvCheckInAuthUserActionPopup.html',
                    className: '',
                    closeByDocument: false,
                    closeByEscape: false,
                    scope: $scope
                });
            };

            // STEP B PROMPT FOR SWIPE
            var promptForSwipe = function () {
                // prompting for swipe can be disabled from admin > reservations > reservation settings
                if (!$scope.reservationBillData.is_disabled_cc_swipe) {
                    $scope.checkInState.isListeningSwipe = true;
                    ngDialog.open({
                        template: '/assets/partials/payment/rvPleaseSwipeModal.html',
                        className: '',
                        scope: $scope
                    });
                } else if ($scope.checkInState.hasCardOnFile) {
                    authorize({
                        is_emv_request: false,
                        amount: $scope.checkInState.authorizationAmount,
                        payment_method_id: getPaymentMethodId()
                    });
                } else {
                    $log.info('prompt for swipe disabled in settings AND cannot authorize WITHOUT card on file');
                    // CICO-43681 Authorization is applicable only for credit cards; as there is no credit card and
                    // prompting for card is disabled; continue to check-in
                    completeCheckin();
                }
            };

            /**
             * The params should contain the following keys
             * is_emv_request - boolean; defaults to false
             * amount - number; defaults to 0
             * payment_method_id - number
             * @param {object} params as described above
             * @return {undefined}
             */
            var authorize = function (params) {
                _.extend(params, {
                    reservation_id: $scope.reservationBillData.reservation_id
                });

                if (params.amount > 0 && $rootScope.isStandAlone) {
                    ngDialog.open({
                        template: '/assets/partials/authorization/ccAuthorization.html',
                        className: '',
                        closeByDocument: false,
                        scope: $scope,
                        controller: 'RVCheckInAuthCtrl',
                        data: angular.toJson(params)
                    });
                } else {
                    completeCheckin();
                }
            };


            var completeCheckin = function () {
                var signature = $scope.getSignature(),
                    params = {
                        is_promotions_and_email_set: $scope.saveData.promotions,
                        reservation_id: $scope.reservationBillData.reservation_id,
                        no_post: $scope.reservationBillData.roomChargeEnabled === '' ? false : !$scope.reservationBillData.roomChargeEnabled
                    };

                $log.info('completeCheckIn', params);


                if (signature !== 'isSigned' && signature !== '[]') {
                    params.signature = $scope.getSignatureBase64Data();
                }

                // This flag is set from the rvBillCardCtrl
                if ($scope.swippedCard) {
                    _.extend(params, $scope.checkInState.swipedCardData);
                }

                ngDialog.close();

                $scope.callAPI(RVBillCardSrv.completeCheckin, {
                    params: params,
                    successCallBack: $scope.completeCheckinSuccessCallback,
                    failureCallBack: $scope.completeCheckinFailureCallback
                });
            };

            // ------------------------------------------------------------------------------------ state
            $scope.checkInState = {
                authorizeIncidentalOnly: false,
                authorizationAmount: 0,
                hasActiveEMV: RVHotelDetailsSrv.isActiveMLIEMV(),
                hasSuccessfulAuthorization: false,
                hasCardOnFile: $scope.billHasCreditCard(),
                isAuthInfoFetchComplete: false,
                isAuthorizationInProgress: false,
                requireSignature: $scope.signatureNeeded(),
                requireTerms: $scope.termsConditionsNeeded(),
                isListeningSwipe: false,
                swipedCardData: {}
            };

            // ------------------------------------------------------------------------------------ onUserAction
            $scope.onClickEMV = function () {
                var amountToAuth = $scope.checkInState.authorizationAmount;

                // In case of EMV, if user hasn't chosen incidentals only
                // we will have to authorize for the original Amount;
                if (!$scope.checkInState.authorizeIncidentalOnly) {
                    amountToAuth = $scope.authorizationInfo.original_pre_auth_amount_at_checkin;
                }

                authorize({
                    is_emv_request: true,
                    amount: amountToAuth
                });
            };

            $scope.onClickUseCardOnFile = function () {
                authorize({
                    is_emv_request: false,
                    amount: $scope.checkInState.authorizationAmount,
                    payment_method_id: getPaymentMethodId()
                });
            };

            $scope.onClickNoSwipe = function () {
                ngDialog.close();
                completeCheckin();
            };

            $scope.onClickIncidentalsOnly = function () {
                $scope.checkInState.authorizeIncidentalOnly = true;
                // set the authorization amount to incidentals
                $scope.checkInState.authorizationAmount = $scope.authorizationInfo.pre_auth_amount_for_incidentals;
                ngDialog.close();
                $timeout(promptForSwipe, 700);
            };

            $scope.onClickFullAuth = function () {
                $scope.checkInState.authorizeIncidentalOnly = false;
                $scope.checkInState.authorizationAmount = $scope.authorizationInfo.pre_auth_amount_at_checkin;
                ngDialog.close();
                $timeout(promptForSwipe, 700);
            };

            $scope.onClickManualAuth = function () {
                completeCheckin();
            };

            // ------------------------------------------------------------------------------------ onCheckIn
            $scope.checkIn = function () {
                var errorMsg,
                    signatureData = $scope.getSignature(),
                    reservationStatus = $scope.reservationBillData.reservation_status;

                if ($scope.signatureNeeded(signatureData) && !$scope.reservation.reservation_card.is_pre_checkin) {
                    errorMsg = 'Signature is missing';
                    $scope.showErrorPopup(errorMsg);
                    return;
                } else if ($scope.termsConditionsNeeded()) {
                    errorMsg = 'Please check agree to the Terms & Conditions';
                    $scope.showErrorPopup(errorMsg);
                    return;
                } else if ($scope.validateEmailNeeded()) {
                    ngDialog.open({
                        template: '/assets/partials/validateCheckin/rvAskEmailFromCheckin.html',
                        controller: 'RVValidateEmailPhoneCtrl',
                        className: '',
                        scope: $scope
                    });
                    return;
                }

                // CICO-36122 - Set this to keep the promos and news opt in check-in screen in sync with guest card
                if (!!$scope.guestCardData && !!$scope.guestCardData.contactInfo) {
                    $scope.guestCardData.contactInfo.is_opted_promotion_email = $scope.saveData.promotions;
                }

                if ($scope.hasAnySharerCheckedin()) {
                    // Do nothing , Keep going check-in process , it is a sharer reservation..
                }
                else if (($scope.reservationBillData.room_status === 'NOTREADY' ||
                        $scope.reservationBillData.fo_status === 'OCCUPIED') && !$rootScope.queuedCheckIn) {
                    // Go to room assignment view
                    $state.go('rover.reservation.staycard.roomassignment', {
                        'reservation_id': $scope.reservationBillData.reservation_id,
                        'room_type': $scope.reservationBillData.room_type,
                        'clickedButton': 'checkinButton',
                        'upgrade_available': $scope.reservationBillData.is_upsell_available &&
                        (reservationStatus === 'RESERVED' || reservationStatus === 'CHECKING_IN')
                    });

                    return false;
                }

                // see if the auth info fetch has been completed! else show loader
                if ($scope.checkInState.isAuthInfoFetchComplete) {
                    $scope.$emit('hideLoader');
                    // This step is required as the user can edit the payment method from the check-in screen
                    $scope.checkInState.hasCardOnFile = $scope.billHasCreditCard();

                    // is_cc_authorize_at_checkin_enabled is returned in /api/reservations/:reservation_id/pre_auth
                    if ($scope.authorizationInfo.is_cc_authorize_at_checkin_enabled ||
                        !$scope.reservationBillData.is_disabled_cc_swipe) {
                        if ($scope.checkInState.hasCardOnFile &&
                            ($scope.authorizationInfo.routingToRoom ||
                                $scope.authorizationInfo.routingFromRoom ||
                                $scope.authorizationInfo.routingToAccount)) {
                            // https://stayntouch.atlassian.net/browse/CICO-17287
                            promptForAuthorizationAmount();
                        } else {
                            promptForSwipe();
                        }
                    } else {
                        // if is_cc_authorize_at_checkin enabled is false; then needn't authorize
                        completeCheckin();
                    }
                } else {
                    $scope.$emit('showLoader');
                    $timeout($scope.checkIn, 700);
                }
            };

            listeners['CONTINUE_CHECKIN'] = $scope.$on('CONTINUE_CHECKIN', function (response) {
                $log.info('CONTINUE_CHECKIN', response);
                completeCheckin();
            });

            listeners['SWIPED_CARD_ADDED'] = $scope.$on('SWIPED_CARD_ADDED', function (event, swipedCardData) {
                // Wait till the other modals have closed
                if ($scope.checkInState.isListeningSwipe) {
                    $timeout(function () {
                        $scope.checkInState.swipedCardData = swipedCardData;
                        $scope.onClickUseCardOnFile();
                    }, 700);
                }
            });

            listeners['STOP_CHECKIN_PROCESS'] = $scope.$on('STOP_CHECKIN_PROCESS', function () {
                $scope.checkInState.isListeningSwipe = false;
                $scope.checkInState.authorizationAmount = $scope.authorizationInfo.pre_auth_amount_at_checkin;
                ngDialog.close();
            });

            // ------------------------------------------------------------------------------------ Init
            (function () {
                $scope.authorizationInfo = null;
                // Do an async fetch of the auth info... needn't show blocker
                fetchAuthInfo();
            })();

            // ------------------------------------------------------------------------------------ Clean up...

            $scope.$on('$destroy', listeners['CONTINUE_CHECKIN']);
            $scope.$on('$destroy', listeners['SWIPED_CARD_ADDED']);
            $scope.$on('$destroy', listeners['STOP_CHECKIN_PROCESS']);
        }
    ]
);

// DONE: Handle payment method update from the check-in screen; the $scope.checkInState will have to be re-computed
// DONE: Enable complete check-in button only after the signature; terms and conditions are checked (take note of the settings)
// DONE: Handle EMV polling
