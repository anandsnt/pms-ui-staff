admin.service('ADBaseWebSrv',['$http', '$q', function($http, $q){

	return {
	    getJSON: function(url, params){
			var deferred = $q.defer();
			if(typeof params == "undefined"){
				params = "";
			}
			//Sample params {params:{fname: "fname", lname: "lname"}}
			$http.get(url, params).success(function(response, status) {
				if(response.status == "success"){
			    	deferred.resolve(response.data);
				}else{
			    	deferred.reject(response.data);
				}
			}).error(function(data, status) {
				if(status == 406){ // 406- Network error
					console.log("Network error");
					deferred.reject(data);
				}
				else if(status == 500){ // 500- Internal Server Error
					console.log("Internal Server Error");
					deferred.reject(data);
				}
				else if(status == 401){ // 401- Unauthorized
					console.log("Unauthorized");
					//To do redirect
				}else{
					deferred.reject(data);
				}
			    
			});
			return deferred.promise;

	   },
	    
	   putJSON: function(url, params){
			var deferred = $q.defer();
			if(typeof params == "undefined"){
				params = "";
			}
			$http.put(url, params).success(function(response, status) {
				if(response.status == "success"){
			    	deferred.resolve(response.data);
				}else{
			    	deferred.reject(response.data);
				}
			}).error(function(data, status) {
			    if(status == 406){ // 406- Network error
					console.log("Network error");
					deferred.reject(data);
				}
				else if(status == 500){ // 500- Internal Server Error
					console.log("Internal Server Error");
					deferred.reject(data);
				}
				else if(status == 401){ // 401- Unauthorized
					console.log("Unauthorized");
					//To do redirect
				}else{
					deferred.reject(data);
				}
			});
			return deferred.promise;

	    },
	    
	   postJSON: function(url, params){
			var deferred = $q.defer();
			if(typeof params == "undefined"){
				params = "";
			}
			$http.post(url, params).success(function(response, status) {
				if(response.status == "success"){
			    	deferred.resolve(response.data);
				}else{
			    	deferred.reject(response.data);
				}
			}).error(function(data, status) {
			    if(status == 406){ // 406- Network error
					console.log("Network error");
					deferred.reject(data);
				}
				else if(status == 500){ // 500- Internal Server Error
					console.log("Internal Server Error");
					deferred.reject(data);
				}
				else if(status == 401){ // 401- Unauthorized
					console.log("Unauthorized");
					//To do redirect
				}else{
					deferred.reject(data);
				}
			});
			return deferred.promise;

	    },
	    
	   deleteJSON: function(url, params){
			var deferred = $q.defer();
			if(typeof params == "undefined"){
				params = "";
			}
			$http.delete(url, params).success(function(response, status) {
				if(response.status == "success"){
			    	deferred.resolve(response.data);
				}else{
			    	deferred.reject(response.data);
				}
			}).error(function(data, status) {
			    if(status == 406){ // 406- Network error
					console.log("Network error");
					deferred.reject(data);
				}
				else if(status == 500){ // 500- Internal Server Error
					console.log("Internal Server Error");
					deferred.reject(data);
				}
				else if(status == 401){ // 401- Unauthorized
					console.log("Unauthorized");
					//To do redirect
				}else{
					deferred.reject(data);
				}
			});
			return deferred.promise;

	    }
	};

}]);