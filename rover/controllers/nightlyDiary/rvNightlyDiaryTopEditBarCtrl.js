angular.module('sntRover')
.controller('rvNightlyDiaryTopEditBarController',
    [   '$scope',
        function(
            $scope
        ) {

        BaseCtrl.call(this, $scope);

        // $scope.$on('EDIT_MODE_ACTIVATED', function(e, data) {
        //    $scope.currentSelectedReservation = data.reservation;
        //    console.log($scope.currentSelectedReservation)
        // });

        $scope.cancelEditReservation = function(){
            $scope.$emit('CANCEL_RESERVATION');
        };






}]);
