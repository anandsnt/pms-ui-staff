sntRover.controller('topController', ['$state', '$scope', function($state, $scope) {
        if (localStorage['isKiosk']){
            $state.go('kiosk');
        } else {
            $state.go('rover.dashboard');
        }
}]);