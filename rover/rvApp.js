var sntRover = angular.module('sntRover',['highcharts-ng','ui.router', 'ui.utils','pickadate', 'ng-iscroll', 'ngAnimate','ngDialog', 'ngSanitize']);
sntRover.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
	//BaseCtrl.call(this, $scope);
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
	// $scope.$on("showLoader", function(){
        // $scope.hasLoader = true;
    // });
// 
    // $scope.$on("hideLoader", function(){
        // $scope.hasLoader = false;
    // });    

	
}]);
