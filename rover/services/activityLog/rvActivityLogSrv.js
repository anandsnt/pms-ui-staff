sntRover.service('RVActivityLogSrv', [
	'$q',
	'rvBaseWebSrvV2',
	function($q, rvBaseWebSrvV2) {

		this.cacheReportList = {};

		this.fetchActivityLog = function(params) {
			var deferred = $q.defer();
			//var url = '/ui/show?format=json&json_input=activityLog/activity_log.json';
			
			var url = '/api/reservation_actions/'+ params;

			rvBaseWebSrvV2.getJSON(url)
			.then(function(data) {
				this.cacheReportList = data;
				deferred.resolve(this.cacheReportList);
			}.bind(this), function(data) {
				deferred.reject(data);
			});
			
			return deferred.promise;
		};

		this.filterActivityLog = function(params) {
			var deferred = $q.defer();
			//var url = '/ui/show?format=json&json_input=activityLog/activity_log.json';
			
			var url = '/api/reservation_actions/'+ params.id;

			rvBaseWebSrvV2.getJSON(url, {from_date:params.from_date,to_date:params.to_date,sort_order:params.sort_order,sort_field:params.sort_field})
			.then(function(data) {
				this.cacheReportList = data;
				deferred.resolve(this.cacheReportList);
			}.bind(this), function(data) {
				deferred.reject(data);
			});
			
			return deferred.promise;
		};

		this.fetchComTaGrp = function(query) {
			var deferred = $q.defer(),
				url = 'api/reports/search_by_company_agent_group?query=' + query;

			rvBaseWebSrvV2.getJSON(url)
				.then(function(data) {
					deferred.resolve(data.results);
				}.bind(this), function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		};

		this.fetchActiveUsers = function() {
			var deferred = $q.defer(),
				url = '/api/users/active';

			rvBaseWebSrvV2.getJSON(url)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		};
		

	}
]);