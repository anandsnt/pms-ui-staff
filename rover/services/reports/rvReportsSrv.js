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



		this.reportApiPayload = function() {
			var deferred = $q.defer(),
				payload  = {};

			this.fetchReportList()
				.then( fetchAdditionalAPIs.bind(this) );

			// dont worry, the code below this line
			// will be hoisted to 'reportPayload' top
			// Have you heard for JavaScript Hoisting?
			return deferred.promise;

			function fetchAdditionalAPIs (data) {
				var promises  = [],
					hasFilter = checkFilters( data );

				var shallWeResolve = function() {
					var filters  = _.keys( hasFilter ).length,
						payloads = _.keys( payload ).length;

					// since payload will have two additional keys
					// 'reportsResponse' and 'codeSettings'
					if ( payloads - filters == 2 ) {
						deferred.resolve( payload );
					};
				};

				// add report list data to payload
				payload.reportsResponse = angular.copy( data );

				// fetch active users & add to payload
				if ( hasFilter['ACTIVE_USERS'] ) {
					this.fetchActiveUsers()
						.then(function(data) {
							payload.activeUserList = angular.copy( data );
							shallWeResolve();
						});
				};

				// fetch gurantee types & add to payload
				if ( hasFilter['INCLUDE_GUARANTEE_TYPE'] ) {
					this.fetchGuaranteeTypes()
						.then(function(data) {
							payload.guaranteeTypes = angular.copy( data );
							shallWeResolve();
						});
				};

				// fetch charge groups & add to payload
				if ( hasFilter['INCLUDE_CHARGE_GROUP'] ) {
					this.fetchChargeGroups()
						.then(function(data) {
							payload.chargeGroups = angular.copy( data );
							shallWeResolve();
						});
				};

				// fetch charge groups & add to payload
				if ( hasFilter['INCLUDE_CHARGE_CODE'] ) {
					this.fetchChargeCodes()
						.then(function(data) {
							payload.chargeCodes = angular.copy( data );
							shallWeResolve();
						});
				};

				// fetch booking origins & add to payload
				if ( hasFilter['CHOOSE_BOOKING_ORIGIN'] ) {
					this.fetchDemographicMarketSegments()
						.then(function(data) {
							payload.origins = angular.copy( data );
							shallWeResolve();
						});
				};

				// fetch markers & add to payload
				if ( hasFilter['CHOOSE_MARKET'] ) {
					this.fetchSources()
						.then(function(data) {
							payload.markets = angular.copy( data );
							shallWeResolve();
						});
				};

				// fetch sources & add to payload
				if ( hasFilter['CHOOSE_SOURCE'] ) {
					this.fetchBookingOrigins()
						.then(function(data) {
							payload.sources = angular.copy( data );
							shallWeResolve();
						});
				};

				// fetch code settings & add to payload
				this.fetchCodeSettings()
					.then(function(data) {
						payload.codeSettings = angular.copy( data );
						shallWeResolve();
					});
			};

			function checkFilters (data) {
				var loadUsersFor = {
                    'Arrival'                : true,
                    'Login and out Activity' : true
                };

                var hasFilter = {};

				_.each(data.results, function(eachResult) {
					if ( ! hasFilter.hasOwnProperty('ACTIVE_USERS') && loadUsersFor[eachResult.title] ) {
						hasFilter['ACTIVE_USERS'] = true;
					};

					_.each(eachResult.filters, function(eachFilter) {

						if ( ! hasFilter.hasOwnProperty('INCLUDE_GUARANTEE_TYPE') && 'INCLUDE_GUARANTEE_TYPE' == eachFilter.value ) {
							hasFilter['INCLUDE_GUARANTEE_TYPE'] = true;
						};

						if ( ! hasFilter.hasOwnProperty('INCLUDE_CHARGE_GROUP') && 'INCLUDE_CHARGE_GROUP' == eachFilter.value ) {
							hasFilter['INCLUDE_CHARGE_GROUP'] = true;
						};

						if ( ! hasFilter.hasOwnProperty('INCLUDE_CHARGE_CODE') && 'INCLUDE_CHARGE_CODE' == eachFilter.value ) {
							hasFilter['INCLUDE_CHARGE_CODE'] = true;
						};

						if ( ! hasFilter.hasOwnProperty('CHOOSE_BOOKING_ORIGIN') && 'CHOOSE_BOOKING_ORIGIN' == eachFilter.value ) {
							hasFilter['CHOOSE_BOOKING_ORIGIN'] = true;
						};

						if ( ! hasFilter.hasOwnProperty('CHOOSE_MARKET') && 'CHOOSE_MARKET' == eachFilter.value ) {
							hasFilter['CHOOSE_MARKET'] = true;
						};

						if ( ! hasFilter.hasOwnProperty('CHOOSE_SOURCE') && 'CHOOSE_SOURCE' == eachFilter.value ) {
							hasFilter['CHOOSE_SOURCE'] = true;
						};
					});
				});

				return hasFilter;
			};
		};





		this.fetchReportList = function() {
			var deferred = $q.defer(),
				url = '/api/reports';

			rvBaseWebSrvV2.getJSON(url)
				.then(function(data) {

					// Support for Occupany from UI for now..
					// This filter will be provided by the API in future
					var occupanyReport = _.where(data.results, { title: 'Occupancy & Revenue Summary' });
					if ( !!occupanyReport && !!occupanyReport.length ) {
						occupanyReport[0].filters.push({
							value: "CHOOSE_MARKET", description: "Choose Market"
						});
					};

					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});

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
