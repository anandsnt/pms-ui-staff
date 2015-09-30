sntRover.service('RVreportsSubSrv', [
	'$q',
	'rvBaseWebSrvV2',
	function($q, rvBaseWebSrvV2) {
		var service = {};

		/**
		 * centralised method for making api request and managing promises
		 * the only reason I end up created this is to avoid code repetition
		 * in the below service methods
		 * @param  {Object} options {method on 'rvBaseWebSrvV2', request params, request url, response key}
		 * @return {Object}         a promise object, which when resolved/rejected will return the data
		 * @private
		 */
		var callApi = function(options) {
			var deferred = $q.defer();

			var success = function(data) {
				if ( !! options.resKey2 && !! options.resKey ) {
					deferred.resolve( data[options.resKey][options.resKey2] );
				} else if ( !! options.resKey ) {
					deferred.resolve( data[options.resKey] );
				} else {
					deferred.resolve( data );
				};
			};

			var failed = function(data) {

				// TEST CODE, REMOVE BEFORE MERGE
				if ( options.url.indexOf('/submit') ) {
					deferred.resolve({
						results: winResult
					});
					return
				};
				// TEST CODE, REMOVE BEFORE MERGE

				deferred.reject( data || {} );
			};
			
			if ( ! options.url || ! options.method || ! rvBaseWebSrvV2.hasOwnProperty(options.method) ) {
				failed();
			} else if ( !! options.params ) {
				rvBaseWebSrvV2[options.method]( options.url, options.params ).then( success, failed );
			} else {
				rvBaseWebSrvV2[options.method]( options.url ).then( success, failed );
			};

			return deferred.promise;
		};

		service.fetchReportList = function() {
			return callApi({
				method : 'getJSON',
				url    : '/api/reports'
			});
		};

		service.fetchReportDetails = function(params) {
			return callApi({
				method : 'getJSON',
				url    : '/api/reports/' + params.id + '/submit',
				params : _.omit(params, 'id')
			});
		};

		service.fetchActiveUsers = function() {
			return callApi({
				method : 'getJSON',
				url    : '/api/users/active'
			});
		};

		service.fetchGuaranteeTypes = function() {
			return callApi({
				method : 'getJSON',
				url    : '/api/reservation_types.json?is_active=true',
				resKey : 'reservation_types'
			});
		};

		service.fetchChargeNAddonGroups = function() {
			return callApi({
				method : 'getJSON',
				url    : 'api/charge_groups',
				resKey : 'results'
			});
		};

		service.fetchChargeCodes = function() {
			return callApi({
				method : 'getJSON',
				url    : 'api/charge_codes?is_get_all_charge_codes=true',
				resKey : 'results'
			});
		};

		service.fetchAddons = function (params) {
			return callApi({
				method  : 'postJSON',
				url     : 'api/addons/detail',
				params  : params,
				resKey  : 'results'
			});
		};

		service.fetchMarkets = function(params) {
			return callApi({
				method : 'getJSON',
				url    : '/api/market_segments?is_active=true',
				resKey : 'markets'
			});
		};

		service.fetchSources = function() {
			return callApi({
				method : 'getJSON',
				url    : 'api/sources?is_active=true',
				resKey : 'sources'
			});
		};

		service.fetchBookingOrigins = function() {
			return callApi({
				method : 'getJSON',
				url    : 'api/booking_origins?is_active=true',
				resKey : 'booking_origins'
			});
		};

		service.fetchCodeSettings = function() {
			return callApi({
				method : 'getJSON',
				url    : '/api/reports/code_settings'
			});
		};

		service.fetchComTaGrp = function(query) {
			return callApi({
				method : 'getJSON',
				url    : 'api/reports/search_by_company_agent_group?query=' + query,
				resKey : 'results'
			});
		};

		service.fetchHoldStatus = function() {
			return callApi({
				method  : 'getJSON',
				url     : 'api/group_hold_statuses',
				resKey  : 'data',
				resKey2 : 'hold_status'
			});
		};

		service.fetchReservationStatus = function() {
			return callApi({
				method  : 'getJSON',
				url     : 'api/reservations/status',
				resKey  : 'reservation_status'
			});
		};

		service.fetchAddonReservations = function(params) {
			return callApi({
				method : 'getJSON',
				url    : '/api/reports/' + params.id + '/addon_reservations',
				params : _.omit(params, 'id'),
				resKey : 'results',
			});
		};

		return service;
	}
]);

