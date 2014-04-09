login.service('resetSrv',['$http', '$q', function($http, $q){
	this.resetPassword = function(data, successCallback, failureCallBack){
		console.log(data);
		
		var deferred = $q.defer();
		
		
		$http.post("/login/submit", data).success(function(response, status) {
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