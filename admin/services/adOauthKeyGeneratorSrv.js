admin.service('ADOauthKeyGeneratorSrv', ['$http', '$q', 'ADBaseWebSrvV2', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrvV2, ADBaseWebSrv) {
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
		var url = '/admin/rover_auth_keys.json';

		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
}]);
