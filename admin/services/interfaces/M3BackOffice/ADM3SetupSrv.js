admin.service('ADM3SetupSrv', ['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){
	
	/**
	 * to get the letsahre configraton values
	 * @return {undefined}
	 */
	this.getConfig = function() {
		var deferred = $q.defer();
		var url = '/api/hotel_settings.json';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data.afas);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
	 * to save the letshare configration values
	 * @return {undefined}
	 */
	this.saveConfig = function(params) {
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