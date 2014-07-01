
var sntRover = angular.module('sntRover',['ui.router', 'ui.utils','pickadate', 'ng-iscroll', 'highcharts-ng', 'ngAnimate','ngDialog', 'ngSanitize', 'pascalprecht.translate','advanced-pickadate','ui.date', 'dashboardModule', 'companyCardModule', 'stayCardModule', 'reservationModule', 'rvNgAnimations']);

sntRover.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
	//BaseCtrl.call(this, $scope);
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
	
}]);

