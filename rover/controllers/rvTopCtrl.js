sntRover.controller('topController', ['$state', '$scope', function($state, $scope) {

	$scope.$on('$stateChangeSuccess', function (event, toState, dwad, fromState, dwads) {
	  fromState.name = fromState.name ? fromState.name : 'Null'
	  console.log( 'From: "' + fromState.name + '" state \nTo: "' + toState.name + '" state' );
	});

	$state.go('rover.dashboard');
}]);