var admin = angular.module('admin',['ui.router', 'ng-iscroll']);

admin.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
	
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
	
}]);

admin.controller('rootController', ['$rootScope','$scope','$attrs','$location', function($rootScope,$scope,$attrs, $location) {

	//store basic details as rootscope variables

	$rootScope.admin_role = $attrs.adminRole;

}]);
