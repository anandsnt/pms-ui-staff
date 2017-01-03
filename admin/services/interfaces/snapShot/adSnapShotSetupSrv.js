admin.service('adSnapShotSetupSrv', ['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2) {

	/**
	 * [getConfig description]
	 * @return {[type]} [description]
	 */
	this.getSettings = function() {
		var deferred = $q.defer(),
			url = '/api/hotel_settings/snapshot_settings.json';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
	 * [saveConfig description]
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	this.saveSettings = function(params) {
		var deferred = $q.defer(),
			url = '/api/hotel_settings/snapshot_settings.json';

		ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
	 * [publishFullExport description]
	 * @return {[type]} [description]
	 */
	this.publishFullExport = function() {
		var deferred = $q.defer(),
			url = '/api/hotel_settings/snapshot_settings/reservation_full_export';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
	 * [save snapshot sub group mapping description]
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	this.saveSubgroupMapping = function(params) {
		var deferred = $q.defer(),
			url = '/api/hotel_settings/snapshot_settings.json';

		ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
}]);