var login = angular.module('login',['ui.router', 'ng-iscroll']);

login.controller('loginRootCtrl', ['$scope', function($scope){
	console.log("lllmmmmmmmmmmmm");
}]);

login.controller('loginCtrl',['$scope', 'loginSrv', function($scope, loginSrv){
	 $scope.data = {};
	 $scope.submit = function() {
		loginSrv.addItem($scope.data);
	};

}]);
