angular.module('sntRover').controller('RVReservationCheckInFlowCtrl',
    ['$scope', '$rootScope', 'RVHotelDetailsSrv', '$log', 'RVCCAuthorizationSrv', 'ngDialog', '$timeout', 'RVBillCardSrv',
        '$state',
        function ($scope, $rootScope, RVHotelDetailsSrv, $log, RVCCAuthorizationSrv, ngDialog, $timeout, RVBillCardSrv,
                  $state) {

            var fetchAuthInfo = function () {
                $scope.callAPI(RVCCAuthorizationSrv.fetchPendingAuthorizations, {
                    loader: false,
                    params: $scope.reservationBillData.reservation_id,
                    successCallBack: function (response) {
                        var billRoutingInfo = $scope.reservationBillData.routing_info,
                            canPayIncidentalsOnly = response.is_cc_authorize_for_incidentals_active &&
                                (billRoutingInfo.incoming_from_room || billRoutingInfo.out_going_to_comp_tra);


                        $scope.authorizationInfo = response;
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
                    scope: $scope
                });
            };

            // STEP B PROMPT FOR SWIPE
            var promptForSwipe = function () {
                // prompting for swipe can be disabled from admin > reservations > reservation settings
                if (!$scope.reservationBillData.is_disabled_cc_swipe) {
                    ngDialog.open({
                        template: '/assets/partials/payment/rvPleaseSwipeModal.html',
                        className: '',
                        scope: $scope
                    });
                } else if ($scope.checkInState.hasCardOnFile) {
                    authorizeCardOnFile();
                } else {
                    $log.info('prompt for swipe disabled in settings AND cannot authorize WITHOUT card on file');
                }
            };

            var authorizeCardOnFile = function () {
                // TODO: Implement this methods
                $log.info('authorizeCardOnFile');
            };

            var completeCheckin = function () {
                var signature = $scope.getSignature(),
                    params = {
                        is_promotions_and_email_set: $scope.saveData.promotions,
                        reservation_id: $scope.reservationBillData.reservation_id,
                        no_post: $scope.reservationBillData.roomChargeEnabled === '' ? false : !$scope.reservationBillData.roomChargeEnabled
                    };

                return false;

                if (signature !== 'isSigned' && signature !== '[]') {
                    params.signature = signature;
                }

                // TODO: In case of a card swipe; add swipe related data here

                $scope.callAPI(RVBillCardSrv.completeCheckin, {
                    params: params,
                    successCallBack: $scope.completeCheckinSuccessCallback,
                    failureCallBack: $scope.completeCheckinFailureCallback
                });
            };

            // ------------------------------------------------------------------------------------ state
            $scope.checkInState = {
                hasActiveEMV: RVHotelDetailsSrv.isActiveMLIEMV(),
                hasSuccessfulAuthorization: false,
                hasCardOnFile: $scope.billHasCreditCard(),
                isAuthInfoFetchComplete: false,
                isAuthorizationInProgress: false,
                requireSignature: $scope.signatureNeeded(),
                requireTerms: $scope.termsConditionsNeeded()
            };

            // ------------------------------------------------------------------------------------ onUserAction
            $scope.onClickEMV = function () {
                $log.info('onClickEMV');
            };

            $scope.onClickUseCardOnFile = function () {
                $log.info('onClickUseCardOnFile');
            };

            $scope.onClickNoSwipe = function () {
                ngDialog.close();
                completeCheckin();
            };

            $scope.onClickIncidentalsOnly = function () {
                $log.info('onClickIncidentalsOnly');
            };

            $scope.onClickFullAuth = function () {
                $log.info('onClickFullAuth');
            };

            $scope.onClickManualAuth = function () {
                $log.info('onClickManualAuth');
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
                    // Do nothing , Keep going checkin process , it is a sharer reservation..
                }
                else if (($scope.reservationBillData.room_status === 'NOTREADY' ||
                        $scope.reservationBillData.fo_status === 'OCCUPIED') && !$rootScope.queuedCheckIn) {
                    // Go to room assignemt view
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
                    if ($scope.authorizationInfo.is_cc_authorize_at_checkin_enabled) {
                        if ($scope.authorizationInfo.routingToRoom ||
                            $scope.authorizationInfo.routingFromRoom ||
                            $scope.authorizationInfo.routingToAccount) {
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

            // ------------------------------------------------------------------------------------ Init
            (function () {
                $scope.authorizationInfo = null;
                // Do an async fetch of the auth info... needn't show blocker
                fetchAuthInfo();
            })();
        }
    ]
)
;


// DONE: Handle payment method update from the check-in screen; the $scope.checkInState will have to be re-computed
// TODO: Enable complete check-in button only after the signature; terms and conditions are checked (take note of the settings)
