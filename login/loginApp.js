var login = angular.module('login',['ui.router', 'documentTouchMovePrevent', 'ngSanitize', 'ng-iscroll']);

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

	 if(localStorage.email){
	 	$scope.data.email = localStorage.email;
                document.getElementById("password").focus();

	 } else if (!localStorage.email){
	 	document.getElementById("email").focus();
	 }
	 $scope.errorMessage = "";
	 $scope.successMessage = "";
	 $scope.errorMessage = resetSrv.getErrorMessage();

	 /*
	  * successCallback of login action
	  * @param {object} status of login and data
	  */
	 $scope.successCallback = function(data){

	 	var navigateToRover = function(){
	 		//Clear all session storage contents. We are starting a new session.
        	var i = sessionStorage.length;
		 	while(i--) {
		 	  	var key = sessionStorage.key(i);
		 	  	sessionStorage.removeItem(key);
		 	}

			try {
				localStorage.email = $scope.data.email;
			} catch(e) {
				console.log('ignoring a problem occured while setting item using localStorage');
			}

		 	if(data.token!==''){
		 		$state.go('resetpassword', {token: data.token, notifications: data.notifications});
		 	}
		 	else {
	            $scope.hasLoader = true;
	            if(data.is_sp_admin === true){
	                //we need to show the animation before redirecting to the url, so introducing a timeout there
	                setTimeout(function(){
	                    $state.go('selectProperty');
	                }, 300);
	            }
	            else {
	                $scope.$emit("signingIn");
	                //we need to show the animation before redirecting to the url, so introducing a timeout there
	                setTimeout(function(){
	                    $window.location.href = data.redirect_url;
	                }, 300);

	            }
		 	}
        }
	 	
        if(sntapp.loginUpdate != null){
	        /**
	        * Passing user Login ID to native, for debugging on ipads
	        */
	        var args = [];
	        args.push($scope.data.email);        
	        var options = {
	          //Cordova write success callback
	          'successCallBack': navigateToRover,
	          'failureCallBack': navigateToRover,
	          arguments: args
	        }; 
	        sntapp.loginUpdate.setUserId(options); 
	        /**END
        	* Passing user login to native, for debugging  */
        }else{
        	/**
	        * There is no native component, so just move to rover without passing Login ID.
	        */
        	navigateToRover();    
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
	 	$scope.successMessage = "";
 		loginSrv.login($scope.data, $scope.successCallback, $scope.failureCallBack);
	};



	/*
	  * successCallback of forgot password action
	  */
	 $scope.successCallbackForgotPassword = function(data){
	 	$scope.hasLoader = false;
	 	$scope.successMessage = data.message;
	 };

	 /*
	  * Failure call back of forgot password action
	  */
	 $scope.failureCallBackForgotPassword = function(errorMessage){
	 	$scope.hasLoader = false;
	 	$scope.errorMessage = errorMessage;
	 };

	/*
	 * Forgot password action
	 */
	 $scope.forgotPassword = function() {
        $scope.errorMessage = "";
        $scope.successMessage = "";
	 	var errorMessage = ["Please enter your Login email address"];
	 	if($scope.data.email === ""){
	 		$scope.errorMessage = errorMessage;
	 	} else {
	 		var dataToPost = {"email" :$scope.data.email};
	 		$scope.hasLoader = true;
 			loginSrv.forgotPassword(dataToPost, $scope.successCallbackForgotPassword, $scope.failureCallBackForgotPassword);
	 	}
	 };
         
}]);
/*
 * Reset Password Controller - First time login of snt admin
 */
login.controller('resetCtrl',['$scope', 'resetSrv', '$window', '$state', '$stateParams', function($scope, resetSrv, $window, $state, $stateParams){
	 $scope.data = {};
	 $scope.data.token = $stateParams.token;

	 if($stateParams.notifications.count !== ""){
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
	 	if(data.is_sp_admin === true){
            //we need to show the animation before redirecting to the url, so introducing a timeout there
            setTimeout(function(){
                $state.go('selectProperty');
            }, 300);
        } 
        else {
            $scope.$emit("signingIn");
            //we need to show the animation before redirecting to the url, so introducing a timeout there
            setTimeout(function(){
                $window.location.href = data.redirect_url;
            }, 300);
        }
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
   	 $scope.data.username  = $stateParams.username;
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
	 	if(data.is_sp_admin === true){
            //we need to show the animation before redirecting to the url, so introducing a timeout there
            setTimeout(function(){
                $state.go('selectProperty');
            }, 300);
        } 
        else {
            $scope.$emit("signingIn");
            //we need to show the animation before redirecting to the url, so introducing a timeout there
            setTimeout(function(){
                $window.location.href = data.redirect_url;
            }, 300);
        }
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
          //check if password contains at least 1 number and has at least 8 total characters
          //this is called on ng-change password
          if (data){
              if (data.password.length >= 8){
                  if (alphanumeric(data.password)){
                    $scope.validPassword = true;
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
            var letterNumber = /^.*(?=.{8,})(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%]+$/;//at least 1 letter, least 1 number, some special characters [ !@#$% ] allowed
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

login.controller('stationLoginCtrl',['$scope', 'loginSrv', '$window', '$state', 'resetSrv', function($scope, loginSrv, $window, $state, resetSrv){
        $scope.data = {};

        if(localStorage.email){
               $scope.data.email = localStorage.email;
               document.getElementById("password").focus();

        } else if (!localStorage.email){
               document.getElementById("email").focus();
        }
        $scope.errorMessage = "";
        $scope.successMessage = "";
        $scope.errorMessage = resetSrv.getErrorMessage();

        $scope.successLoginCallback = function(data){
	 	//Clear all session storage contents. We are starting a new session.
	 	var i = sessionStorage.length;
	 	while(i--) {
	 	  	var key = sessionStorage.key(i);
	 	  	sessionStorage.removeItem(key);
	 	}

	 	localStorage.email = $scope.data.email;
	 	if(data.token!==''){
	 		$state.go('resetpassword', {token: data.token, notifications: data.notifications});
	 	} else {
                        $scope.$emit("signingIn");

                        $scope.hasLoader = true;
                        //we need to show the animation before redirecting to the url, so introducing a timeout there
                        setTimeout(function(){
                            console.log('data.redirect_url: ',data.redirect_url);
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
	 	$scope.successMessage = "";
 		loginSrv.login($scope.data, $scope.successLoginCallback, $scope.failureCallBack);
	};
         
        $scope.showOnScreenKeyboard = function(id) {
           //pull up the virtual keyboard (snt) theme... if chrome & fullscreen
            var isTouchDevice = 'ontouchstart' in document.documentElement,
                agentString = window.navigator.userAgent;
            var shouldShowKeyboard = (typeof chrome) && (agentString.toLowerCase().indexOf('window')!==-1) && isTouchDevice;
            if (shouldShowKeyboard && id){
                    new initScreenKeyboardListener('login', id, true);
             }
        };
        $scope.showOnScreenKeyboard();
         
}]);

