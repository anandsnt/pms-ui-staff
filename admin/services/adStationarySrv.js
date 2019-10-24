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
			var url = '/api/terms_and_conditions/screens_info';
            
			ADBaseWebSrvV2.getJSON(url, params).then(function(data) {
				termsAndConditionsResponse.screens = data;
				deferred.resolve(termsAndConditionsResponse);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		var url = '/api/terms_and_conditions';
        
		ADBaseWebSrvV2.getJSON(url, params).then(function(data) {
			termsAndConditionsResponse.terms_and_conditions = data;
			fetchScreenTypes();
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.createNewTermsAndConditions = function (params) {
		
		var deferred = $q.defer();
		var url = '/api/terms_and_conditions';

		ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};

	this.updateTermsAndConditions = function (params) {
		var deferred = $q.defer();
		var url = '/api/terms_and_conditions/' + params.id;

		ADBaseWebSrvV2.putJSON(url, params).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};

	this.deleteTermsAndConditions = function (params) {
		
		var deferred = $q.defer();
		var url = '/api/terms_and_conditions/' + params.id;

		ADBaseWebSrvV2.deleteJSON(url, params).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};

	this.assignTermsAndConditions = function (params) {
		
		var deferred = $q.defer();
		var url = '/api/terms_and_conditions/update_screen_t_and_c';

		ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};

}]);
