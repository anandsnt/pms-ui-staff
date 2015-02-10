sntRover.service('RVreportsSrv', [
	'$q',
	'rvBaseWebSrvV2',
	function($q, rvBaseWebSrvV2) {
		var choosenReport = {};

		this.setChoosenReport = function(item) {
			choosenReport = item;
		};

		this.getChoosenReport = function() {
			return choosenReport;
		};

		this.cacheReportList = {};

		this.fetchReportList = function(backToList) {
			var deferred = $q.defer(),
				url = '/api/reports';

			if (backToList) {
				deferred.resolve(this.cacheReportList);
			} else {
				rvBaseWebSrvV2.getJSON(url)
					.then(function(data) {
						this.cacheReportList = data;						
						deferred.resolve(this.cacheReportList);
					}.bind(this), function(data) {
						deferred.reject(data);
					});
			}

			return deferred.promise;
		};

		this.fetchReportDetails = function(params) {
			var deferred = $q.defer(),
				url = '/api/reports/' + params.id + '/submit',
				params = _.omit(params, 'id');

			rvBaseWebSrvV2.getJSON(url, params)
				.then(function(data) {
					deferred.resolve(data);
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
				}.bind(this), function(data){
					deferred.reject(data);
				});

			return deferred.promise;
		};

		this.fetchCompanies = function() {
			var deferred = $q.defer(),
				url = '/api/';

			deferred.resolve([]);

			// rvBaseWebSrvV2.getJSON(url)
			// 	.then(function(data) {
			// 		deferred.resolve(data);
			// 	}.bind(this), function(data){
			// 		deferred.reject(data);
			// 	});

			return deferred.promise;
		};

		this.fetchTravelAgents = function() {
			var deferred = $q.defer(),
				url = '/api/';

			deferred.resolve([]);

			// rvBaseWebSrvV2.getJSON(url)
			// 	.then(function(data) {
			// 		deferred.resolve(data);
			// 	}.bind(this), function(data){
			// 		deferred.reject(data);
			// 	});

			return deferred.promise;
		};

		this.fetchGroups = function() {
			var deferred = $q.defer(),
				url = '/api/';

			deferred.resolve([]);

			// rvBaseWebSrvV2.getJSON(url)
			// 	.then(function(data) {
			// 		deferred.resolve(data);
			// 	}.bind(this), function(data){
			// 		deferred.reject(data);
			// 	});

			return deferred.promise;
		};

		this.fetchGuaranteeTypes = function() {
			var deferred = $q.defer(),
				url = '/api/';

			deferred.resolve([]);

			// rvBaseWebSrvV2.getJSON(url)
			// 	.then(function(data) {
			// 		deferred.resolve(data);
			// 	}.bind(this), function(data){
			// 		deferred.reject(data);
			// 	});

			return deferred.promise;
		};
	}
]);