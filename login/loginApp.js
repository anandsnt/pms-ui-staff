var login = angular.module('login',['ui.router', 'ng-iscroll']);

login.controller('loginRootCtrl', ['$scope', function($scope){
	$scope.hasLoader = false;
}]);
/*
 * Login Controller - Handles login and local storage on succesfull login
 * Redirects to specific ur on succesfull login
 */
login.controller('loginCtrl',['$scope', 'loginSrv', '$window', '$state', 'resetSrv', function($scope, loginSrv, $window, $state, resetSrv){
	 $scope.data = {};

	 if(localStorage.email!=""){
	 	$scope.data.email = localStorage.email;
	 	document.getElementById("password").focus();
	 } else {
	 	document.getElementById("email").focus();
	 }
	 $scope.errorMessage = "";
	 $scope.errorMessage = resetSrv.getErrorMessage();
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
	 	$scope.hasLoader = false;
	 	$scope.errorMessage = errorMessage;
	 };
	 /*
	  * Submit action of login
	  */
	 $scope.submit = function() {
	 	$scope.hasLoader = true;
 		loginSrv.login($scope.data, $scope.successCallback, $scope.failureCallBack);
	};
	

}]);
/*
 * Reset Password Controller - First time login of snt admin
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
	 	$scope.hasLoader = false;
	 	$window.location.href = data.redirect_url;
	 };
	 $scope.failureCallBack = function(errorMessage){
	 	$scope.hasLoader = false;
	 	$scope.errorMessage = errorMessage;
	 };
	 /*
	  * Submit action reset password
	  */
	 $scope.submit = function() {
	 	$scope.hasLoader = true;
		resetSrv.resetPassword($scope.data, $scope.successCallback, $scope.failureCallBack);
	};

}]);
/*
 * Activate User Controller - Activate user when clicks on activation link in mail
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
	 $scope.failureCallBackToken = function(errorMessage){
	 	resetSrv.setErrorMessage(errorMessage);
	    $state.go('login');
	 };
	 /*
	  * Redirect to specific url on success
	  * @param {object} status and redirect url
	  */
	 $scope.successCallback = function(data){
	 	$scope.hasLoader = false;
	 	$window.location.href = data.redirect_url;
	 };
	/*
	 * Failur callback
	 */
	 $scope.failureCallBack = function(errorMessage){
	 	$scope.hasLoader = false;
	 	$scope.errorMessage = errorMessage;
	 };
	 resetSrv.checkTokenStatus($scope.data, "", $scope.failureCallBackToken);
	 /*
	  * Submit action activate user
	  */
	 $scope.submit = function() {
	 	 $scope.hasLoader = true;
		 resetSrv.activateUser($scope.data, $scope.successCallback, $scope.failureCallBack);
	};

}]);


