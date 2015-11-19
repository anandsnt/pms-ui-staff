admin.service('adBritePabXSetupSrv', ['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){
	
	/**
	 * to get the BritePabX configraton values
	 * @return {undefined}
	 */
	this.fetchBritePabXConfiguration = function() {
		var deferred = $q.defer();
		var url = '/api/hotel_settings.json';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data.brite);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
	 * to save the BritePabX configration values
	 * @return {undefined}
	 */
	this.saveBritePabXConfiguration = function(params) {
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