sntRover.controller('topController', ['$state', '$scope', function($state, $scope) {
        if (localStorage.isKiosk == 'true'){
            $state.go('station');
        } else {
            $state.go('rover.dashboard');
        }
}]);