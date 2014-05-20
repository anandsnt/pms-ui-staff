var sntRover = angular.module('sntRover',['ui.router', 'ui.utils','pickadate', 'ng-iscroll', 'ngAnimate','ngDialog', 'ngSanitize', 'pascalprecht.translate']);
sntRover.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
	//BaseCtrl.call(this, $scope);
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
	
}]);

