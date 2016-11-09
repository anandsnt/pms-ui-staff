admin.service('adGustoPOSSetupSrv', ['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2) {
	
	/**
	 * to get the GustoPOS configraton values
	 * @return {undefined}
	 */
	this.fetchGustoPOSConfiguration = function() {
		var deferred = $q.defer();
		var url = '/api/hotel_settings.json';
		//var url = "ui/show?json_input=Gusto/settings.json&format=json";

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data.gusto);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
	 * to save the GustoPOS configration values
	 * @return {undefined}
	 */
	this.saveGustoPOSConfiguration = function(params) {
		var deferred = $q.defer();
		var url = '/api/hotel_settings/change_settings';

		ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
}]);