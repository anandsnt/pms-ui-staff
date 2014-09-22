sntRover.service('RVWorkManagementSrv', ['$q', 'rvBaseWebSrvV2',
	function($q, RVBaseWebSrvV2) {
		/**
		 * CICO-8605
		 * Method used to fetch the statistics to populate the Work Management Landing Screen
		 * @return {Object} The statistics returned from API call
		 */
		this.fetchStatistics = function() {
			var deferred = $q.defer(),
				url = '/api/work_statistics';
			RVBaseWebSrvV2.getJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		this.searchRooms = function(params) {
			var deferred = $q.defer(),
				url = '/api/accounts';
			RVBaseWebSrvV2.getJSON(url).then(function(data) {
				deferred.resolve({
					"departures": {
						"clean": 152,
						"total_hours": "03.45",
						"total_maids_required": 12,
						"total_rooms_assigned": 2,
						"total_rooms_completed": 3
					},
					"stay_overs": {
						"clean": 12,
						"total_hours": "1.45",
						"total_maids_required": 12,
						"total_rooms_assigned": 2,
						"total_rooms_completed": 3
					}
				});
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		this.searchEmployees = function(params) {
			var deferred = $q.defer(),
				url = '/api/accounts';
			RVBaseWebSrvV2.getJSON(url).then(function(data) {
				deferred.resolve({
					"departures": {
						"clean": 152,
						"total_hours": "03.45",
						"total_maids_required": 12,
						"total_rooms_assigned": 2,
						"total_rooms_completed": 3
					},
					"stay_overs": {
						"clean": 12,
						"total_hours": "1.45",
						"total_maids_required": 12,
						"total_rooms_assigned": 2,
						"total_rooms_completed": 3
					}
				});
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};
	}
]);