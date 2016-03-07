angular.module('sntRover').service('RVreportsSubSrv', [
	'$q',
	'rvBaseWebSrvV2',
	function($q, rvBaseWebSrvV2) {
		var service = {};

		var store = {};

		service.availInStore = function(key) {
			return !! store.hasOwnProperty(key);
		};

		service.getfromStore = function(key) {
			if ( store.hasOwnProperty(key) ) {
				return store[key];
			} else {
				return false;
			};
		};	

		service.setIntoStore = function(key, value) {
			store[key] = value;
		};

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
				var resolveData;

				if ( !! options.resKey2 && !! options.resKey ) {
					resolveData = data[options.resKey][options.resKey2];
				} else if ( !! options.resKey ) {
					resolveData = data[options.resKey];
				} else {
					resolveData = data;
				};

				// push it into store
				if ( !! options.hasOwnProperty('name') ) {
					service.setIntoStore(options.name, resolveData);
				};

				deferred.resolve( resolveData );
			};

			var failed = function(data) {
				deferred.reject( data || {} );
			};
			
			// if config is incorrect
			if ( ! options.url || ! options.method || ! rvBaseWebSrvV2.hasOwnProperty(options.method) ) {
				failed();
			}

			// if it has been fetched already
			else if( service.availInStore(options.name) ) {
				deferred.resolve( service.getfromStore(options.name) );
			}

			// if there is a request params object
			else if ( !! options.params ) {
				rvBaseWebSrvV2[options.method]( options.url, options.params ).then( success, failed );
			}

			// else simple call
			else {
				rvBaseWebSrvV2[options.method]( options.url ).then( success, failed );
			};

			return deferred.promise;
		};

		service.fetchReportList = function() {
			return callApi({
				name   : 'reportList',
				method : 'getJSON',
				url    : '/api/reports'
			});
		};

		service.fetchReportDetails = function(params) {
			return callApi({
				// no name here since we dont want to cache it in the store ever
				method : 'postJSON',
				url    : '/api/reports/' + params.id + '/submit',
				params : _.omit(params, 'id')
			});
		};

		service.fetchActiveUsers = function() {
			return callApi({
				name   : 'activeUsers',
				method : 'getJSON',
				url    : '/api/users/active'
			});
		};

		service.fetchGuaranteeTypes = function() {
			return callApi({
				name   : 'guaranteeTypes',
				method : 'getJSON',
				url    : '/api/reservation_types.json?is_active=true',
				resKey : 'reservation_types'
			});
		};

		service.fetchChargeNAddonGroups = function() {
			return callApi({
				name   : 'chargeNAddonGroups',
				method : 'getJSON',
				url    : 'api/charge_groups',
				resKey : 'results'
			});
		};

		service.fetchChargeCodes = function() {
			return callApi({
				name   : 'chargeCodes',
				method : 'getJSON',
				url    : 'api/charge_codes?is_get_all_charge_codes=true',
				resKey : 'results'
			});
		};

		service.fetchAddons = function (params) {
			return callApi({
				name   : 'addons',
				method : 'postJSON',
				url    : 'api/addons/detail',
				params : params,
				resKey : 'results'
			});
		};

		service.fetchMarkets = function(params) {
			return callApi({
				name   : 'markets',
				method : 'getJSON',
				url    : '/api/market_segments?is_active=true',
				resKey : 'markets'
			});
		};

		service.fetchSources = function() {
			return callApi({
				name   : 'sources',
				method : 'getJSON',
				url    : 'api/sources?is_active=true',
				resKey : 'sources'
			});
		};

		service.fetchBookingOrigins = function() {
			return callApi({
				name   : 'bookingOrigins',
				method : 'getJSON',
				url    : 'api/booking_origins?is_active=true',
				resKey : 'booking_origins'
			});
		};

		service.fetchCodeSettings = function() {
			return callApi({
				name   : 'codeSettings',
				method : 'getJSON',
				url    : '/api/reports/code_settings'
			});
		};

		service.fetchComTaGrp = function(query, exclude_groups) {
			var urlPrams = '?query=' + query;

			if (exclude_groups) {
				urlPrams += '&exclude_groups=true';
			};

			return callApi({
				// no name here since we dont want to cache it in the store ever
				method : 'getJSON',
				url    : 'api/reports/search_by_company_agent_group' + urlPrams,
				resKey : 'results'
			});
		};

		service.fetchHoldStatus = function() {
			return callApi({
				name    : 'holdStatus',
				method  : 'getJSON',
				url     : 'api/group_hold_statuses',
				resKey  : 'data',
				resKey2 : 'hold_status'
			});
		};

		service.fetchReservationStatus = function() {
			return callApi({
				name   : 'reservationStatus',
				method : 'getJSON',
				url    : 'api/reservations/status',
				resKey : 'reservation_status'
			});
		};

		service.fetchAddonReservations = function(params) {
			return callApi({
				name   : 'addonReservations',
				method : 'getJSON',
				url    : '/api/reports/' + params.id + '/addon_reservations',
				params : _.omit(params, 'id'),
				resKey : 'results',
			});
		};

		service.fetchRateTypesAndRateList = function(params) {
			return callApi({
				name   : 'rateTypeAndRateList',
				method : 'getJSON',
				url    : '/api/rates/active',
				resKey : 'rates',
                params : {
                    include_custom_rates: true //This service is used ONLY for the Daily Production Rate Report Filters & hence this param is added to the request
                }
			});
		};

		service.fetchRateCode = function(params) {
			return callApi({
				name   : 'rateCodeList',
				method : 'getJSON',
				url    : '/api/rates/codes',
				resKey : 'rate_codes',
			});
		};

		service.fetchRoomTypeList = function(params) {
			return callApi({
				name   : 'roomTypeList',
				method : 'getJSON',
				url    : '/api/room_types.json?is_exclude_pseudo=true',
				resKey : 'results'
			});
		};

		service.fetchRestrictionList = function() {
			return callApi({
				name   : 'restrictionList',
				method : 'getJSON',
				url    : '/api/restriction_types?is_activated=true',
				resKey : 'results'
			});			
		};
		return service;
	}
]);