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

						// var data = data;
						// data.results.push({
						// 	id: 69,
						// 	title: "Deposit Report",
						// 	description: "Deposit due / paid by date",
						// 	filters: [{value: "DUE_DATE_RANGE", description: "Deposit Due Date"}, {value: "DATE_RANGE", description: "Arrival date range"}, {value: "INCLUDE_DEPOSIT_PAID", description: "Deposit Paid"}, {value: "INCLUDE_DEPOSIT_DUE", description: "Deposit Due"}, {value: "INCLUDE_DEPOSIT_PAST", description: "Deposit Past Due"}],
						// 	sort_fields: [{value: "DEPOSIT_DUE_DATE", description: "Deposit Due Date"}, {value: "PAID_DATE_RANGE", description: "Deposit paid date"}, {value: "NAME", description: "Guest Name"}, {value: "DATE", description: "Arrival Date"}, {value: "RESERVATION", description: "Reservation Number"}]
						// });

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

		this.fetchGuaranteeTypes = function() {
			var deferred = $q.defer(),
				url = '/api/reports/search_by_guarantee';

			rvBaseWebSrvV2.getJSON(url)
				.then(function(data) {
					deferred.resolve(data.results);
				}.bind(this), function(data){
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
				}.bind(this), function(data){
					deferred.reject(data);
				});

			return deferred.promise;
		};
	}
]);