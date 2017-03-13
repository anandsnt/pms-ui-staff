admin.service('ADZestStationSrv', function(ADBaseWebSrvV2,$q) {

	this.fetchAddonSettings = function(argument) {
		var deferred = $q.defer();
		var url = '/sample_json/zest_station/addon_list.json';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
});