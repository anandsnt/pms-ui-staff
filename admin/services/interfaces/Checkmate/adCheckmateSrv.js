admin.service('adCheckmateSetupSrv', ['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){
	
	/**
	 * to get the CheckMate configraton values
	 * @return {undefined}
	 */
	this.fetchCheckmateConfiguration = function() {
		var deferred = $q.defer();
		var url = '/api/hotel_settings/checkmate.json';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
	 * to save the CheckMate configration values
	 * @return {undefined}
	 */
	this.saveCheckmateConfiguration = function(params) {
		var deferred = $q.defer();
		var url = '/api/hotel_settings/checkmate';

		ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};
}]);