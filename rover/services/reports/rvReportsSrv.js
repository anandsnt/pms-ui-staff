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

			if ( backToList ) {
				deferred.resolve( this.cacheReportList );
			} else {
				rvBaseWebSrvV2.getJSON(url)
					.then(function(data) {

						// mock data, remove before API integration, release merge
						data.results.push({
							description: "Conversion details for late check in and web check in",
							id: 5,
							sub_title: "By Month",
							title: "Web Check In Conversion",
							filters: [{ description: "Date Range", value: "DATE_RANGE" }],
							sort_fields: [{ description: "Date", value: "DATE" }]
						});

						this.cacheReportList = data;
						deferred.resolve(this.cacheReportList);
					}.bind(this), function(data){
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
				}.bind(this), function(data){
					deferred.reject(data);
				});

			return deferred.promise;
		};
	}
]);