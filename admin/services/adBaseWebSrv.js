admin.factory('ADBaseWebSrv',['$http', '$q', function($http, $q){

	return {
	    getJSON: function(url){
			var deferred = $q.defer();
			$http.get(url).success(function(response, status) {
				if(response.status == "success"){
			    	deferred.resolve(response.data);
				}else{
			    	deferred.reject(response.data);
				}
			}).error(function(data, status) {
			    deferred.reject(data);
			});
			return deferred.promise;

	   },
	    
	   putJSON: function(url, postdata){
			var deferred = $q.defer();
			$http.put(url, postdata).success(function(response, status) {
				if(response.status == "success"){
			    	deferred.resolve(response.data);
				}else{
			    	deferred.reject(response.data);
				}
			}).error(function(data, status) {
			    deferred.reject(data);
			});
			return deferred.promise;

	    }
	};

}]);