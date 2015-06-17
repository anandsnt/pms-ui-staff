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

						// Support for Occupany from UI for now..
						// This filter will be provided by the API in future
						var occupanyReport = _.where(this.cacheReportList.results, { title: 'Occupancy & Revenue Summary' });
						if ( !!occupanyReport && !!occupanyReport.length ) {
							occupanyReport[0].filters.push({
								value: "CHOOSE_MARKET", description: "Choose Market"
							});
						};

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

		// id & description
		this.fetchChargeGroups = function() {
			var deferred = $q.defer(),
				url = 'api/charge_groups';

			rvBaseWebSrvV2.getJSON(url)
				.then(function(data) {
					deferred.resolve(data.results);
				}.bind(this), function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		};

		// id & description
		this.fetchChargeCodes = function() {
			var deferred = $q.defer(),
				url = 'api/charge_codes?is_get_all_charge_codes=true';

			rvBaseWebSrvV2.getJSON(url)
				.then(function(data) {
					deferred.resolve(data.results);
				}.bind(this), function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		};

		// value, name, description & is_active
		this.fetchSources = function() {
			var deferred = $q.defer(),
				url = 'api/sources?is_active=true';

			rvBaseWebSrvV2.getJSON(url)
				.then(function(data) {
					deferred.resolve(data.sources);
				}.bind(this), function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		};

		// value, name, description & is_active
		this.fetchBookingOrigins = function() {
			var deferred = $q.defer(),
				url = 'api/booking_origins?is_active=true';

			rvBaseWebSrvV2.getJSON(url)
				.then(function(data) {
					deferred.resolve(data.booking_origins);
				}.bind(this), function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		};

		this.fetchCodeSettings = function() {
			var deferred = $q.defer(),
				url = '/api/reports/code_settings';

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
