sntZestStation.controller('zsCheckInAddRemoveGuestCtrl', [
    '$scope',
    '$state',
    'zsEventConstants',
    'zsCheckinSrv',
    function($scope, $state, zsEventConstants, zsCheckinSrv) {

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
            $state.go('zest_station.checkInReservationDetails');
        });

        $scope.navToPrev = function() {
            $scope.$emit(zsEventConstants.CLICKED_ON_BACK_BUTTON);
        };
        var getSelectedReservations = function() {
            $scope.selectedReservation = zsCheckinSrv.getSelectedCheckInReservation();
            //Deleting reservation details from zsCheckinSrv
            zsCheckinSrv.setSelectedCheckInReservation([]);
        };

        $scope.init = function() {
            $scope.addGuestsHeading = 'ADDTL_RESIDENTS';
            $scope.guest={};
            $scope.guest.firstNameEntered = false;
            getSelectedReservations();
        };
        $scope.addAGuest = function(){
            $scope.AddGuestMode = true;
            $scope.headingText = 'ENTER_FIRST';
        };
        $scope.NameEntered = function(){
            if($scope.guest.Name === ""){
                return;
            }
            else if(!$scope.guest.firstNameEntered){
                $scope.guest.firstNameEntered = true;
                $scope.guest.firstName =$scope.guest.Name;
                $scope.guest.Name ="";
                $scope.headingText = 'ENTER_LAST';
                $scope.callBlurEventForIpad();
            }else{
                $scope.guest.lastName =$scope.guest.Name;
                $scope.guest.Name ="";
                updateGuestDetails();
                $scope.AddGuestMode = false;
                //this needs to reset..the above code needs to be changed in future
                //seems confusing
                $scope.guest.firstNameEntered = false;
                $scope.callBlurEventForIpad();
            };
        };
        $scope.removeGuest = function(toDeleteId){
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
            var guestDetails = {'accompanying_guests_details':accompanyingGuestData, 'reservation_id':$scope.selectedReservation.id};

            var onSuccessResponse = function(response){
                $scope.selectedReservation.guest_details = _.without($scope.selectedReservation.guest_details, _.findWhere($scope.selectedReservation.guest_details, _.find($scope.selectedReservation.guest_details, function(guest) {
                     return guest.id === toDeleteId;
                })));
            };
            var onFailureResponse = function(response){
                //do nothing for now..i don't know what to be done in that case
            };
            $scope.callAPI(zsCheckinSrv.updateGuestTabDetails, {
                params: guestDetails,
                'successCallBack': onSuccessResponse,
                'failureCallBack': onFailureResponse
            });
        };
        var updateGuestDetails = function(){
          
            var accompanyingGuestData = angular.copy($scope.selectedReservation.guest_details);
            accompanyingGuestData = _.without($scope.selectedReservation.guest_details, _.findWhere($scope.selectedReservation.guest_details, _.find($scope.selectedReservation.guest_details, function(guest) {
                return guest.is_primary === true;
            })));
            accompanyingGuestData.push({
                last_name: $scope.guest.lastName,
                first_name: $scope.guest.firstName
            });
            var guestDetails = {'accompanying_guests_details':accompanyingGuestData, 'reservation_id':$scope.selectedReservation.id};
            var onSuccessResponse = function(response){
                  //push changes up to the reservation immediately
                $scope.selectedReservation.guest_details.push({
                    last_name: $scope.guest.lastName,
                    first_name: $scope.guest.firstName,
                    id:response[response.length-1]
                });
            };
            var onFailureResponse = function(response){
                //do nothing for now..i don't know what to be done in that case
            };
            $scope.callAPI(zsCheckinSrv.updateGuestTabDetails, {
                params: guestDetails,
                'successCallBack': onSuccessResponse,
                'failureCallBack': onFailureResponse
            });
        };

        $scope.goToNext = function(){
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