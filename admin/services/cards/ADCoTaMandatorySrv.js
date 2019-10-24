admin.service('ADCoTaMandatorySrv', ['$q', 'ADBaseWebSrvV2',
function($q, ADBaseWebSrvV2) {
   /*
	* To fetch mandatory fields
	*/
	this.fetchCoTaMandatoryFields = function(params) {
		var deferred = $q.defer(),
			url = '/admin/co_ta_settings/current_settings.json';

		ADBaseWebSrvV2.getJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(errorMessage) {
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};
	/*
	* To fetch mandatory fields
	*/
	this.saveCoTaMandatoryFields = function(params) {
		var deferred = $q.defer(),
			url = '/admin/co_ta_settings/save_mandatory';

		ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(errorMessage) {
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};
		
	
}]);