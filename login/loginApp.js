var login = angular.module('login',['ui.router', 'ng-iscroll']);

login.controller('loginRootCtrl', ['$scope', function($scope){
}]);

login.controller('loginCtrl',['$scope', 'loginSrv', '$window', '$state', function($scope, loginSrv, $window, $state){
	 $scope.data = {};

	 if(localStorage.email!=""){
	 	$scope.data.email = localStorage.email;
	 	document.getElementById("password").focus();
	 } else {
	 	document.getElementById("email").focus();
	 }
	 $scope.errorMessage = "";
	 $scope.successCallback = function(data){
	 	localStorage.email = $scope.data.email;
	 	if(data.token!=''){
	 		$state.go('resetpassword', {token: data.token});
	 	} else {
	 		 $window.location.href = data.redirect_url;
	 	}
	 };
	 $scope.failureCallBack = function(errorMessage){
	 	$scope.errorMessage = errorMessage;
	 };
	 $scope.submit = function() {
		loginSrv.login($scope.data, $scope.successCallback, $scope.failureCallBack);
	};
	

}]);

login.controller('resetCtrl',['$scope', 'resetSrv', '$window', '$state', '$stateParams', function($scope, resetSrv, $window, $state, $stateParams){
	 $scope.data = {};
	 $scope.data.token = $stateParams.token;
	 $scope.errorMessage = "";
	 $scope.successCallback = function(data){
	 	$window.location.href = data.redirect_url;
	 };
	 $scope.failureCallBack = function(errorMessage){
	 	$scope.errorMessage = errorMessage;
	 };
	 $scope.submit = function() {
		resetSrv.resetPassword($scope.data, $scope.successCallback, $scope.failureCallBack);
	};

}]);


