admin.service('ADStationarySrv', ['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2) {

	/**
    * To fetch the details of stationary details.
    * @return {object} details of stationary details json
    */
	this.fetch = function(params) {
		var deferred = $q.defer();
		var url = '/api/stationary';

		ADBaseWebSrvV2.getJSON(url, params).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};
   	/*
    * To save stationary details
    * @return {object} status
    */
	this.saveStationary = function(data) {
		var deferred = $q.defer();
		var url = '/api/stationary/save?locale=' + data.locale;

        delete data["locale"];

		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};

	var termsAndConditionsResponse = {};
	

	this.fetchTermsAndConditions = function(params) {

		var deferred = $q.defer();
		var fetchScreenTypes = function() {
			var url = 'api/terms_and_conditions';
			var url = '/sample_json/stationary/terms_and_conditions_screens.json';
			ADBaseWebSrvV2.getJSON(url, params).then(function(data) {
				termsAndConditionsResponse.screens = data;
				deferred.resolve(termsAndConditionsResponse);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		var url = 'api/terms_and_conditions';
		var url = '/sample_json/stationary/terms_and_conditions.json';
		ADBaseWebSrvV2.getJSON(url, params).then(function(data) {
			termsAndConditionsResponse.terms_and_conditions = data;
			fetchScreenTypes();
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

}]);