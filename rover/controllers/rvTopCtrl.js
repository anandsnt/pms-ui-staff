sntRover.controller('topController', ['$state', '$scope', function($state, $scope) {
        if (localStorage['isKiosk'] === true){
            alert('kiosk user');
            $state.go('kiosk');
        } else {
            $state.go('rover.dashboard');
        }
}]);