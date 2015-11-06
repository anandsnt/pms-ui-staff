admin.service('adPabXSetupSrv', ['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){
	
	/**
	 * to get the pabx configraton values
	 * @return {undefined}
	 */
	this.fetchPabXConfiguration = function() {
		var deferred = $q.defer();
		var url = '/api/hotel_settings.json';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data.pabx);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
	 * to save the pabx configration values
	 * @return {undefined}
	 */
	this.savePabXConfiguration = function(params) {
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