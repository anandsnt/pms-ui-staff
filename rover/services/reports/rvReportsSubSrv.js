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
			if ( '/api/reports/2344/submit' == options.url ) {
				success({
					results: [{
						'group_name' : 'Star Alliance Conference',
						'group_code' : '957650283',
						'group_data' : [{
							'date'                   : '2015-06-30',
							'hold_status'            : 'CANCEL',
							'room_type'              : 'STANDARD ROOM',
							'rooms_available'        : 12,
							'rooms_held_non_deduct'  : 13,
							'rooms_held_deduct'      : 14,
							'rooms_held_picked_up'   : 15,
							'pickup_percentage'      : 10
						}, {
							'date'                   : '2015-06-30',
							'hold_status'            : 'TENTATIVE',
							'room_type'              : 'DELUX ROOM',
							'rooms_available'        : 12,
							'rooms_held_non_deduct'  : 13,
							'rooms_held_deduct'      : 14,
							'rooms_held_picked_up'   : 15,
							'pickup_percentage'      : 10
						}],
						'group_total' : {
							'rooms_available'       : 123,
							'rooms_held_non_deduct' : 231,
							'rooms_held_deduct'     : 21,
							'rooms_held_picked_up'  : 34,
							'pickup_percentage'     : 37
						}
					}, {
						'group_name' : 'HEWLETT-PACKARD CONFERENCE',
						'group_code' : '9576563283',
						'group_data' : [{
							'date'                  : '2015-05-01',
							'hold_status'           : 'CANCEL',
							'room_type'             : 'KING SUIT',
							'rooms_available'       : 15,
							'rooms_held_non_deduct' : 16,
							'rooms_held_deduct'     : 17,
							'rooms_held_picked_up'  : 18,
							'pickup_percentage'     : 19
						}, {
							'date'                  : '2015-05-01',
							'hold_status'           : 'TENTATIVE',
							'room_type'             : 'STANDARD DOUBLE',
							'rooms_available'       : 15,
							'rooms_held_non_deduct' : 16,
							'rooms_held_deduct'     : 17,
							'rooms_held_picked_up'  : 18,
							'pickup_percentage'     : 19
						}],
						'group_total' : {
							'rooms_available'       : 123,
							'rooms_held_non_deduct' : 231,
							'rooms_held_deduct'     : 21,
							'rooms_held_picked_up'  : 34,
							'pickup_percentage'     : 37
						}
					}],
					sub_headers: ["Group", "Date", "Status", "Room Type", "Room Avl.", "Non-Deduct", "Deduct", "Picked up", "%"],
					summary_counts: {},
					total_count: 2
				});
			};
			/** TEST CODE REMOVED WHEN THE API IS READY */


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