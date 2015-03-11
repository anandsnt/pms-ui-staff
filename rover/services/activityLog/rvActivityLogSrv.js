sntRover.service('RVActivityLogSrv', [
	'$q',
	'rvBaseWebSrvV2',
	function($q, rvBaseWebSrvV2) {

		var self = this;
		self.perPage = 2;
		self.page = 1;

		this.cacheReportList = {};

		this.fetchActivityLog = function(params) {
			var deferred = $q.defer();
			//var url = '/ui/show?format=json&json_input=activityLog/activity_log.json';
			var url = '/api/reservation_actions/'+ params;

			rvBaseWebSrvV2.getJSON(url,{per_page:self.perPage,page:1})
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
			var url = '/api/reservation_actions/'+ params.id;

			rvBaseWebSrvV2.getJSON(url, {from_date:params.from_date,to_date:params.to_date,sort_order:params.sort_order,sort_field:params.sort_field,per_page:self.perPage,page:self.page,user_id:params.user_id})
			.then(function(data) {
				this.cacheReportList = data;
				deferred.resolve(this.cacheReportList);
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