admin.service('ADHotelSettingsSrv', ['$http', '$q', 'ADBaseWebSrvV2',
function($http, $q, ADBaseWebSrvV2) {

	this.fetchHotelSettings = function(params) {
		var deferred = $q.defer();

		var url = "/api/hotel_settings";
		ADBaseWebSrvV2.getJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

}]);
