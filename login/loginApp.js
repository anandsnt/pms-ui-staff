var login = angular.module('login',['ui.router', 'ng-iscroll']);

login.controller('loginRootCtrl', ['$scope', function($scope){
}]);
/*
 * Login Controller - Handles login and local storage on succesfull login
 * Redirects to specific ur on succesfull login
 */
login.controller('loginCtrl',['$scope', 'loginSrv', '$window', '$state', function($scope, loginSrv, $window, $state){
	 $scope.data = {};

	 if(localStorage.email!=""){
	 	$scope.data.email = localStorage.email;
	 	document.getElementById("password").focus();
	 } else {
	 	document.getElementById("email").focus();
	 }
	 $scope.errorMessage = "";
	 /*
	  * successCallback of login action
	  * @param {object} status of login and data
	  */
	 $scope.successCallback = function(data){
	 	localStorage.email = $scope.data.email;
	 	if(data.token!=''){
	 		$state.go('resetpassword', {token: data.token});
	 	} else {
	 		 $window.location.href = data.redirect_url;
	 	}
	 };
	 /*
	  * Failure call back of login
	  */
	 $scope.failureCallBack = function(errorMessage){
	 	$scope.errorMessage = errorMessage;
	 };
	 /*
	  * Submit action of login
	  */
	 $scope.submit = function() {
		loginSrv.login($scope.data, $scope.successCallback, $scope.failureCallBack);
	};
	

}]);
/*
 * Reset Password Controller 
 */
login.controller('resetCtrl',['$scope', 'resetSrv', '$window', '$state', '$stateParams', function($scope, resetSrv, $window, $state, $stateParams){
	 $scope.data = {};
	 $scope.data.token = $stateParams.token;
	 $scope.errorMessage = "";
	 /*
	  * Redirect to specific url on success
	  * @param {object} status and redirect url
	  */
	 $scope.successCallback = function(data){
	 	$window.location.href = data.redirect_url;
	 };
	 $scope.failureCallBack = function(errorMessage){
	 	$scope.errorMessage = errorMessage;
	 };
	 /*
	  * Submit action reset password
	  */
	 $scope.submit = function() {
		resetSrv.resetPassword($scope.data, $scope.successCallback, $scope.failureCallBack);
	};

}]);
/*
 * Activate User Controller 
 */
login.controller('activateCtrl',['$scope', 'resetSrv', '$window', '$state', '$stateParams', function($scope, resetSrv, $window, $state, $stateParams){
	 $scope.data = {};
	 $scope.data.token = $stateParams.token;
	 $scope.data.user  = $stateParams.user;
	 $scope.errorMessage = "";
	 /*
	  * Redirect to specific url on success
	  * @param {object} status and redirect url
	  */
	 $scope.successCallback = function(data){
	 	$window.location.href = data.redirect_url;
	 };
	 $scope.failureCallBack = function(errorMessage){
	 	$scope.errorMessage = errorMessage;
	 };
	 /*
	  * Submit action reset password
	  */
	 $scope.submit = function() {
	 	console.log($scope.data);
		 resetSrv.activateUser($scope.data, $scope.successCallback, $scope.failureCallBack);
	};

}]);


