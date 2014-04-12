admin.service('ADRatesAddDetailsSrv', ['$q', 'ADBaseWebSrvV2',
function($q, ADBaseWebSrvV2) {

	this.fetchRateTypes = function() {
		var deferred = $q.defer();
		var url = "/api/rate_types/active.json";
		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.fetchBasedOnTypes = function() {
		var deferred = $q.defer();
		var url = "/api/rates.json";
		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};




}]);
