admin.service('ADTaxExemptSrv', ['$q', 'ADBaseWebSrvV2',
function($q, ADBaseWebSrvV2) {
	/*
	* To fetch hotel PaymentMethods
	*/
	this.fetchTaxExempts = function() {
		var deferred = $q.defer();
		var url = '/api/tax_exempt_types';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(errorMessage) {
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

	this.fetchChargeCodes = function(params) {
		var deferred = $q.defer();
		var url = '/admin/charge_codes/list.json?query=' + params.query;

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(errorMessage) {
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

	this.saveTaxExempts = function(params) {
		var deferred = $q.defer();
		var url = '/api/tax_exempt_types';

		ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(errorMessage) {
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};
	
}]);