admin.service('ADFrequentFlyerProgramSrv', ['$http', '$q', 'ADBaseWebSrv',
function($http, $q, ADBaseWebSrv) {

	/**
	 *   A getter method to return the Frequent Flyer Program List
	 */
	this.fetch = function() {
		var deferred = $q.defer();
		var url = '/admin/hotel/list_ffps.json';

		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
	/**
	 *   A post method to update Frequent Flyer Program for a hotel
	 *   @param {Object} data for the Frequent Flyer Program List details.
	 */
	this.switchToggle = function(data) {
		var deferred = $q.defer();
		var url = '/admin/hotel/toggle_ffp_activation/';

		ADBaseWebSrv.postJSON(url, data).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
	/**
	 *   A post method to update Frequent Flyer Program for a hotel
	 *   @param {Object} data for the Frequent Flyer Program List details.
	 */
	this.switchMainToggle = function(data) {
		var deferred = $q.defer();
		var url = '/admin/hotel/use_ffp/';

		ADBaseWebSrv.postJSON(url, data).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
}]);
