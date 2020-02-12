admin.service('ADExtApiKeyGeneratorSrv', ['$http', '$q', 'ADBaseWebSrvV2', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrvV2, ADBaseWebSrv) {
  /**
	*   A getter method to return the api keys list
	*/
	this.fetch = function(params) {
		var deferred = $q.defer();
		var url = '/admin/api_keys.json';

		ADBaseWebSrvV2.getJSON(url, params).then(function(data) {
				deferred.resolve(data);
		}, function(data) {
				deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
	*   A getter method to return the hotel chains
	*/
	this.chains = function() {
		var deferred = $q.defer();
		var url = '/admin/hotel_chains.json?is_minimal=true';

		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
	*   Post method to generate Api Key
	*/
	this.create = function(data) {
		var deferred = $q.defer();
		var url = '/admin/api_keys.json';

		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
}]);
