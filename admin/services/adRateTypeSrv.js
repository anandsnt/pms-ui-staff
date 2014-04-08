admin.service('ADRateTypeSrv', ['$http', '$q', 'ADBaseWebSrvV2',
function($http, $q, ADBaseWebSrvV2) {

	this.fetch = function() {
		var deferred = $q.defer();

		//var url = " /sample_json/ng_admin/rate_types.json";
		var url = "/api/admin/rate_types.json";
		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data.results);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
	 *   A post method to update Rate type for a hotel
	 *   @param {Object} data for the Rate type list item details.
	 */
	this.postRateTypeToggle = function(data) {
		var deferred = $q.defer();
		var url = "/api/admin/rate_types/" + data.id + "/activate";

		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
	/*
	 * To save new RateType
	 * @param {array} data of the new RateType
	 * @return {object} status and new id of new RateType
	 */
	this.saveRateType = function(data) {
		var deferred = $q.defer();
		var url = '/api/admin/rate_types';

		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	/*
	 * To update RateType data
	 * @param {array} data of the modified RateType
	 * @return {object} status of updated RateType
	 */
	this.updateRateType = function(data) {

		var deferred = $q.defer();
		var url = '/api/admin/rate_types/' + data.id;

		ADBaseWebSrvV2.putJSON(url, data).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
	/*
	 * To get the details of the selected rate type
	 * @param {array} selected rate type id
	 * @return {object} selected rate type details
	 */
	this.getRateTypesDetails = function(data) {
		var deferred = $q.defer();
		var id = data.id;
		//var url = "/sample_json/ng_admin/edit_rate_types.json"
		var url = '/api/admin/rate_types/' + id+".json";

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	/*
	 * To delete the seleceted rate type
	 * @param {int} id of the selected rate type
	 * @return {object} status of delete
	 */
	this.deleteRateType = function(id) {
		var deferred = $q.defer();

		var url = '/api/admin/rate_types/' + id;

		ADBaseWebSrvV2.deleteJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
}]);
