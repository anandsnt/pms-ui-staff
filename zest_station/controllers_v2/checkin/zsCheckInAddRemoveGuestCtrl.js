sntZestStation.controller('zsCheckInAddRemoveGuestCtrl', [
    '$scope',
    '$state',
    'zsEventConstants',
    'zsCheckinSrv',
    '$stateParams',
    '$timeout',
    function($scope, $state, zsEventConstants, zsCheckinSrv, $stateParams, $timeout) {

        /** ********************************************************************************************
         **      Expected state params -----> none           
         **      Exit function -> $scope.goToNext                              
         **                                                                       
         ***********************************************************************************************/

        BaseCtrl.call(this, $scope);
        var refreshScroller = function() {
            $scope.refreshScroller('guests-list');
        };

        /**
         * when the back button clicked
         * @param  {[type]} event
         * @return {[type]}
         */
        $scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
            zsCheckinSrv.setSelectedCheckInReservation([$scope.selectedReservation]);
            var stateParams = {};
            // check if this page was invoked through pickupkey flow

            if ($stateParams.pickup_key_mode) {
                stateParams.pickup_key_mode = 'manual';
            }
            $state.go('zest_station.checkInReservationDetails', stateParams);
        });

        $scope.navToPrev = function() {
            $scope.$emit(zsEventConstants.CLICKED_ON_BACK_BUTTON);
        };
        var getSelectedReservations = function() {
            $scope.selectedReservation = zsCheckinSrv.getSelectedCheckInReservation();
            // Deleting reservation details from zsCheckinSrv
            zsCheckinSrv.setSelectedCheckInReservation([]);
        };

        $scope.init = function() {
            $scope.guest = {};
            $scope.guest.firstNameEntered = false;
            getSelectedReservations();

            $scope.setScroller('guests-list', {
                disablePointer: true, // important to disable the pointer events that causes the issues
                disableTouch: false, // false if you want the slider to be usable with touch devices
                disableMouse: false // false if you want the slider to be usable with a mouse (desktop)
            });
        };
        $scope.addAGuest = function() {
            $scope.AddGuestMode = true;
            $scope.mode = 'ENTER_FIRST';

            // $scope.headingText = 'ENTER_FIRST';

            $scope.focusInputField('add-guest-name');
        };
        $scope.NameEntered = function() {
            document.getElementById('add-guest-name').blur();

            if ($scope.guest.Name === '') {
                return;
            } else if (!$scope.guest.firstNameEntered) {
                $scope.guest.firstNameEntered = true;
                $scope.guest.firstName = $scope.guest.Name;
                $scope.guest.Name = '';
                
                $scope.mode = 'ENTER_LAST';
                // $scope.headingText = 'ENTER_LAST';

                if ($scope.isIpad) {
                    $scope.callBlurEventForIpad();
                }
                
                $timeout(function() {
                    $scope.focusInputField('add-guest-name');
                }, 300);
            } else {
                $scope.guest.lastName = $scope.guest.Name;
                $scope.guest.Name = '';
                updateGuestDetails();
                $scope.AddGuestMode = false;
                // this needs to reset..the above code needs to be changed in future
                // seems confusing
                $scope.guest.firstNameEntered = false;
                if ($scope.isIpad) {
                    $scope.callBlurEventForIpad();
                }
                $timeout(function() {
                    $scope.focusInputField('add-guest-name');
                }, 300);
            }
        };
        $scope.removeGuest = function(toDeleteId) {
            // for API
            var accompanyingGuestData = angular.copy($scope.selectedReservation.guest_details);

            accompanyingGuestData = _.without($scope.selectedReservation.guest_details, _.findWhere($scope.selectedReservation.guest_details, _.find($scope.selectedReservation.guest_details, function(guest) {
                return guest.is_primary === true;
            })));

            // accompanyingGuestData[index].last_name = null;
            // accompanyingGuestData[index].first_name = null;
            var guestDetails = {
                'accompanying_guests_details': accompanyingGuestData,
                'reservation_id': $scope.selectedReservation.id
            };

            var onSuccessResponse = function(response) {
                $scope.selectedReservation.guest_details = _.without($scope.selectedReservation.guest_details, _.findWhere($scope.selectedReservation.guest_details, _.find($scope.selectedReservation.guest_details, function(guest) {
                    return guest.id === toDeleteId;
                })));
                refreshScroller();
            };
            var onFailureResponse = function(response) {
                // do nothing for now..i don't know what to be done in that case
                // TODO: if this means the API failed, then user needs to be directed to the general Error screen
            };

            $scope.callAPI(zsCheckinSrv.updateGuestTabDetails, {
                params: guestDetails,
                'successCallBack': onSuccessResponse,
                'failureCallBack': onFailureResponse
            });
        };
        var updateGuestDetails = function() {

            if ($scope.inDemoMode()) {
                $scope.selectedReservation = {'guest_details': []};
                $scope.selectedReservation.guest_details.push({
                    last_name: $scope.guest.lastName,
                    first_name: $scope.guest.firstName,
                    id: $scope.selectedReservation.guest_details.length
                });
            } else {

                var accompanyingGuestData = angular.copy($scope.selectedReservation.guest_details);

                accompanyingGuestData = _.without($scope.selectedReservation.guest_details, _.findWhere($scope.selectedReservation.guest_details, _.find($scope.selectedReservation.guest_details, function(guest) {
                    return guest.is_primary === true;
                })));
                accompanyingGuestData.push({
                    last_name: $scope.guest.lastName,
                    first_name: $scope.guest.firstName
                });
                var guestDetails = {
                    'accompanying_guests_details': accompanyingGuestData,
                    'reservation_id': $scope.selectedReservation.id,
                    'is_added_from_kiosk': true
                };
                var onSuccessResponse = function(response) {
                    // push changes up to the reservation immediately
                    $scope.selectedReservation.guest_details.push({
                        last_name: $scope.guest.lastName,
                        first_name: $scope.guest.firstName,
                        id: response[response.length - 1]
                    });
                    refreshScroller();
                };
                var onFailureResponse = function(response) {
                    // do nothing for now..i don't know what to be done in that case
                };

                $scope.callAPI(zsCheckinSrv.updateGuestTabDetails, {
                    params: guestDetails,
                    'successCallBack': onSuccessResponse,
                    'failureCallBack': onFailureResponse
                });

            }
        };

        $scope.goToNext = function() {
            zsCheckinSrv.setSelectedCheckInReservation([$scope.selectedReservation]);
            $state.go('zest_station.checkInReservationDetails');
        };

        /**
         * [initializeMe description]
         * @return {[type]} [description]
         */
        var initializeMe = (function() {
            // show back button
            $scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
            // show close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
            $scope.AddGuestMode = false;
            $scope.init();
        }());


    }
]);