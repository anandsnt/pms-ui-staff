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

						var data = data;
						data.results.push({
				            "id": 202,
				            "title": "Daily Transactions",
				            "filters": [
				                {
				                    "value": "BY_SINGLE_DATE",
				                    "description": "By Single Date"
				                },
				                {
				                    "value": "BY_CHARGE_GROUP",
				                    "description": "By Charge Group"
				                } ,
				                {
				                    "value": "BY_CHARGE_CODE",
				                    "description": "By Charge Code"
				                }
				            ],
				            "sort_fields": [
				                {
				                    "value": "BY_REVENUE",
				                    "description": "By Revenue"
				                },
				                {
				                    "value": "BY_CHARGE_GROUP",
				                    "description": "By Charge Group"
				                },
				                {
				                    "value": "BY_CHARGE_CODE",
				                    "description": "By Charge Code"
				                },
				                {
				                    "value": "BY_VARIANCE_MTD",
				                    "description": "By Variance MTD"
				                },
				                {
				                    "value": "BY_VARIANCE_YTD",
				                    "description": "By Variance YTD"
				                }
				            ]
				        });


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
