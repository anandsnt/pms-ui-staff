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

				/** TEST CODE REMOVED WHEN THE API IS READY */
				if ( '/api/reports' == options.url ) {
					data.results.push({
						id: 2344,
						description: "Rooms Picked up by Group",
						sub_title: "By group",
						title: "Group Pick Up Report",
						filters: [{
							description: "Date Range", 
							value: "DATE_RANGE"
						}, {
							description: "Hold Status", 
							value: "HOLD_STATUS"
						}],
						sort_fields: [{
							value: "DATE", description: "Date"
						}, {
							value: "GROUP_NAME", description: "Group Name"
						}, {
							value: "HOLD_STATUS", description: "Hold Status"
						}, {
							value: "PICKUP_PERCENTAGE", description: "Pickup Percentage"
						}],
						group_fields: [{
							value: "GROUP_NAME", description: "Group Name"
						}]
					});
				};
				/** TEST CODE REMOVED WHEN THE API IS READY */
				
				if ( !! options.resKey ) {
					deferred.resolve( data[options.resKey] );
				} else {
					deferred.resolve( data );
				};
			};

			var failed = function(data) {
				deferred.reject( data || {} );
			};


			/** TEST CODE REMOVED WHEN THE API IS READY */
			if ( 'api/hold_status?is_active=true' == options.url ) {
				success([{
					id: 1,
					description: 'Hold This'
				}, {
					id: 2,
					description: 'Hold That'
				}, {
					id: 3,
					description: 'Hold Something Else'
				}]);
			} else if ( ! options.url || ! options.method || ! rvBaseWebSrvV2.hasOwnProperty(options.method) ) {
			/** TEST CODE REMOVED WHEN THE API IS READY */

			/** ORIGNIAL CODE, UNCOMMENT BEFORE QA */
			// if ( ! options.url || ! options.method || ! rvBaseWebSrvV2.hasOwnProperty(options.method) ) {
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

		service.fetchChargeGroups = function() {
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
				method : 'getJSON',
				url    : 'api/hold_status?is_active=true'
			});
		};

		return service;
	}
]);