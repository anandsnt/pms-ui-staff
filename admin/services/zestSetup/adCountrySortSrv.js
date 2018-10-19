
admin.service('ADCountrySortSrv', ['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2) {
   /**
    * To fetch the country list
    * */
	this.fetchSortedCountries = function() {

		var deferred = $q.defer();
		var url = '/api/countries/sorted_list.json';

		ADBaseWebSrv.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/**
    * To update the order
    */
	this.saveComponentOrder = function(params) {

		var deferred = $q.defer();
		var url =  'api/countries/assign_sequence.json';

		ADBaseWebSrv.postJSON(url, params).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
    * To update the order
    */
	this.deleteItem = function(params) {

		var deferred = $q.defer();
		var url = 'api/countries/' + params.id + '/destroy_sorting.json';

		ADBaseWebSrv.deleteJSON(url).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};

	this.fetchRestrictedCountriesList = function() {
		var url = '/api/zest_country_restrictions.json';

		return ADBaseWebSrvV2.getJSON(url);
	};

	this.unsubscribeCountryFromList = function(params) {
		var url = '/api/zest_country_restrictions/' + params.country_id;

		return ADBaseWebSrvV2.putJSON(url, params);
	};

}]);