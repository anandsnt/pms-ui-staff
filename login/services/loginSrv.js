angular.module('login').service('loginSrv',['$http', '$q', function($http, $q){
	this.login = function(data, successCallback, failureCallBack){
		var deferred = $q.defer();

		//Sample params {params:{fname: "fname", lname: "lname"}}
		$http.post("/login/submit", data).success(function(response, status) {
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

				deferred.reject(['Internal server error occured']);
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

	this.forgotPassword = function(data, successCallback, failureCallBack){
		var deferred = $q.defer();

		//Sample params {params:{"email":email}}
		$http.post("/login/send_temporary_password", data).success(function(response, status) {
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

				deferred.reject(['Internal server error occured']);
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

}]);