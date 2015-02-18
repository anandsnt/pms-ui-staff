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

						// TESTING: mocking data
						data.results[5] = {
							id: 12,
							title: "Deposit Report",
							sub_title: null,
							description: "Deposit due / paid by date",
							filters: [{
								value: "ARRIVAL_DATE_RANGE",
								description: "Arrival Date Range"
							},
							{
								value: "DEPOSIT_DATE_RANGE",
								description: "Deposit due date range"
							},
							{
								value: "DEPOSIT_DUE",
								description: "Include Deposit Due"
							},
							{
								value: "DEPOSIT_PAID",
								description: "Include Deposit Paid"
							},
							{
								value: "DEPOSIT_PAST",
								description: "Include Deposit Past"
							}],
							sort_fields: [{value: "DATE", description: "Date"},
									{value: "DUE_DATE_RANGE", description: "Deposit Due Date"},
									{value: "PAID_DATE_RANGE", description: "Deposit Paid Date"},
									{value: "NAME", description: "Name"},
									{value: "RESERVATION", description: "Reservation Number"}]
						};

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
				}.bind(this), function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		};

		this.fetchDemographicMarketSegments = function(params) {
			var deferred = $q.defer(),
				url = '/api/market_segments?is_active=true';
			// CICO-10202 Assuming that it is enough to show only the active market segments. if this is wrong and we need to show all the market segments.. uncomment the following line.
			// url = '/api/market_segments';
			rvBaseWebSrvV2.getJSON(url)
				.then(function(data) {
					deferred.resolve(data.markets);
				}.bind(this), function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		};

		this.fetchGuaranteeTypes = function() {
			var deferred = $q.defer(),
				url = '/api/reservation_types.json?is_active=true';

			rvBaseWebSrvV2.getJSON(url)
				.then(function(data) {
					deferred.resolve(data.reservation_types);
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
	}
]);