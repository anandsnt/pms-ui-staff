angular.module('sntRover')
.controller('rvNightlyDiaryTopEditBarController',
    [   '$scope',
        '$state',
        function(
            $scope, $state
        ) {

        BaseCtrl.call(this, $scope);

        // $scope.$on('EDIT_MODE_ACTIVATED', function(e, data) {
        //    $scope.currentSelectedReservation = data.reservation;
        //    console.log($scope.currentSelectedReservation)
        // });

        $scope.cancelEditReservation = function(){
            $scope.$emit('CANCEL_RESERVATION');
        };

        $scope.goToStayCard = function(currentSelectedReservation){
            $state.go("rover.reservation.staycard.reservationcard.reservationdetails", {
                id: currentSelectedReservation.id,
                confirmationId: currentSelectedReservation.confirm_no,
                isrefresh: true
            });

        };






}]);
