angular.module('sntRover').service('RVGuestCardActivityLogSrv', [
	'$q',
	'rvBaseWebSrvV2',
	function($q, rvBaseWebSrvV2) {

		this.fetchActivityLog = function(params) {
			var deferred = $q.defer(),
				url = '/api/guest_details_actions';

			/*rvBaseWebSrvV2.getJSON(url, params)
			.then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});*/

			var data = {};
			deferred.resolve(data);
			
            return deferred.promise;
		};
	}
]);