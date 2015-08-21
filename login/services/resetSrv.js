login.service('resetSrv',['$http', '$q', function($http, $q){
   /*
    * Reset Password
    * @param object of data
    * @param successcallbackasction
    * @param failureCallback action
    */
	this.resetPassword = function(data, successCallback, failureCallBack){

		var deferred = $q.defer();

		$http.put("/api/password_resets/"+data.token+"/update.json", data).success(function(response, status) {
			if(response.status === "success"){
		    	successCallback(response.data);
			}else{
				// please note the type of error expecting is array
		    	failureCallBack(response.errors);
			}
		}).error(function(response, status) {
			// please note the type of error expecting is array
			// so form error as array if you modifying it
			if(status === 406){ // 406- Network error
				deferred.reject(response.errors);
			}
			else if(status === 500){ // 500- Internal Server Error

				failureCallBack(['Internal server error occured']);
			}
			else if(status === 401){ // 401- Unauthorized
				// so lets redirect to login page
				$window.location.href = '/logout' ;
			}else{
				deferred.reject(response.errors);
			}

		});
		return deferred.promise;




	};
   /*
    * Activate user by changing Password
    * @param object of data
    * @param successcallbackasction
    * @param failureCallback action
    */
	this.activateUser = function(data, successCallback, failureCallBack){

		var deferred = $q.defer();

		var url = "/api/password_resets/"+data.token+"/update.json";


		$http.put(url, data).success(function(response, status) {
			if(response.status === "success"){
		    	successCallback(response.data);
			}else{
				// please note the type of error expecting is array
		    	failureCallBack(response.errors);
			}
		}).error(function(response, status) {
			// please note the type of error expecting is array
			// so form error as array if you modifying it
			if(status === 406){ // 406- Network error
				deferred.reject(response.errors);
			}
			else if(status === 500){ // 500- Internal Server Error

				failureCallBack(['Internal server error occured']);
			}
			else if(status === 401){ // 401- Unauthorized
				// so lets redirect to login page
				$window.location.href = '/logout' ;
			}else{
				deferred.reject(response.errors);
			}

		});
		return deferred.promise;
	};
   /*
    * To check the token status
    * @param object of data
    * @param string success callback
    * @param string failure callback
    */
	this.checkTokenStatus = function(data, successCallback, failureCallBack){

		var deferred = $q.defer();

		var url = "";

		var url = "/api/password_resets/validate_token.json";
		$http.post(url, data).success(function(response, status) {
			if(response.status !== "success"){
		    	failureCallBack(response.errors);
			}
		}).error(function(response, status) {
			// please note the type of error expecting is array
			// so form error as array if you modifying it
			if(status === 406){ // 406- Network error
				deferred.reject(response.errors);
			}
			else if(status === 500){ // 500- Internal Server Error

				failureCallBack(['Internal server error occured']);
			}
			else if(status === 401){ // 401- Unauthorized
				// so lets redirect to login page
				$window.location.href = '/logout' ;
			}else{
				deferred.reject(response.errors);
			}

		});
		return deferred.promise;
	};
	/*
	 * To set error message if user is already activated or token expired.
	 */
	this.errorMessage = "";
	this.setErrorMessage = function(errorMessage) {
		this.errorMessage = errorMessage;
	};
   /*
    * To get error message if user is already activated or token expired.
    */
	this.getErrorMessage = function(errorMessage) {
		return this.errorMessage;
	};

}]);