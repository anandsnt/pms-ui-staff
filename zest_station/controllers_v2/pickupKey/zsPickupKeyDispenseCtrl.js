sntZestStation.controller('zsPickupKeyDispenseCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    'zsEventConstants',
    '$controller',
    'zsCheckinSrv',
    'zsGeneralSrv',
    '$log',
    function($scope, $stateParams, $state, zsEventConstants, $controller, zsCheckinSrv, zsGeneralSrv, $log) {

        /** ********************************************************************************************
         **     Expected state params -----> reservation_id, room_no and first_name'              
         **     Exit function -> clickedOnCloseButton- root ctrl function                       
         **                                                                      
         ***********************************************************************************************/

        /**
         *    MODES inside the page
         *    
         * 1. DISPENSE_KEY_MODE -> select No of keys
         * 2. DISPENSE_KEY_FAILURE_MODE -> failure mode
         * 3. SOLO_KEY_CREATION_IN_PROGRESS_MODE -> one key selected case
         * 4. KEY_ONE_CREATION_IN_PROGRESS_MODE -> 2 key selected, 1st in progress
         * 5. KEY_ONE_CREATION_SUCCESS_MODE -> 2 key selected, 1st completed
         * 6. KEY_CREATION_SUCCESS_MODE -> all requested keys were created
         */

        /**
         * [initializeMe description]
         */

        var fetchReservationDetails = function(getGuestMandatoryFields) {
            var onSuccess = function(response) {
                zsCheckinSrv.setSelectedCheckInReservation(response.results); // important
                $state.go('zest_station.zsCheckinSaveGuestInfo', {
                    guestInfo: angular.toJson(getGuestMandatoryFields),
                    reservation_id: $stateParams.reservation_id,
                    flowType: 'PICKUP_KEY',
                    prevStateParams:JSON.stringify($stateParams)
                });
            };
            var options = {
                params: {
                    'reservation_id': $stateParams.reservation_id
                },
                successCallBack: onSuccess
            };

            $scope.callAPI(zsGeneralSrv.fetchCheckinReservationDetails, options);
        };

        var checkIfAnyGuestDetailsAreMissing = function() {
            var retrievGuestInfoCallback = function(data) {

                if (!data.metadata.required_for_all_adults) {
                    data.guests = _.filter(data.guests, function(guest) {
                        return guest.primary;
                    });
                } else {
                    // Filter out only Adult guest
                    data.guests = _.filter(data.guests, function(guest) {
                        return guest.guest_type === 'ADULT';
                    });
                }

                // utils function
                _.each(data.guests, function(guest) {
                    var mandatoryFields = _.filter(guest.guest_details, function(field) {
                        return field.mandatory;
                    });
                    var missingInfoForGuest = _.filter(mandatoryFields, function(field) {
                        return !field.current_value;
                    });

                    var missingVehicleRegNumbers = _.filter(guest.guest_details, function(field) {
                        return field.field_category === 'parking';
                    });

                    guest.is_missing_any_required_field = guest.info_bypassed ? false : missingInfoForGuest.length > 0 || missingVehicleRegNumbers.length > 0;
                });

                var guestsWithMissingInfo = _.filter(data.guests, function(guest) {
                    return guest.is_missing_any_required_field;
                });

                if (guestsWithMissingInfo.length > 0) {
                    fetchReservationDetails(data);
                } else {
                    $scope.zestStationData.skipGuestMandatorySchemaCheck = true;
                    initializeMe();
                }
            };
            var options = {
                params: {
                    guest_detail_id: $stateParams.guest_id,
                    reservation_id: $stateParams.reservation_id
                },
                successCallBack: retrievGuestInfoCallback
            };

            $scope.callAPI(zsCheckinSrv.getGuestMandatoryFields, options);
        };

        var initializeMe = function() {
            // All the common actions for dispensing keys are to be included in
            // zsKeyDispenseCtrl

            $controller('zsKeyDispenseCtrl', {
                $scope: $scope
            });
            if (!$scope.zestStationData.skipGuestMandatorySchemaCheck) {
                checkIfAnyGuestDetailsAreMissing();
            }
            else if ($stateParams.isQuickJump === 'true') {

                $log.log('Jumping to Screen with demo data');
                $scope.mode = $stateParams.quickJumpMode;

            } else {
                $scope.mode = 'DISPENSE_KEY_MODE';
                $scope.readyForUserToPressMakeKey = true;

            }
        };

        $scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
            if ($scope.zestStationData.pickup_qr_scan) {
                $state.go('zest_station.qrPickupKey');
            } else {
                $state.go('zest_station.checkOutReservationSearch', {
                    'mode': 'PICKUP_KEY'
                });
            }
        });

        // handling style in ctrl, so as not to mess up style sheet
        // this is a small style addition
        var marginTop = $scope.zestStationData.show_room_number ? '40px' : '0px';

        $scope.doneButtonStyle = {
            'margin-top': marginTop
        };


        $scope.onKeyFailureGoToPrintPage = function() {
            var stateParams = {
                'reservation_id': $stateParams.reservation_id,
                'key_created': 'false'
            };

            $state.go('zest_station.pickUpKeyDispenseRegistrationCardPrint', stateParams);
        };

        $scope.pickupKeyNextPageAction = function() {
            if ($scope.zestStationData.pickup_key_reg_print === 'auto_print') {
                var stateParams = {
                    'reservation_id': $stateParams.reservation_id,
                    'key_created': 'true'
                };

                $state.go('zest_station.pickUpKeyDispenseRegistrationCardPrint', stateParams);
            } else {
                $scope.trackSessionActivity('PUK', 'Flow-End-Success', 'R' + $stateParams.reservation_id, '', true);
                $scope.trackEvent('PUK', 'Flow-End-Success');
                $state.go('zest_station.home');
            }
        };

        initializeMe();

    }
]);