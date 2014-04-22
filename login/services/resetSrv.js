login.service('resetSrv',['$http', '$q', function($http, $q){
   /*
    * Reset Password
    * @param object of data
    * @param successcallbackasction
    * @param failureCallback action
    */
	this.resetPassword = function(data, successCallback, failureCallBack){
		
		var deferred = $q.defer();
		
		$http.put("/admin/password_resets/"+data.token+"/admin_update.json", data).success(function(response, status) {
			if(response.status == "success"){
		    	//deferred.resolve(response.data);
		    	successCallback(response.data);
			}else{
				// please note the type of error expecting is array
		    	//deferred.reject(response.errors);
		    	failureCallBack(response.errors);
			}
		}).error(function(response, status) {
			// please note the type of error expecting is array
			// so form error as array if you modifying it
			if(status == 406){ // 406- Network error
				deferred.reject(response.errors);
			}
			else if(status == 500){ // 500- Internal Server Error

				failureCallBack(['Internal server error occured']);
			}
			else if(status == 401){ // 401- Unauthorized
				console.log('lets redirect');
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
		
		var url = "";
		if(data.user == "admin"){
			url = "/admin/password_resets/"+data.token+"/admin_update.json";
		} else if(data.user == "staff"){
			url = "/staff/password_resets/"+data.token+"/staff_update.json";
		}
		
		$http.put(url, data).success(function(response, status) {
			if(response.status == "success"){
		    	//deferred.resolve(response.data);
		    	successCallback(response.data);
			}else{
				// please note the type of error expecting is array
		    	//deferred.reject(response.errors);
		    	failureCallBack(response.errors);
			}
		}).error(function(response, status) {
			// please note the type of error expecting is array
			// so form error as array if you modifying it
			if(status == 406){ // 406- Network error
				deferred.reject(response.errors);
			}
			else if(status == 500){ // 500- Internal Server Error

				failureCallBack(['Internal server error occured']);
			}
			else if(status == 401){ // 401- Unauthorized
				console.log('lets redirect');
				// so lets redirect to login page
				$window.location.href = '/logout' ;
			}else{
				deferred.reject(response.errors);
			}
		    
		});
		return deferred.promise;
	};
	
}]);