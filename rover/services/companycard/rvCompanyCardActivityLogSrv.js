angular.module('sntRover').service('RVCompanyCardActivityLogSrv', [
	'$q',
	'rvBaseWebSrvV2',
	function($q, rvBaseWebSrvV2) {

		this.fetchActivityLog = function(params) {
			var deferred = $q.defer(),
				url = '/api/account_actions';

			rvBaseWebSrvV2.getJSON(url, params)
			.then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});

            return deferred.promise;
		};

		this.fetchFilterData = function(params) {
			var deferred = $q.defer(),
				// url = '/api/account_actions/filter_data',
				data = {
					"actions_list":[{"name":"Action-1","id":200},{"name":"Action-2","id":201}]
				};

			/*rvBaseWebSrvV2.getJSON(url, params)
			.then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});*/

			deferred.resolve(data);
            return deferred.promise;
		};
	}
]);