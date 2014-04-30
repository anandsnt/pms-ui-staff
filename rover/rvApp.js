var sntRover = angular.module('sntRover',['ui.router','ngAnimate']);

sntRover.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
	
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
	
}]);
