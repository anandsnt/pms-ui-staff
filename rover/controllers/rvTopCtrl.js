sntRover.controller('topController', ['$state', '$scope', function($state, $scope) {
        if (localStorage['isKiosk'] == 'true'){
            $state.go('kiosk');
        } else {
            $state.go('rover.dashboard');
        }
}]);