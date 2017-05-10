admin.service('ADZestWebAddonSrv', function(ADBaseWebSrvV2, $q) {

	this.fetchAddonSettings = function(params) {
		var deferred = $q.defer();
		var url = '/api/upsell_addons';

		ADBaseWebSrvV2.getJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.saveAddonSettings = function(params) {
		var deferred = $q.defer();
		var url = '/api/upsell_addons/save';

		ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
});