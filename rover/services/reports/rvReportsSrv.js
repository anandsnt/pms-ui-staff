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
						this.cacheReportList.results.unshift({
							"id": 1,
							"title": "Booking Source & Market Report",
							"sub_title": "By Date Range",
							"description": "Bookings by Source & Market and Date Range / Forecast & History",
							"filters": [{
								"value": "DATE_RANGE",
								"description": "Booked Date Range"
							}, {
								"value": "ARRIVAL_DATE_RANGE",
								"description": "Arrival Date Range"
							}, {
								"value": "MARKET",
								"description": "Market"
							}, {
								"value": "SOURCE",
								"description": "Source"
							}, {
								"value": "INCLUDE_CANCELED",
								"description": "Include Canceled"
							}, {
								"value": "INCLUDE_NO_SHOW",
								"description": "Include No Show"
							}]
						});
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
	}
]);