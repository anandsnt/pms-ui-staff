sntZestStation.controller('zsCheckInAddRemoveGuestCtrl', [
    '$scope',
    '$state',
    'zsEventConstants',
    'zsCheckinSrv',
    function($scope, $state, zsEventConstants, zsCheckinSrv) {

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
            if(!$scope.guest.firstNameEntered){
                $scope.guest.firstNameEntered = true;
                $scope.guest.firstName =$scope.guest.Name;
                $scope.guest.Name ="";
                $scope.headingText = 'ENTER_LAST';
            }else{
                $scope.guest.lastName =$scope.guest.Name;
                $scope.guest.Name ="";
                updateGuestDetails();
                $scope.AddGuestMode = false;
            };
        };
        $scope.removeGuest = function(index){
            $scope.selectedReservation.guest_details.splice(index, 1);
        };
        var updateGuestDetails = function(){
            $scope.selectedReservation.guest_details.push({
                last_name: $scope.guest.lastName,
                first_name: $scope.guest.firstName
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