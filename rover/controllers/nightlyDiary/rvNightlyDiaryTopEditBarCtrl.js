angular.module('sntRover')
.controller('rvNightlyDiaryTopEditBarController',
    [   '$scope',
        '$state',
        'RVNightlyDiarySrv',
        function(
            $scope, $state, RVNightlyDiarySrv
        ) {

            BaseCtrl.call(this, $scope);

            $scope.cancelEditReservation = function() {
                $scope.$emit('CANCEL_RESERVATION_EDITING');
            };

            $scope.goToStayCard = function(currentSelectedReservation, currentSelectedRoom) {

                var params = RVNightlyDiarySrv.getCache();

                params.currentSelectedReservation = currentSelectedReservation;
                params.currentSelectedRoom = currentSelectedRoom;
                RVNightlyDiarySrv.updateCache(params);
                $state.go("rover.reservation.staycard.reservationcard.reservationdetails", {
                    id: currentSelectedReservation.id,
                    confirmationId: currentSelectedReservation.confirm_no,
                    isrefresh: true
                });
            };
}]);