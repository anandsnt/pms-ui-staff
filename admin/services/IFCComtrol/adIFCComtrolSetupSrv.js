admin.service('adIFCComtrolSetupSrv', ['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){
	
	/**
	 * to get the IFCComtrol configuration values
	 * @return {undefined}
	 */
	this.fetchIFCComtrolConfiguration = function() {
		var deferred = $q.defer();
		var url = '/api/hotel_settings.json';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data.ifc_comtrol);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
	 * to save the GustoPOS configration values
	 * @return {undefined}
	 */
	this.saveIFCComtrolConfiguration = function(params) {
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
