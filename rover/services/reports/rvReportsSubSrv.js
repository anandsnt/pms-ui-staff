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