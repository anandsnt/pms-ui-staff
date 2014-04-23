admin.service('ADRatesConfigureSrv',['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){
	
	this.fetchSetsInDateRange = function() {
		var deferred = $q.defer();

		// var url = " /sample_json/ng_admin/rate_types.json";
		var url = "/api/rate_date_ranges/13";
		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
  
}]);