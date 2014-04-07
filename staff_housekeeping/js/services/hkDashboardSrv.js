hkRover.service('hkDashboardSrv',['$http', '$q', function($http, $q){

	
	this.fetch = function(){
		var deferred = $q.defer();
		var url = '/house/dashboard.json';
			
		$http.get(url).success(function(response, status) {
			if(response.status == "success"){
				
		    	deferred.resolve(response.data);
			}else{
				console.log("error");
			}
		}).error(function(data, status) {
			 if(status == 401) { 
		    	// 401- Unauthorized
				// so lets redirect to login page
				$window.location.href = '/house/logout' ;
			}else{
				deferred.reject(response);
			}
		});
		return deferred.promise;
	}

}]);