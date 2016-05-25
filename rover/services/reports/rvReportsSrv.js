angular.module('sntRover').service('RVreportsSrv', [
	'$q',
	'rvBaseWebSrvV2',
	'RVreportsSubSrv',
	'$vault',
	'$http',
	function($q, rvBaseWebSrvV2, subSrv, $vault, $http) {
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
		}

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

		service.exportCSV = function(params){
			var deferred = $q.defer();
			$http({
				method: 'POST', 
				url: params.url, 
				data: params.payload
			}).success(function(data, status, headers, config) {
                 var hiddenAnchor = angular.element('<a/>');
			     hiddenAnchor.attr({
			         href: 'data:attachment/csv;charset=utf-8,' + encodeURI(data),
			         target: '_blank',
			         download: headers()['content-disposition'].match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)[1].replace(/['"]+/g, '')
			     })[0].click();
			     deferred.resolve(true);
            }).error(function(errorMessage) {
                deferred.reject(errorMessage);
            });
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
			var payload   = {},
				hasFilter = checkUserFilters( data );

			var shallWeResolve = function() {
				var payloadCount = _.keys( payload ).length;
				if ( payloadCount === 3 ) {

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
				subSrv.fetchActiveUsers()
					.then( success.bind(null, 'activeUserList'), failed.bind(null, 'activeUserList', []) );
			};
		};

		/**
		 * parse report list data to determine the additional apis to load
		 * @param  {Object} data report list data
		 * @return {Object}      key value pairs with 'true' value
		 * @private
		 */
		function checkUserFilters (data) {
			var loadUsersFor = {
                'Arrival'                : true,
                'Login and out Activity' : true,
                'Rate Adjustment Report' : true,
                'Financial Transactions - Adjustment Report': true
            };

            var hasFilter = {};

			_.each(data.results, function(eachResult) {
				if ( ! hasFilter.hasOwnProperty('ACTIVE_USERS') && loadUsersFor[eachResult.title] ) {
					hasFilter['ACTIVE_USERS'] = true;
				};
			});

			return hasFilter;
		};

		service.reportSchedulesPayload = function() {
			var deferred = $q.defer(),
				payload = {};

			var shallWeResolve = function() {
				var payloadCount = _.keys( payload ).length;
				if ( payloadCount === 3 ) {
					deferred.resolve( payload );
				}
			};

			var success = function(key, data) {
				payload[key] = angular.copy( data );
				shallWeResolve();
			};

			var failed = function(key, emptyData, data) {
				payload[key] = emptyData;
				shallWeResolve();
			};

			subSrv.fetchSchedules()
				.then( success.bind(null, 'schedulesList'), failed.bind(null, 'schedulesList', []) );

			subSrv.fetchScheduleFrequency()
				.then( success.bind(null, 'scheduleFrequency'), failed.bind(null, 'scheduleFrequency', []) );

			subSrv.fetchTimePeriods()
				.then( success.bind(null, 'scheduleTimePeriods'), failed.bind(null, 'scheduleTimePeriods', []) );

			return deferred.promise;
		};

		service.fetchOneSchedule = function(params) {
			var deferred = $q.defer(),
				url = 'admin/export_schedules/' + params.id;

			var success = function(data) {
				deferred.resolve(data);
			};

			var failed = function(error) {
				deferred.reject( error );
			};

			rvBaseWebSrvV2
				.getJSON( url )
				.then( success, failed );

			return deferred.promise;
		};

		service.updateSchedule = function(params) {
			var deferred = $q.defer(),
				url = 'admin/export_schedules/' + params.id;

			var success = function(data) {
				deferred.resolve(data);
			};

			var failed = function(error) {
				deferred.reject( error );
			};

			rvBaseWebSrvV2
				.putJSON( url, params )
				.then( success, failed );

			return deferred.promise;
		};

		return service;
	}
]);
