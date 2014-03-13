hkRover.service('hkDashboardSrv',['$http', '$q', function($http, $q){

	this.fetch = function(){
		var deferred = $q.defer();
		var url = '/house/dashboard.json';

		$http.get(url).success(function(response, status) {
		    deferred.resolve(response.data);
		}).error(function(data, status) {
		    deferred.reject(data);
		});
		return deferred.promise;
	}
}]);