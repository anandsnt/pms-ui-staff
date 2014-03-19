var admin = angular.module('admin',['ui.router']);

admin.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
	
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
	console.log('new state');
	console.log(JSON.stringify($rootScope.$state));
	
}]);
