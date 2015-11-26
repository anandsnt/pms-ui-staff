admin.service('adLightSpeedPOSSetupSrv', ['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){
	
	/**
	 * to get the LightSpeedPOS configraton values
	 * @return {undefined}
	 */
	this.fetchLightSpeedPOSConfiguration = function() {
		var deferred = $q.defer();
		var url = '/api/hotel_settings.json';
		//var url = "ui/show?json_input=lightspeed/settings.json&format=json";

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data.lightspeed);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
	 * to save the LightSpeedPOS configration values
	 * @return {undefined}
	 */
	this.saveLightSpeedPOSConfiguration = function(params) {
		var deferred = $q.defer();
		var url = '/api/hotel_settings/change_settings';

		ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};
}]);