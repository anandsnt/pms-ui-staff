angular.module('sntRover').controller('RVReservationCheckInFlowCtrl',
    ['$scope', '$rootScope', 'RVHotelDetailsSrv', '$log', 'RVCCAuthorizationSrv', 'ngDialog',
        function ($scope, $rootScope, RVHotelDetailsSrv, $log, RVCCAuthorizationSrv, ngDialog) {

            var promptAuthorizationUserAction = function (opts) {
                ngDialog.open({
                    template: '/assets/partials/authorization/rvCheckInAuthUserActionPopup.html',
                    className: '',
                    closeByDocument: false,
                    scope: $scope,
                    data: angular.toJson(opts)
                });
            };

            var beginCheckInWithAuthorizationFlow = function () {
                $scope.callAPI(RVCCAuthorizationSrv.fetchPendingAuthorizations, {
                    params: $scope.reservationBillData.reservation_id,
                    successCallBack: function (response) {
                        var billRoutingInfo = $scope.reservationBillData.routing_info,
                            canPayIncidentalsOnly = response.is_cc_authorize_for_incidentals_active &&
                                (billRoutingInfo.incoming_from_room || billRoutingInfo.out_going_to_comp_tra);

                        $scope.authorizationInfo = response;

                        angular.extend($scope.authorizationInfo, {
                            canPayIncidentalyOnly: true
                        });

                        $log.info('$scope.authorizationInfo', $scope.authorizationInfo);

                        promptForAuthorizationWithAmount();
                    },
                    failureCallBack: function () {
                        // TODO: Handle failure
                    }
                });
            };

            /**
             * Step 2a
             * IF CARD_ON_FILE
             *  Ask user if they would like to authorize a new card for the pending amount
             * ELSE
             *  Ask user if they would like to authorize for the pending amount
             * @return {undefined}
             */
            var promptForAuthorizationWithAmount = function () {
                promptAuthorizationUserAction({
                    hasSavedCC: $scope.billHasCreditCard()
                });
            };


            (function () {
                $scope.authorizationInfo = null;

                if (!RVHotelDetailsSrv.isActiveMLIEMV()) {
                    $scope.$emit('INIT_CHECKIN_FLOW');
                } else {
                    $log.info('go through emv authorization flow!');
                    // Step 1
                    // TODO: Ignore observeForSwipe responses

                    // Step 2
                    beginCheckInWithAuthorizationFlow();


                }
            })();
        }]
);
