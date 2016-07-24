admin.service('adGoMomentIvySetupSrv', ['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){
	
	/**
	 * to get the GoMomentIvy configraton values
	 * @return {undefined}
	 */
	this.fetchGoMomentIvyConfiguration = function() {
		var deferred = $q.defer();
		var url = '/api/hotel_settings/gomomentivy.json';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
	 * to save the GoMomentIvy configration values
	 * @return {undefined}
	 */
	this.saveGoMomentIvyConfiguration = function(params) {
		var deferred = $q.defer();
		var url = '/api/hotel_settings/gomomentivy';

		ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};
}]);