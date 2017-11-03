angular.module('sntRover').service('RVCompanyCardActivityLogSrv', [
	'$q',
	'rvBaseWebSrvV2',
	function($q, rvBaseWebSrvV2) {

		this.fetchActivityLog = function(params) {
			var deferred = $q.defer(),
				url = '/api/reservation_actions/' + params.id;

			rvBaseWebSrvV2.getJSON(url, params)
			.then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});

            return deferred.promise;
		};
	}
]);