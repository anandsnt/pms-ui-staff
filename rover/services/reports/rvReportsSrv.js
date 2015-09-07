sntRover.service('RVreportsSrv', [
	'$q',
	'rvBaseWebSrvV2',
	'RVreportsSubSrv',
	'$vault',
	function($q, rvBaseWebSrvV2, subSrv, $vault) {
		var service       = {},
			choosenReport = {};

		var cacheKey = 'REPORT_PAYLOAD_CACHE';

		/** @type {Sting} since $value only allow to keep type Numbers and Strings */
		service.payloadCache = $vault.get( cacheKey );

		// making sure the data type of
		// 'payloadCache' sets to an object
		if ( !! service.payloadCache ) {
			service.payloadCache = JSON.parse( service.payloadCache );
		} else {
			service.payloadCache = {};
		};

		/**
		 * save the chosen report object in here
		 * @param {Object} item
		 */
		service.setChoosenReport = function(item) {
			choosenReport = item;
		};

		/**
		 * return the chosen report object
		 * @return {Object}
		 */
		service.getChoosenReport = function() {
			return choosenReport;
		};

		/**
		 * this method first load the report list
		 * then parse to determine the additional apis to load
		 * the deferred is only resolved when all the additional apis are loaded
		 * @return {Object} the promise object
		 */
		service.reportApiPayload = function() {
			var deferred = $q.defer();

			var failed = function(data) {
				deferred.reject(data);
			};

			// we are passing down the deferred to the
			// success callback, so that he can call deferred.resolve
			// @todo: debug if closure created due to passed deferred, cause memory leaks
			subSrv.fetchReportList()
				.then( fetchAdditionalAPIs.bind(null, deferred), failed );

			return deferred.promise;
		};

		/**
		 * load any additional apis to load and
		 * resolve deferred when all apis have been loaded.
		 * deferred when resolved on the router will be provided with the
		 * payload of all the api data as an object
		 * @param  {Object} deferred passed down deferred object
		 * @param  {Object} data     response of the report list api
		 * @private
		 */
		function fetchAdditionalAPIs (deferred, data) {
			console.log(data);
			var payload   = {},
				hasFilter = checkFilters( data );

			var shallWeResolve = function() {
				var filters  = _.keys( hasFilter ).length,
					payloads = _.keys( payload ).length;

				// since payload will have two additional keys
				// 'reportsResponse' and 'codeSettings'
				if ( payloads - filters === 2 ) {

					// save it to $vault
					service.payloadCache = angular.copy( payload );
					$vault.set( cacheKey, JSON.stringify(service.payloadCache) );

					deferred.resolve( payload );
				};
			};

			var success = function(key, data) {
				payload[key] = angular.copy( data );
				shallWeResolve();
			};

			var failed = function(key, emptyData, data) {
				payload[key] = emptyData;
				shallWeResolve();
			};

			// add report list data to payload
			payload.reportsResponse = angular.copy( data );

			// fetch code settings & add to payload
			subSrv.fetchCodeSettings()
				.then( success.bind(null, 'codeSettings'), failed.bind(null, 'codeSettings', {}) );

			// fetch active users & add to payload
			if ( hasFilter['ACTIVE_USERS'] ) {
				if ( service.payloadCache.hasOwnProperty('activeUserList') ) {
					success( 'activeUserList', service.payloadCache.activeUserList );
				} else {
					subSrv.fetchActiveUsers()
						.then( success.bind(null, 'activeUserList'), failed.bind(null, 'activeUserList', []) );
				};
			};

			// fetch gurantee types & add to payload
			if ( hasFilter['INCLUDE_GUARANTEE_TYPE'] ) {
				if ( service.payloadCache.hasOwnProperty('guaranteeTypes') ) {
					success( 'guaranteeTypes', service.payloadCache.guaranteeTypes );
				} else {
					subSrv.fetchGuaranteeTypes()
						.then( success.bind(null, 'guaranteeTypes'), failed.bind(null, 'guaranteeTypes', []) );
				};
			};

			// fetch charge groups & add to payload
			if ( hasFilter['INCLUDE_CHARGE_GROUP'] ) {
				subSrv.fetchChargeGroups()
					.then( success.bind(null, 'chargeGroups'), failed.bind(null, 'chargeGroups', []) );
			};

			// fetch charge groups & add to payload
			if ( hasFilter['INCLUDE_CHARGE_CODE'] ) {
				subSrv.fetchChargeCodes()
					.then( success.bind(null, 'chargeCodes'), failed.bind(null, 'chargeCodes', []) );
			};

			// fetch markers & add to payload
			if ( hasFilter['CHOOSE_MARKET'] ) {
				if ( service.payloadCache.hasOwnProperty('markets') ) {
					success( 'markets', service.payloadCache.origins );
				} else {
					subSrv.fetchMarkets()
						.then( success.bind(null, 'markets'), failed.bind(null, 'markets', []) );
				};
			};

			// fetch sources & add to payload
			if ( hasFilter['CHOOSE_SOURCE'] ) {
				if ( service.payloadCache.hasOwnProperty('sources') ) {
					success( 'sources', service.payloadCache.sources );
				} else {
					subSrv.fetchSources()
						.then( success.bind(null, 'sources'), failed.bind(null, 'sources', []) );
				};
			};

			// fetch booking origins & add to payload
			if ( hasFilter['CHOOSE_BOOKING_ORIGIN'] ) {
				if ( service.payloadCache.hasOwnProperty('origins') ) {
					success( 'origins', service.payloadCache.origins );
				} else {
					subSrv.fetchBookingOrigins()
						.then( success.bind(null, 'origins'), failed.bind(null, 'origins', []) );
				};
			};

			// fetch hold status & add to payload
			if ( hasFilter['HOLD_STATUS'] ) {
				if ( service.payloadCache.hasOwnProperty('holdStatus') ) {
					success( 'holdStatus', service.payloadCache.holdStatus );
				} else {
					subSrv.fetchHoldStatus()
						.then( success.bind(null, 'holdStatus'), failed.bind(null, 'holdStatus', []) );
				};
			};

			// fetch addon groups & add to payload
			if ( hasFilter['ADDON_GROUPS'] ) {
				if ( service.payloadCache.hasOwnProperty('addonGroups') ) {
					success( 'addonGroups', service.payloadCache.addonGroups );
				} else {
					subSrv.fetchAddonGroups()
						.then( success.bind(null, 'addonGroups'), failed.bind(null, 'addonGroups', []) );
				};
			};

			// fetch reservation status & add to payload
			if ( hasFilter['RESERVATION_STATUS'] ) {
				if ( service.payloadCache.hasOwnProperty('reservationStatus') ) {
					success( 'reservationStatus', service.payloadCache.addons );
				} else {
					subSrv.fetchReservationStatus()
						.then( success.bind(null, 'reservationStatus'), failed.bind(null, 'reservationStatus', []) );
				};
			};

		};

		/**
		 * parse report list data to determine the additional apis to load
		 * @param  {Object} data report list data
		 * @return {Object}      key value pairs with 'true' value
		 * @private
		 */
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

					if ( ! hasFilter.hasOwnProperty('INCLUDE_GUARANTEE_TYPE') && 'INCLUDE_GUARANTEE_TYPE' === eachFilter.value ) {
						hasFilter['INCLUDE_GUARANTEE_TYPE'] = true;
					};

					if ( ! hasFilter.hasOwnProperty('INCLUDE_CHARGE_GROUP') && 'INCLUDE_CHARGE_GROUP' === eachFilter.value ) {
						hasFilter['INCLUDE_CHARGE_GROUP'] = true;
					};

					if ( ! hasFilter.hasOwnProperty('INCLUDE_CHARGE_CODE') && 'INCLUDE_CHARGE_CODE' === eachFilter.value ) {
						hasFilter['INCLUDE_CHARGE_CODE'] = true;
					};

					if ( ! hasFilter.hasOwnProperty('CHOOSE_MARKET') && 'CHOOSE_MARKET' === eachFilter.value ) {
						hasFilter['CHOOSE_MARKET'] = true;
					};

					if ( ! hasFilter.hasOwnProperty('CHOOSE_SOURCE') && 'CHOOSE_SOURCE' === eachFilter.value ) {
						hasFilter['CHOOSE_SOURCE'] = true;
					};

					if ( ! hasFilter.hasOwnProperty('CHOOSE_BOOKING_ORIGIN') && 'CHOOSE_BOOKING_ORIGIN' === eachFilter.value ) {
						hasFilter['CHOOSE_BOOKING_ORIGIN'] = true;
					};

					if ( ! hasFilter.hasOwnProperty('HOLD_STATUS') && 'HOLD_STATUS' == eachFilter.value ) {
						hasFilter['HOLD_STATUS'] = true;
					};

					if ( ! hasFilter.hasOwnProperty('ADDON_GROUPS') && 'ADDON_GROUPS' == eachFilter.value ) {
						hasFilter['ADDON_GROUPS'] = true;
					};

					if ( ! hasFilter.hasOwnProperty('RESERVATION_STATUS') && 'RESERVATION_STATUS' == eachFilter.value ) {
						hasFilter['RESERVATION_STATUS'] = true;
					};

				});
			});

			return hasFilter;
		};

		return service;
	}
]);