window.winResult = {
	'Bunk': {
		'2015-07-12': {
			'available_rooms_count': 1,
			'total_rooms_count': 2,
			'rate_revenue': 3,
			'adr': 4,
			'actual_revenue': 5
		},
		'2015-07-13': {
			'available_rooms_count': 6,
			'total_rooms_count': 7,
			'rate_revenue': 8,
			'adr': 9,
			'actual_revenue': 10
		},
		'2015-07-14': {
			'available_rooms_count': 6,
			'total_rooms_count': 7,
			'rate_revenue': 8,
			'adr': 9,
			'actual_revenue': 10
		},
		'2015-07-15': {
			'available_rooms_count': 6,
			'total_rooms_count': 7,
			'rate_revenue': 8,
			'adr': 9,
			'actual_revenue': 10
		}
	},
	'Classic View': {
		'2015-07-12': {
			'available_rooms_count': 11,
			'total_rooms_count': 12,
			'rate_revenue': 13,
			'adr': 14,
			'actual_revenue': 15
		},
		'2015-07-13': {
			'available_rooms_count': 16,
			'total_rooms_count': 17,
			'rate_revenue': 18,
			'adr': 19,
			'actual_revenue': 20
		},
		'2015-07-14': {
			'available_rooms_count': 6,
			'total_rooms_count': 7,
			'rate_revenue': 8,
			'adr': 9,
			'actual_revenue': 10
		},
		'2015-07-15': {
			'available_rooms_count': 6,
			'total_rooms_count': 7,
			'rate_revenue': 8,
			'adr': 9,
			'actual_revenue': 10
		}
	},
	'MyRoom': {
		'2015-07-12': {
			'available_rooms_count': 1,
			'total_rooms_count': 2,
			'rate_revenue': 3,
			'adr': 4,
			'actual_revenue': 5
		},
		'2015-07-13': {
			'available_rooms_count': 6,
			'total_rooms_count': 7,
			'rate_revenue': 8,
			'adr': 9,
			'actual_revenue': 10
		},
		'2015-07-14': {
			'available_rooms_count': 6,
			'total_rooms_count': 7,
			'rate_revenue': 8,
			'adr': 9,
			'actual_revenue': 10
		},
		'2015-07-15': {
			'available_rooms_count': 6,
			'total_rooms_count': 7,
			'rate_revenue': 8,
			'adr': 9,
			'actual_revenue': 10
		}
	},
	'HisRoom': {
		'2015-07-12': {
			'available_rooms_count': 1,
			'total_rooms_count': 2,
			'rate_revenue': 3,
			'adr': 4,
			'actual_revenue': 5
		},
		'2015-07-13': {
			'available_rooms_count': 6,
			'total_rooms_count': 7,
			'rate_revenue': 8,
			'adr': 9,
			'actual_revenue': 10
		},
		'2015-07-14': {
			'available_rooms_count': 6,
			'total_rooms_count': 7,
			'rate_revenue': 8,
			'adr': 9,
			'actual_revenue': 10
		},
		'2015-07-15': {
			'available_rooms_count': 6,
			'total_rooms_count': 7,
			'rate_revenue': 8,
			'adr': 9,
			'actual_revenue': 10
		}
	},
	'HerRoom': {
		'2015-07-12': {
			'available_rooms_count': 1,
			'total_rooms_count': 2,
			'rate_revenue': 3,
			'adr': 4,
			'actual_revenue': 5
		},
		'2015-07-13': {
			'available_rooms_count': 6,
			'total_rooms_count': 7,
			'rate_revenue': 8,
			'adr': 9,
			'actual_revenue': 10
		},
		'2015-07-14': {
			'available_rooms_count': 6,
			'total_rooms_count': 7,
			'rate_revenue': 8,
			'adr': 9,
			'actual_revenue': 10
		},
		'2015-07-15': {
			'available_rooms_count': 6,
			'total_rooms_count': 7,
			'rate_revenue': 8,
			'adr': 9,
			'actual_revenue': 10
		}
	},
	'TheirRoom': {
		'2015-07-12': {
			'available_rooms_count': 1,
			'total_rooms_count': 2,
			'rate_revenue': 3,
			'adr': 4,
			'actual_revenue': 5
		},
		'2015-07-13': {
			'available_rooms_count': 6,
			'total_rooms_count': 7,
			'rate_revenue': 8,
			'adr': 9,
			'actual_revenue': 10
		},
		'2015-07-14': {
			'available_rooms_count': 6,
			'total_rooms_count': 7,
			'rate_revenue': 8,
			'adr': 9,
			'actual_revenue': 10
		},
		'2015-07-15': {
			'available_rooms_count': 6,
			'total_rooms_count': 7,
			'rate_revenue': 8,
			'adr': 9,
			'actual_revenue': 10
		}
	},
	'Tom\'s Room': {
		'2015-07-12': {
			'available_rooms_count': 1,
			'total_rooms_count': 2,
			'rate_revenue': 3,
			'adr': 4,
			'actual_revenue': 5
		},
		'2015-07-13': {
			'available_rooms_count': 6,
			'total_rooms_count': 7,
			'rate_revenue': 8,
			'adr': 9,
			'actual_revenue': 10
		},
		'2015-07-14': {
			'available_rooms_count': 6,
			'total_rooms_count': 7,
			'rate_revenue': 8,
			'adr': 9,
			'actual_revenue': 10
		},
		'2015-07-15': {
			'available_rooms_count': 6,
			'total_rooms_count': 7,
			'rate_revenue': 8,
			'adr': 9,
			'actual_revenue': 10
		}
	},
	'Jerry\'s Room': {
		'2015-07-12': {
			'available_rooms_count': 1,
			'total_rooms_count': 2,
			'rate_revenue': 3,
			'adr': 4,
			'actual_revenue': 5
		},
		'2015-07-13': {
			'available_rooms_count': 6,
			'total_rooms_count': 7,
			'rate_revenue': 8,
			'adr': 9,
			'actual_revenue': 10
		},
		'2015-07-14': {
			'available_rooms_count': 6,
			'total_rooms_count': 7,
			'rate_revenue': 8,
			'adr': 9,
			'actual_revenue': 10
		},
		'2015-07-15': {
			'available_rooms_count': 6,
			'total_rooms_count': 7,
			'rate_revenue': 8,
			'adr': 9,
			'actual_revenue': 10
		}
	},
	'Donal\'s Room': {
		'2015-07-12': {
			'available_rooms_count': 1,
			'total_rooms_count': 2,
			'rate_revenue': 3,
			'adr': 4,
			'actual_revenue': 5
		},
		'2015-07-13': {
			'available_rooms_count': 6,
			'total_rooms_count': 7,
			'rate_revenue': 8,
			'adr': 9,
			'actual_revenue': 10
		},
		'2015-07-14': {
			'available_rooms_count': 6,
			'total_rooms_count': 7,
			'rate_revenue': 8,
			'adr': 9,
			'actual_revenue': 10
		},
		'2015-07-15': {
			'available_rooms_count': 6,
			'total_rooms_count': 7,
			'rate_revenue': 8,
			'adr': 9,
			'actual_revenue': 10
		}
	},
	'Total': {
		'2015-07-12': {
			'available_rooms_count': 21,
			'total_rooms_count': 22,
			'rate_revenue': 23,
			'adr': 24,
			'actual_revenue': 25
		},
		'2015-07-13': {
			'available_rooms_count': 26,
			'total_rooms_count': 27,
			'rate_revenue': 28,
			'adr': 29,
			'actual_revenue': 30
		},
		'2015-07-14': {
			'available_rooms_count': 6,
			'total_rooms_count': 7,
			'rate_revenue': 8,
			'adr': 9,
			'actual_revenue': 10
		},
		'2015-07-15': {
			'available_rooms_count': 6,
			'total_rooms_count': 7,
			'rate_revenue': 8,
			'adr': 9,
			'actual_revenue': 10
		}
	}
}