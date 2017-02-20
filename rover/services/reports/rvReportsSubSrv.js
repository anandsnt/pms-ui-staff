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
            return store.hasOwnProperty(key) ? store[key] : false;
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
            var timeStampInSeconds = 0;
            var incrementTimer = function() {
                timeStampInSeconds++;
            };
            var refreshIntervalId = setInterval(incrementTimer, 1000);

            var pollToReport = function(async_callback_url) {
                // we will continously communicate with the server
                // the timeout set for the hotel
                if (timeStampInSeconds >= 300) {
                    var errors = ['Request timed out. Unable to process report !!'];

                    deferred.reject(errors);
                } else {
                    rvBaseWebSrvV2.getJSONWithSpecialStatusHandling(async_callback_url).then(function(data) {
                        // if the request is still not proccesed
                        if ((!!data.status && data.status === 'processing_not_completed') || data === 'null') {
                            // is this same URL ?
                            setTimeout(function() {
                                console.info('POLLING::-> for print response');
                                pollToReport(async_callback_url);
                            }, 5000);
                        } else {
                            clearInterval(refreshIntervalId);
                            deferred.resolve(data);
                        }
                    }, function(data) {
                        if (typeof data === 'undefined') {
                            pollToReport(async_callback_url);
                        } else {
                            clearInterval(refreshIntervalId);
                            deferred.reject(data);
                        }
                    });
                }
            };

            var success = function(data) {
                var resolveData;

                if ( !!data.status && data.status === 'processing_not_completed' ) {
                    pollToReport(data.location_header);
                } else {

                    if ( !! options.resKey2 && !! options.resKey ) {
                        resolveData = data[options.resKey][options.resKey2];
                    } else if ( options.resKey ) {
                        resolveData = data[options.resKey];
                    } else {
                        resolveData = data;
                    }

                    // push it into store
                    if ( options.hasOwnProperty('name') ) {
                        service.setIntoStore(options.name, resolveData);
                    }
                    clearInterval(refreshIntervalId);
                    deferred.resolve( resolveData );
                }
            };

            var failed = function(data) {
                deferred.reject( data || {} );
            };

            // if config is incorrect
            if ( ! options.url || ! options.method || ! rvBaseWebSrvV2.hasOwnProperty(options.method) ) {
                failed();
            }

            // if it has been fetched already
            else if ( service.availInStore(options.name) ) {
                deferred.resolve( service.getfromStore(options.name) );
            }

            // if there is a request params object
            else if ( options.params ) {

                if ( options.params.reportTitle === 'Credit Check Report' ) {
                    options.params = _.omit(options.params, 'reportTitle');
                    rvBaseWebSrvV2.postJSONWithSpecialStatusHandling( options.url, options.params ).then( success, failed );
                } else {
                    options.params = _.omit(options.params, 'reportTitle');
                    rvBaseWebSrvV2[options.method]( options.url, options.params ).then( success, failed );
                }
            }

            // else simple call
            else {
                rvBaseWebSrvV2[options.method]( options.url ).then( success, failed );
            }

            return deferred.promise;
        };

        service.fetchReportList = function() {
            return callApi({
                name: 'reportList',
                method: 'getJSON',
                url: '/api/reports'
            });
        };

        service.fetchReportDetails = function(params) {
            return callApi({
                // no name here since we dont want to cache it in the store ever
                method: 'postJSON',
                url: '/api/reports/' + params.id + '/submit',
                params: _.omit(params, 'id')
            });
        };

        service.getReservationsOfTravelAgents = function(params) {
            return callApi({
                // no name here since we dont want to cache it in the store ever
                method: 'getJSON',
                url: 'api/reports/list_travel_agent_reservations',
                params: params
            });
        };


        service.fetchActiveUsers = function() {
            return callApi({
                name: 'activeUsers',
                method: 'getJSON',
                url: '/api/users/active'
            });
        };

        service.fetchGuaranteeTypes = function() {
            return callApi({
                name: 'guaranteeTypes',
                method: 'getJSON',
                url: '/api/reservation_types.json?is_active=true',
                resKey: 'reservation_types'
            });
        };

        service.fetchChargeNAddonGroups = function() {
            return callApi({
                name: 'chargeNAddonGroups',
                method: 'getJSON',
                url: 'api/charge_groups',
                resKey: 'results'
            });
        };

        service.fetchChargeCodes = function() {
            return callApi({
                name: 'chargeCodes',
                method: 'getJSON',
                url: 'api/charge_codes?is_get_all_charge_codes=true',
                resKey: 'results'
            });
        };

        service.fetchAddons = function (params) {
            return callApi({
                name: 'addons',
                method: 'postJSON',
                url: 'api/addons/detail',
                params: params,
                resKey: 'results'
            });
        };

        service.fetchMarkets = function(params) {
            return callApi({
                name: 'markets',
                method: 'getJSON',
                url: '/api/market_segments?is_active=true',
                resKey: 'markets'
            });
        };

        service.fetchSegments = function(params) {
            return callApi({
                name: 'segments',
                method: 'getJSON',
                url: '/api/segments?is_active=true',
                resKey: 'segments'
            });
        };

        service.fetchSources = function() {
            return callApi({
                name: 'sources',
                method: 'getJSON',
                url: 'api/sources?is_active=true',
                resKey: 'sources'
            });
        };

        service.fetchBookingOrigins = function() {
            return callApi({
                name: 'bookingOrigins',
                method: 'getJSON',
                url: 'api/booking_origins?is_active=true',
                resKey: 'booking_origins'
            });
        };

        service.fetchCodeSettings = function() {
            return callApi({
                name: 'codeSettings',
                method: 'getJSON',
                url: '/api/reports/code_settings'
            });
        };

        service.fetchComTaGrp = function(query, exclude_groups) {
            var urlPrams = '?query=' + query;

            if (exclude_groups) {
                urlPrams += '&exclude_groups=true';
            }

            return callApi({
                // no name here since we dont want to cache it in the store ever
                method: 'getJSON',
                url: 'api/reports/search_by_company_agent_group' + urlPrams,
                resKey: 'results'
            });
        };

        service.fetchHoldStatus = function() {
            return callApi({
                name: 'holdStatus',
                method: 'getJSON',
                url: 'api/group_hold_statuses',
                resKey: 'data',
                resKey2: 'hold_status'
            });
        };

        service.fetchReservationStatus = function() {
            return callApi({
                name: 'reservationStatus',
                method: 'getJSON',
                url: 'api/reservations/status',
                resKey: 'reservation_status'
            });
        };

        service.fetchAddonReservations = function(params) {
            return callApi({
                method: 'getJSON',
                url: '/api/reports/' + params.id + '/addon_reservations',
                params: _.omit(params, 'id'),
                resKey: 'results'
            });
        };

        service.fetchRateTypesAndRateList = function() {
            return callApi({
                name: 'rateTypeAndRateList',
                method: 'getJSON',
                url: '/api/rates/list',
                resKey: 'rates'
                // params: {
                //     include_custom_rates: true
                //     // This service is used ONLY for the Daily Production Rate Report Filters & hence this param is added to the request
                // }
            });
        };

        service.fetchRateCode = function() {
            return callApi({
                name: 'rateCodeList',
                method: 'getJSON',
                url: '/api/rates/codes',
                resKey: 'rate_codes'
            });
        };

        service.fetchRoomTypeList = function() {
            return callApi({
                name: 'roomTypeList',
                method: 'getJSON',
                url: 'api/room_types',
                resKey: 'results'
            });
        };

        service.fetchRestrictionList = function() {
            return callApi({
                name: 'restrictionList',
                method: 'getJSON',
                url: '/api/restriction_types?is_activated=true',
                resKey: 'results'
            });
        };
        service.fetchOrigins = function() {
            return callApi({
                name: 'origins',
                method: 'getJSON',
                url: 'api/reports/origins',
                resKey: 'origins'
            });
        };

        service.fetchURLs = function() {
            return callApi({
                name: 'URLs',
                method: 'getJSON',
                url: 'api/guest_web_urls/?application=URL&guest_web_url_type=CHECKIN',
                resKey: 'data'
            });
        };

        service.fetchScheduleFrequency = function() {
            return callApi({
                name: 'scheduleFrequency',
                method: 'getJSON',
                url: 'admin/export_frequencies.json',
                resKey: 'results'
            });
        };
        service.fetchTimePeriods = function() {
            return callApi({
                name: 'scheduleTimePeriods',
                method: 'getJSON',
                url: 'admin/export_time_periods.json',
                resKey: 'results'
            });
        };
        service.fetchSchedules = function() {
            return callApi({
                method: 'getJSON',
                url: 'admin/export_schedules.json',
                resKey: 'results'
            });
        };
        service.fetchOneSchedule = function(params) {
            return callApi({
                method: 'getJSON',
                url: 'admin/export_schedules/' + params.id
            });
        };

        service.fetchCampaignTypes = function() {
            return callApi({
                name: 'campaign_types',
                method: 'getJSON',
                url: 'api/campaigns/campaign_types',
                resKey: 'campaign_types'
            });
        };

        service.fetchSchedulableReports = function() {
            return callApi({
                name: 'schedulableReports',
                method: 'getJSON',
                url: 'admin/export_reports.json',
                resKey: 'results'
            });
        };

        service.fetchFloors = function() {
            return callApi({
                name: 'houseFloors',
                method: 'getJSON',
                url: 'api/floors.json',
                resKey: 'floors'
            });
        };

        service.fetchDepartments = function() {
            return callApi({
                name: 'departments',
                method: 'getJSON',
                url: 'admin/departments.json',
                resKey: 'data',
                resKey2: 'departments'
            });
        };

        service.getChargeCodes = function(params) {
            return callApi({
                method: 'getJSON',
                url: 'api/reports/' + params.report_id + '/revenue_by_charge_codes',
                params: _.omit(params, 'report_id')
            });
        };

        service.getPaymentValues = function(params) {
            return callApi({
                method: 'getJSON',
                url: 'api/reports/' + params.report_id + '/payment_by_charge_codes',
                params: _.omit(params, 'report_id')
            });
        };


        service.fetchAccounts = function() {
            return callApi({
                name: 'accounts',
                method: 'getJSON',
                url: '/api/accounts/list',
                resKey: 'accounts'
            });
        };

        service.fetchTravelAgents = function() {
            return callApi({
                name: 'accounts',
                method: 'getJSON',
                url: ' /api/reports/list_travel_agents',
                resKey: 'travel_agents'
            });
        };

        return service;
    }
]);
