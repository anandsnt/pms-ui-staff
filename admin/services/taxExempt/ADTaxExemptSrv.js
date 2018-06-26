admin.service('ADTaxExemptSrv', ['$q', 'ADBaseWebSrvV2',
function($q, ADBaseWebSrvV2) {
	/*
	* To fetch hotel PaymentMethods
	*/
	this.fetchTaxExempts = function(params) {
		var deferred = $q.defer(),
		    url = '/api/tax_exempt_types';

		ADBaseWebSrvV2.getJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(errorMessage) {
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

	this.fetchChargeCodes = function() {
		var deferred = $q.defer(),
		    url = "/admin/charge_codes/list.json?charge_code_type=TAX";

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(errorMessage) {
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

	this.saveTaxExempts = function(params) {
		var deferred = $q.defer(),
		    url = '/api/tax_exempt_types';

		ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(errorMessage) {
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

	this.getTaxExemptDetails = function(params) {
		var deferred = $q.defer(),
		    url = '/api/tax_exempt_types/' + params.id;

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(errorMessage) {
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

	this.updateTaxExempts = function(params) {
		var deferred = $q.defer(),
		    url = '/api/tax_exempt_types/' + params.id;

		ADBaseWebSrvV2.putJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(errorMessage) {
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

	this.deleteTaxExempts = function(params) {
		var deferred = $q.defer(),
		    url = '/api/tax_exempt_types/' + params.id;

		ADBaseWebSrvV2.deleteJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(errorMessage) {
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};
	
	
}]);