

var sntRover = angular.module('sntRover',['ui.router', 'ui.utils','pickadate', 'ng-iscroll', 'highcharts-ng', 'ngAnimate','ngDialog', 'ngSanitize', 'pascalprecht.translate','advanced-pickadate','ui.date','ui.calendar', 'dashboardModule', 'companyCardModule', 'stayCardModule', 'housekeepingModule']);

sntRover.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
	//BaseCtrl.call(this, $scope);
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
	
}]);

