var login = angular.module('login',['ui.router', 'ng-iscroll', 'documentTouchMovePrevent']);

/*
 * Set page Titles
 */
login.run(function($rootScope){

	$rootScope.$on('$stateChangeStart', 
		function(event, toState, toParams, fromState, fromParams){ 
		$rootScope.title =toState.title;
	});
});


login.controller('loginRootCtrl', ['$scope', function($scope){
	$scope.hasLoader = false;
	$scope.signingIn = false;
	$scope.$on("signingIn", function(event){
		$scope.signingIn = true;
	});
}]);

/*
 * Login Controller - Handles login and local storage on succesfull login
 * Redirects to specific ur on succesfull login
 */
login.controller('loginCtrl',['$scope', 'loginSrv', '$window', '$state', 'resetSrv', function($scope, loginSrv, $window, $state, resetSrv){
	 $scope.data = {};
	 
	 if(localStorage.email && localStorage.email!=""){
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

	 	//Clear all session storage contents. We are starting a new session.
	 	var i = sessionStorage.length;
	 	while(i--) {
	 	  	var key = sessionStorage.key(i);
	 	  	sessionStorage.removeItem(key);
	 	}

	 	localStorage.email = $scope.data.email;
	 	if(data.token!=''){
	 		$state.go('resetpassword', {token: data.token, notifications: data.notifications});
	 	} else {
	 		 $scope.$emit("signingIn");
	 		 
	 		 $scope.hasLoader = true;
	 		 //we need to show the animation before redirecting to the url, so introducing a timeout there
	 		 setTimeout(function(){  
	 		 	$window.location.href = data.redirect_url;
	 		 }, 300);
	 		 
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
	
	 if($stateParams.notifications.count != ""){
	 	$scope.errorMessage = [$stateParams.notifications];
	 } else {
	 	$scope.errorMessage = "";
	 }
	 
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
	 
        $scope.validPassword = false;
        //data.password
        $scope.validatePassword = function(data){
            console.log('validating password');
            
          //check if password contains at least 1 number and has at least 8 total characters
          //this is called on ng-change password
          if (data){
              if (data.password.length >= 8){
                  console.log('here');
                  console.log(arguments)
                  if (alphanumeric(data.password)){
                    $scope.validPassword = true;
                    console.log('true');
                  } else {
                    $scope.validPassword = false;
                  }
              } else {
                    $scope.validPassword = false;
              }
          } else {
              $scope.validPassword = false;
          }
        };
        var alphanumeric = function(str) {
            var letterNumber = /^.*(?=.{8,})(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%]+$/;//at least 1 letter, least 1 number, and some special characters
            if(str.match(letterNumber)){  
              return true;  
            } else {
              return false;   
            }  
        };
        /*
	  * Submit action activate user
	  */
	 $scope.submit = function() {
	 	 $scope.hasLoader = true;
		 resetSrv.activateUser($scope.data, $scope.successCallback, $scope.failureCallBack);
	};

}]);


