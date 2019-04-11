angular.module('sntRover').service('RVreportsSrv', [
	'$q',
	'rvBaseWebSrvV2',
	'RVreportsSubSrv',
	'$vault',
	'$http',
	'RVReportApplyFlags',
    'RVReportUtilsFac',
    'RVReportSetupDates',
	function($q, rvBaseWebSrvV2, subSrv, $vault, $http, applyFlags, reportUtils, setupDates) {
		var service       = {},
			choosenReport = {},
			printClicked = false;

		var SCHEDULE_TYPES = {
			SCHEDULE_REPORT: 'SCHEDULE_REPORT',
			EXPORT_SCHEDULE: 'EXPORT_SCHEDULE'
		}

        var REPORT_EXPORT_TIME_PERIODS = {
            'Nationality Statistics': [
                'LAST_MONTH',
                'LAST_JANUARY',
                'LAST_FEBRUARY',
                'LAST_MARCH',
                'LAST_APRIL',
                'LAST_MAY',
                'LAST_JUNE',
                'LAST_JULY',
                'LAST_AUGUST',
                'LAST_SEPTEMBER',
                'LAST_OCTOBER',
                'LAST_NOVEMBER',
                'LAST_DECEMBER'
             ],
             'Financial Transactions': [
                'YESTERDAY'
             ],
             'Stash Rewards Membership Export': [
                'YESTERDAY'
             ],
             'Reservations': [
                'YESTERDAY'
             ],
						 'Synxis - Reservations': [
                'YESTERDAY'
             ],
             'Rooms': [
                'TODAY'
             ],
             'Future Reservations': [
                'TODAY'
             ],
						 'Synxis - Upcoming Reservation Export (Future Reservation Export)': [
                'TODAY'
             ],
             'Last Week Reservations': [
                'LAST_SEVEN_DAYS'
             ],
             'Past Reservations - Monthly': [
                'ALL',
                'LAST_MONTH',
                'LAST_JANUARY',
                'LAST_FEBRUARY',
                'LAST_MARCH',
                'LAST_APRIL',
                'LAST_MAY',
                'LAST_JUNE',
                'LAST_JULY',
                'LAST_AUGUST',
                'LAST_SEPTEMBER',
                'LAST_OCTOBER',
                'LAST_NOVEMBER',
                'LAST_DECEMBER'
             ],
             'Commissions': [
             	'ALL',
             	'LAST_MONTH',
                'LAST_JANUARY',
                'LAST_FEBRUARY',
                'LAST_MARCH',
                'LAST_APRIL',
                'LAST_MAY',
                'LAST_JUNE',
                'LAST_JULY',
                'LAST_AUGUST',
                'LAST_SEPTEMBER',
                'LAST_OCTOBER',
                'LAST_NOVEMBER',
                'LAST_DECEMBER'
             ],
             'Journal Export': [
                'YESTERDAY',
                'TODAY',
                'DATE'
             ],
             'Clairvoyix Stays Export': [
             	'YESTERDAY',
             	'ALL'
             ],
             'Clairvoyix Reservations Export': [
                'TODAY'
             ],
             'Police Report Export': [
				'TODAY'
			 ],
			 'Belgium Nationality Export': [
				'LAST_MONTH',
                'LAST_JANUARY',
                'LAST_FEBRUARY',
                'LAST_MARCH',
                'LAST_APRIL',
                'LAST_MAY',
                'LAST_JUNE',
                'LAST_JULY',
                'LAST_AUGUST',
                'LAST_SEPTEMBER',
                'LAST_OCTOBER',
                'LAST_NOVEMBER',
                'LAST_DECEMBER' 
			 ]
        };

        var SCHEDULE_REPORT_TIMEPERIODS = {
        	'Arrival': [
        		'TODAY',
        		'TOMORROW'
        	 ],
        	 'Departure': [
        		'TODAY',
        		'TOMORROW'
        	 ],
        	 'In-House Guests': [
        		'TODAY',
        		'TOMORROW'
        	 ],
        	 'Comparison': ['YESTERDAY'],
        	 'Guest Balance Report': ['ALL']
        };

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

		service.exportCSV = function(params) {
			var deferred = $q.defer();

			$http({
				method: 'POST',
				url: params.url,
				data: params.payload
			}).then(function(response) {
				var data = response.data,
					headers = response.headers;

                 var hiddenAnchor = angular.element('<a/>'),
                 	blob = new Blob([data]);

			     hiddenAnchor.attr({
			         href: window.URL.createObjectURL(blob),
			         target: '_blank',
			         download: headers()['content-disposition'].match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)[1].replace(/['"]+/g, '')
			     })[0].click();
			     deferred.resolve(true);
            },function(response) {
                deferred.reject(response.data);
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

			// add report list data to payload
			payload.reportsResponse = angular.copy( data );

			// fetch code settings & add to payload
			subSrv.fetchCodeSettings()
				.then( success.bind(null, 'codeSettings'), failed.bind(null, 'codeSettings', {}) );

			// fetch active users & add to payload
			if ( hasFilter['ACTIVE_USERS'] ) {
				subSrv.fetchActiveUsers()
					.then( success.bind(null, 'activeUserList'), failed.bind(null, 'activeUserList', []) );
			}
		}

		/**
		 * parse report list data to determine the additional apis to load
		 * @param  {Object} data report list data
		 * @return {Object}      key value pairs with 'true' value
		 * @private
		 */
		function checkUserFilters (data) {
			var loadUsersFor = {
                'Arrival': true,
                'Login and out Activity': true,
                'Rate Adjustment Report': true,
                'Financial Transactions - Adjustment Report': true
            };

            var hasFilter = {};

			_.each(data.results, function(eachResult) {
				if ( ! hasFilter.hasOwnProperty('ACTIVE_USERS') && loadUsersFor[eachResult.title] ) {
					hasFilter['ACTIVE_USERS'] = true;
				}
			});

			return hasFilter;
		}

		function schedulePayloadGenerator (type) {
			var deferred = $q.defer(),
				payload = {},
				apiCount = type === SCHEDULE_TYPES.SCHEDULE_REPORT ? 5 : 7,
				exportOnly = type === SCHEDULE_TYPES.EXPORT_SCHEDULE ? true : false;

			var shallWeResolve = function() {
				var payloadCount = _.keys( payload ).length;

				if ( payloadCount === apiCount ) {
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

			subSrv.fetchSchedules(exportOnly)
				.then( success.bind(null, 'schedulesList'), failed.bind(null, 'schedulesList', []) );

			subSrv.fetchScheduleFrequency(exportOnly)
				.then( success.bind(null, 'scheduleFrequency'), failed.bind(null, 'scheduleFrequency', []) );

			subSrv.fetchScheduleFormat()
				.then( success.bind(null, 'scheduleFormat'), failed.bind(null, 'scheduleFormat', []) );

			subSrv.fetchTimePeriods()
				.then( success.bind(null, 'scheduleTimePeriods'), failed.bind(null, 'scheduleTimePeriods', []) );

			subSrv.fetchSchedulableReports(exportOnly)
				.then( success.bind(null, 'schedulableReports'), failed.bind(null, 'schedulableReports', []) );

			if ( type === SCHEDULE_TYPES.EXPORT_SCHEDULE ) {
				subSrv.fetchDeliveryTypes()
					.then( success.bind(null, 'scheduleDeliveryTypes'), failed.bind(null, 'scheduleDeliveryTypes', []) );

				subSrv.fetchFtpServers()
					.then( success.bind(null, 'ftpServerList'), failed.bind(null, 'ftpServerList', []) );
			}

			return deferred.promise;
		};

		service.reportSchedulesPayload = function() {
			return schedulePayloadGenerator( SCHEDULE_TYPES.SCHEDULE_REPORT );
		};

		service.reportExportPayload = function() {
			return schedulePayloadGenerator( SCHEDULE_TYPES.EXPORT_SCHEDULE );
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

		service.createSchedule = function(params) {
			var deferred = $q.defer(),
				url = 'admin/export_schedules/';

			var success = function(data) {
				deferred.resolve(data);
			};

			var failed = function(error) {
				deferred.reject( error );
			};

			rvBaseWebSrvV2
				.postJSON( url, params )
				.then( success, failed );

			return deferred.promise;
		};

		service.deleteSchedule = function(params) {
			var deferred = $q.defer(),
				url = 'admin/export_schedules/' + params.id;

			var success = function(data) {
				deferred.resolve(data);
			};

			var failed = function(error) {
				deferred.reject( error );
			};

			rvBaseWebSrvV2
				.deleteJSON( url )
				.then( success, failed );

			return deferred.promise;
		};

		service.runScheduleNow = function(params) {
			var deferred = $q.defer(),
				url = '/admin/export_schedules/' + params.id + '/run_now'

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

        service.setReportRequestParam = function(name, value) {
            choosenReport[name] = value;
        };

        // Get the timeperiods configured for a given report for export report
        service.getReportExportTimePeriods = function(title) {
            return REPORT_EXPORT_TIME_PERIODS[title];
        };

        // Get the time periods for each of the reports in the schedule reports
        service.getScheduleReportTimePeriods = function( title ) {
        	return SCHEDULE_REPORT_TIMEPERIODS[title];
        };
        // Set the report inbox print clicked state
        service.setPrintClicked = (val) => {
        	this.printClicked = val;
        };

        // Get the report inbox print clicked state
        service.getPrintClickedState = () => {
        	return this.printClicked;
        };

        // Process and apply filter flags on the selected report
        service.processSelectedReport = (report, config) => {

            // apply certain flags based on the report name
            applyFlags.init( report );

            // add users filter for needed reports
            // unfortunately this is not sent from server
            reportUtils.addIncludeUserFilter( report );
            reportUtils.addIncludeOtherFilter(report);


            setupDates.init( report );
            _.each(report['filters'], function(filter) {
                setupDates.execFilter( report, filter );
            });

            // to process the filters for this report
            reportUtils.processFilters(report, config);

            // to reorder & map the sort_by to report details columns - for this report
            // re-order must be called before processing
            reportUtils.reOrderSortBy( report );

            // to process the sort by for this report
            // processing must be called after re-odering
            reportUtils.processSortBy( report );

            // to assign inital date values for this report
            // reportUtils.initDateValues( report[i] );

            // to process the group by for this report
            reportUtils.processGroupBy( report );

        };

		return service;
	}
]);
