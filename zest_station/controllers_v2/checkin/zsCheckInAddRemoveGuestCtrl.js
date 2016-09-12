sntZestStation.controller('zsCheckInAddRemoveGuestCtrl', [
    '$scope',
    '$state',
    'zsEventConstants',
    'zsCheckinSrv',
    '$stateParams',
    '$timeout',
    function($scope, $state, zsEventConstants, zsCheckinSrv, $stateParams, $timeout) {

        /**********************************************************************************************
         **      Expected state params -----> none           
         **      Exit function -> $scope.goToNext                              
         **                                                                       
         ***********************************************************************************************/

        BaseCtrl.call(this, $scope);
        /**
         * when the back button clicked
         * @param  {[type]} event
         * @return {[type]}
         */
        $scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
            zsCheckinSrv.setSelectedCheckInReservation([$scope.selectedReservation]);
            var stateParams = {};
            //check if this page was invoked through pickupkey flow
            if (!!$stateParams.pickup_key_mode) {
                stateParams.pickup_key_mode = 'manual';
            }
            $state.go('zest_station.checkInReservationDetails', stateParams);
        });

        $scope.navToPrev = function() {
            $scope.$emit(zsEventConstants.CLICKED_ON_BACK_BUTTON);
        };
        var getSelectedReservations = function() {
            $scope.selectedReservation = zsCheckinSrv.getSelectedCheckInReservation();
            //Deleting reservation details from zsCheckinSrv
            zsCheckinSrv.setSelectedCheckInReservation([]);
        };

        var focusInputField = function(elementId) {
            $timeout(function() {
                if ($scope.isIpad){
                    $scope.callBlurEventForIpad();
                }
                document.getElementById(elementId).focus();
                document.getElementById(elementId).click();
            }, 300);

        };
        $scope.init = function() {
            $scope.addGuestsHeading = 'ADDTL_RESIDENTS';
            $scope.guest = {};
            $scope.guest.firstNameEntered = false;
            getSelectedReservations();
        };
        $scope.addAGuest = function() {
            $scope.AddGuestMode = true;
            $scope.headingText = 'ENTER_FIRST';
            focusInputField('add-guest-name');
        };
        $scope.NameEntered = function() {
            document.getElementById('add-guest-name').blur();

            if ($scope.guest.Name === "") {
                return;
            } else if (!$scope.guest.firstNameEntered) {
                $scope.guest.firstNameEntered = true;
                $scope.guest.firstName = $scope.guest.Name;
                $scope.guest.Name = "";
                $scope.headingText = 'ENTER_LAST';
                if ($scope.isIpad){
                    $scope.callBlurEventForIpad();
                } else {
                    $timeout(function(){
                        focusInputField('add-guest-name');
                    },300);
                }
            } else {
                $scope.guest.lastName = $scope.guest.Name;
                $scope.guest.Name = "";
                updateGuestDetails();
                $scope.AddGuestMode = false;
                //this needs to reset..the above code needs to be changed in future
                //seems confusing
                $scope.guest.firstNameEntered = false;
                if ($scope.isIpad){
                    $scope.callBlurEventForIpad();
                } else {
                    $timeout(function(){
                        focusInputField('add-guest-name');
                    },300);

                }
            };
        };
        $scope.removeGuest = function(toDeleteId) {
            //for API
            var accompanyingGuestData = angular.copy($scope.selectedReservation.guest_details);
            accompanyingGuestData = _.without($scope.selectedReservation.guest_details, _.findWhere($scope.selectedReservation.guest_details, _.find($scope.selectedReservation.guest_details, function(guest) {
                return guest.is_primary === true;
            })));

            var toDeleteItem = _.find(accompanyingGuestData, function(guest) {
                return guest.id === toDeleteId;
            });
            toDeleteItem.last_name = null;
            toDeleteItem.first_name = null;

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
            };
            var onFailureResponse = function(response) {
                //do nothing for now..i don't know what to be done in that case
            };
            $scope.callAPI(zsCheckinSrv.updateGuestTabDetails, {
                params: guestDetails,
                'successCallBack': onSuccessResponse,
                'failureCallBack': onFailureResponse
            });
        };
        var updateGuestDetails = function() {

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
                'reservation_id': $scope.selectedReservation.id
            };
            var onSuccessResponse = function(response) {
                //push changes up to the reservation immediately
                $scope.selectedReservation.guest_details.push({
                    last_name: $scope.guest.lastName,
                    first_name: $scope.guest.firstName,
                    id: response[response.length - 1]
                });
            };
            var onFailureResponse = function(response) {
                //do nothing for now..i don't know what to be done in that case
            };
            $scope.callAPI(zsCheckinSrv.updateGuestTabDetails, {
                params: guestDetails,
                'successCallBack': onSuccessResponse,
                'failureCallBack': onFailureResponse
            });
        };

        $scope.goToNext = function() {
            zsCheckinSrv.setSelectedCheckInReservation([$scope.selectedReservation]);
            $state.go('zest_station.checkInReservationDetails');
        };

        /**
         * [initializeMe description]
         * @return {[type]} [description]
         */
        var initializeMe = function() {
            //show back button
            $scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
            //show close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
            $scope.AddGuestMode = false;
            $scope.init();
        }();


    }
]);