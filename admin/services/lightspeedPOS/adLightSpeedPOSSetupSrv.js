admin.service('adLightSpeedPOSSetupSrv', ['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){
	
	/**
	 * to get the LightSpeedPOS configraton values
	 * @return {undefined}
	 */
	this.fetchLightSpeedPOSConfiguration = function() {
		var deferred = $q.defer();
		var url = '/api/hotel_settings.json';

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

	this.importProductsFromLightspeedPOS = function() {
		var deferred = $q.defer();
		var url = '/api_for_product_import_from_light_speed';

		ADBaseWebSrvV2.postJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

}]);