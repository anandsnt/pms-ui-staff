login.service('loginSrv',['$http', '$q', function($http, $q){
	this.addItem = function(data){
		console.log(data);
		
		var deferred = $q.defer();
		
		//Sample params {params:{fname: "fname", lname: "lname"}}
		$http.post("/sessions", data).success(function(response, status) {
			if(response.status == "success"){
		    	deferred.resolve(response.data);
			}else{
				// please note the type of error expecting is array
		    	deferred.reject(response.errors);
			}
		}).error(function(response, status) {
			// please note the type of error expecting is array
			// so form error as array if you modifying it
			if(status == 406){ // 406- Network error
				deferred.reject(response.errors);
			}
			else if(status == 500){ // 500- Internal Server Error

				deferred.reject(['Internal server error occured']);
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