admin.service('ADRateTypeSrv', ['$http', '$q', 'ADBaseWebSrvV2',
	function($http, $q, ADBaseWebSrvV2) {

		this.fetch = function() {
			var deferred = $q.defer();

			var url = "/api/rate_types.json?sort_field=is_active&sort_dir=false";
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
		this.postRateTypeToggle = function(param) {
			var deferred = $q.defer();
			var url = "/api/rate_types/" + param.id + "/activate";

			ADBaseWebSrvV2.postJSON(url, param).then(function(data) {
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
		this.saveRateType = function(param) {
			var deferred = $q.defer();
			var url = '/api/rate_types';

			ADBaseWebSrvV2.postJSON(url, param).then(function(data) {
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
		this.updateRateType = function(param) {

			var deferred = $q.defer();
			var url = '/api/rate_types/' + param.id;

			ADBaseWebSrvV2.putJSON(url, param).then(function(data) {
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
		this.getRateTypesDetails = function(param) {
			var deferred = $q.defer();
			var id = param.id;
			var url = '/api/rate_types/' + id + ".json";

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

			var url = '/api/rate_types/' + id;

			ADBaseWebSrvV2.deleteJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};


		this.fetchClassification = function() {
			var deferred = $q.defer();
			var url = "/api/rates/classifications";
			ADBaseWebSrvV2.getJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};
	}
]);