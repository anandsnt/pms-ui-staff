var sntRover = angular.module('sntRover',['ui.router', 'ng-iscroll']);

sntRover.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
	
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
	
}]);
