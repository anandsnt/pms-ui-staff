sntRover.service('RVWorkManagementSrv', ['$q', 'rvBaseWebSrvV2',
	function($q, RVBaseWebSrvV2) {
		this.fetchStatistics = function() {
			var deferred = $q.defer();
			var url = '/api/accounts';
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