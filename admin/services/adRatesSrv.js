admin.service('ADRatesSrv', ['$http', '$q', 'ADBaseWebSrvV2',
function($http, $q, ADBaseWebSrvV2) {

	this.fetchRates = function(data) {
		var deferred = $q.defer();

		//var url = " /sample_json/ng_admin/rate_types.json";
		var url = "/api/rates.json";
		ADBaseWebSrvV2.getJSON(url, data).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.fetchRateTypes = function() {
		var deferred = $q.defer();

		//var url = " /sample_json/ng_admin/rate_types.json";
		var url = "/api/rate_types.json";
		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data.results);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

}]);
