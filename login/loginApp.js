var login = angular.module('login',['ui.router', 'ng-iscroll']);

login.controller('loginRootCtrl', ['$scope', function($scope){
	console.log("lllmmmmmmmmmmmm");
}]);

login.controller('loginCtrl',['$scope', 'loginSrv', function($scope, loginSrv){
	 $scope.data = {};
	 $scope.errorMessage = [];
	 $scope.successCallback = function(data){
	 	console.log(">>>>>>>>>>>>>>>>>>>>>>>");
	 	console.log(data);
	 };
	 $scope.failureCallBack = function(data){
	 	console.log(">>>>>>>>>>>>>>>>>>>>>>>");
	 	$scope.errorMessage = data.errors;
	 	console.log(data);
	 };
	 $scope.submit = function() {
		loginSrv.addItem($scope.data, $scope.successCallback, $scope.failureCallBack);
	};

}]);
