angular.module('sntRover').service('RVCustomExportSrv', [
    '$q',
    'sntBaseWebSrv',
    'RVreportsSubSrv',
    function (
        $q,
        sntBaseWebSrv,
        reportSubSrv ) {

        const FILTER_KEYS = {
            BOOKING_ORIGIN_CODE: 'booking_origin_code',
            MARKET_CODE: 'market_code',
            RESERVATION_STATUS: 'reservation_status',
            ROOM_NO: 'room_no',
            ROOM_TYPE: 'room_type',
            SEGMENT_CODE: 'segment_code',
            SOURCE_CODE: 'source_code',
            ARRIVAL_ROOM_TYPE: 'arrival_room_type',
            DEPARTURE_ROOM_TYPE: 'departure_room_type',
            ARRIVAL_RATE_CODE: 'arrival_rate_code',
            CI_AGENT: 'ci_agent',
            CO_AGENT: 'co_agent',
            CI_APPLICATION: 'ci_application',
            CO_APPLICATION: 'co_application',
            NATIONALITY: 'nationality',
            COUNTRY: 'country',
            LANGUAGE: 'language',
            VIP: 'vip',
            PRIMARY_PAYMENT_METHOD: 'primary_payment_method',
            MEMBERSHIP: 'membership',
            MEMBERSHIP_LEVEL: 'membership_level',
            ORIGIN_CODE: 'origin_code'
        };

        var cache = {
            timePeriods: [],
            dataSpaceColumns: {},
            deliveryTypes: [],
            exportFrequencies: [],
            DROP_BOX: [],
            GOOGLE_DRIVE: []
        };

        var self = this;

        /**
         * Get available data spaces
         * @return { Promise } promise
         */
        this.getAvailableDataSpaces = () => {
            var deferred = $q.defer(),
                url = 'api/reports?show_only_redshift_reports=true';

            sntBaseWebSrv.getJSON(url).then(function (response) {
                deferred.resolve(response.results);
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        /**
         * Get scheduled custom exports
         * @return { Promise } promise
         */
        this.getScheduledCustomExports = () => {
            var deferred = $q.defer(),
                url = 'admin/export_schedules.json?show_only_redshift_reports=true',
                params = {
                    page: 1,
                    per_page: 9999
                };

            sntBaseWebSrv.getJSON(url, params).then(function (response) {
                deferred.resolve(response.results);
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        /**
         * Get scheduled custom exports and export frequencies
         * @return { Promise } promise
         */
        this.getCustomExportsAndScheduleFrequencies = () => {
            var deferred = $q.defer(),
                promises = {};

            promises['customExports'] = this.getScheduledCustomExports();
            promises['scheduleFrequencies'] = this.getExportFrequencies();

            $q.all(promises).then(function (data) {
                deferred.resolve(data);
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        /**
         * Get all the required data for loading a custom export
         * @param { Object } params object holding request params
         * @return { Promise } promise
         */
        this.getRequestData = ( params ) => {
            var promises = {},
                deferred = $q.defer();

            promises['columns'] = this.getDataSpaceColumns(params);
            promises['exportFormats'] = this.getExportFormats(params);
            promises['deliveryTypes'] = this.getExportDeliveryTypes(params);
            promises['durations'] = this.getExportDurations(params);
            promises['dropBoxAccounts'] = this.getCloudDrives('DROP_BOX');
            promises['googleDriveAccounts'] = this.getCloudDrives('GOOGLE_DRIVE');
            promises['ftpServerList'] = reportSubSrv.fetchFtpServers();

            $q.all(promises).then(function (data) {
                deferred.resolve(data);
            }, function () {
                deferred.resolve([]);
            });

            return deferred.promise;

        };

        /**
         * Get export formats
         * @return { Promise } promise
         */
        this.getExportFormats = () => {
            var deferred = $q.defer(),
                url = 'admin/export_formats.json';

            sntBaseWebSrv.getJSON(url).then(function (response) {
                var validFormats = _.filter(response.results, function (format) {
                    return (format.value === 'CSV' || format.value === 'XML' || format.value === 'JSON');
                });

                deferred.resolve(validFormats);
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        /**
         * Get delivery types configured
         * @return { Promise } promise
         */
        this.getExportDeliveryTypes = ()  => {
            var deferred = $q.defer(),
                url = 'admin/export_delivery_types.json';

            if (cache.deliveryTypes.length > 0 ) {
                deferred.resolve(cache.deliveryTypes);
            } else {
                sntBaseWebSrv.getJSON(url).then(function (response) {
                    cache.deliveryTypes = response.results;
                    deferred.resolve(cache.deliveryTypes);
                }, function (error) {
                    deferred.reject(error);
                });  
            }

            return deferred.promise;
        };

        /**
         * Get export frequencies
         * @return { Promise } promise
         */
        this.getExportFrequencies = ()  => {
            var deferred = $q.defer(),
                url = 'admin/export_frequencies.json';

            if (cache.exportFrequencies.length > 0 ) {
                deferred.resolve(cache.exportFrequencies);
            } else {
                sntBaseWebSrv.getJSON(url).then(function (response) {
                    cache.exportFrequencies = response.results;
                    deferred.resolve(cache.exportFrequencies);
                }, function (error) {
                    deferred.reject(error);
                });  
            }

            return deferred.promise;
        };

        /**
         * Get cloud drive list by type
         * @param {String} driveType cloud drive type
         * @return { Promise } promise
         */
        this.getCloudDrives = (driveType)  => {
            var deferred = $q.defer(),
                url = '/api/cloud_drives?cloud_drive_type=' + driveType;

            if (cache[driveType].length > 0 ) {
                deferred.resolve(cache[driveType]);
            } else {
                sntBaseWebSrv.getJSON(url).then(function (response) {
                    cache[driveType] = response.results;
                    deferred.resolve(cache[driveType]);
                }, function (error) {
                    deferred.reject(error);
                });  
            }

            return deferred.promise;
        };

        /**
         * Get data space columns
         * @param {Object} params object holding request params
         * @return { Promise } promise
         */
        this.getDataSpaceColumns = ( params ) => {
            var deferred = $q.defer(),
                url = 'api/reports/' + params.reportId + '/list_data_space_columns';

            if (cache.dataSpaceColumns[params.reportId]) {
                deferred.resolve(cache.dataSpaceColumns[params.reportId]);
            } else {
                sntBaseWebSrv.getJSON(url).then(function (columnData) {
                    columnData = columnData.map((column) => ({
                        name: column,
                        selected: false
                    }));
                    cache.dataSpaceColumns[params.reportId] = columnData;
                    deferred.resolve(columnData);
                }, function (error) {
                    deferred.reject(error);
                });
            }   

            return deferred.promise;
        };

        /**
         * Get export durations
         * @return { Promise } promise
         */
        this.getExportDurations = () => {
            var deferred = $q.defer(),
                url = 'admin/export_time_periods.json';

            if (cache.timePeriods.length > 0) {
                deferred.resolve(cache.timePeriods);
            } else {
                sntBaseWebSrv.getJSON(url).then(function (response) {
                    var results = _.reject(response.results, function ( each ) {
                        return each.value === 'DATE' || each.value === 'DATE_RANGE';
                    });
    
                    cache.timePeriods = results;
                    deferred.resolve(results);
                }, function (error) {
                    deferred.resolve(error);
                });
            }

            return deferred.promise;
        };

        /**
         * Get room nos
         * @return { Promise } promise
         */
        this.getRoomNos = () => {
            var deferred = $q.defer(),
                url = 'house/search.json',
                data = {
                    all_employees_selected: true,
                    page: 1,
                    per_page: 9999
                };

            sntBaseWebSrv.postJSON(url, data).then(function (response) {
                var results = _.map(response.data.rooms, function (each) {
                    return {
                        id: each.id,
                        name: each.room_no
                    };
                });

                deferred.resolve(angular.copy(results));
            }, function (error) {
                deferred.resolve(error);
            });

            return deferred.promise;
        };

        /**
         * Get guest languages
         * @return { Promise } promise
         */
        this.getGuestLanguages = () => {
            var deferred = $q.defer(),
                url = 'api/guest_languages';

            sntBaseWebSrv.getJSON(url).then(function (response) {
                var results = _.map(response.languages, function (each) {
                    return {
                        id: each.id,
                        value: each.language
                    };
                });

                deferred.resolve(results);
            }, function (error) {
                deferred.resolve(error);
            });

            return deferred.promise;
        };

        /**
         * Get primary payment methods
         * @return { Promise } promise
         */
        this.getPaymentMethods = () => {
            var deferred = $q.defer(),
                url = 'staff/payments/addNewPayment.json';

            sntBaseWebSrv.getJSON(url).then(function (response) {
                deferred.resolve(response.data);
            }, function (error) {
                deferred.resolve(error);
            });

            return deferred.promise;
        };

        /**
         * Get countries/nationality list
         * @return { Promise } promise
         */
        this.getCountries = () => {
            var deferred = $q.defer(),
                url = 'ui/country_list';

            sntBaseWebSrv.getJSON(url).then(function (response) {
                var results = _.map(response, function (each) {
                    return {
                        id: each.id,
                        value: each.value,
                        code: each.code
                    };
                });

                deferred.resolve(results);
            }, function (error) {
                deferred.resolve(error);
            });

            return deferred.promise;
        };

        /**
         * Get CI/CO agents list
         * @return { Promise } promise
         */
        this.getCICOAgents = () => {
            var deferred = $q.defer(),
                url = 'admin/users.json?isAdminSnt=false&sort_dir=true&sort_field=name';

            sntBaseWebSrv.getJSON(url).then(function (response) {
                var results = _.map(response.users, function (each) {
                    return {
                        id: each.id,
                        full_name: each.full_name,
                        email: each.email
                    };
                });

                deferred.resolve(results);
            }, function (error) {
                deferred.resolve(error);
            });

            return deferred.promise;
        };

        /**
         * Get rate list
         * @return { Promise } promise
         */
        this.getRateList = () => {
            var deferred = $q.defer(),
                url = 'api/rates/list';

            sntBaseWebSrv.postJSON(url).then(function (response) {
                var results = _.map(response.rates, function (each) {
                    return {
                        code: each.rate_code,
                        name: each.rate_name
                    };
                });

                deferred.resolve(results);
            }, function (error) {
                deferred.resolve(error);
            });

            return deferred.promise;
        };

        /**
         * Get CI/CO applications list
         * @return { Promise } promise
         */
        this.getCICOApplications = () => {
            var deferred = $q.defer(),
                url = 'api/reference_values?type=application';

            sntBaseWebSrv.getJSON(url).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.resolve(error);
            });

            return deferred.promise;
        };

        /**
         * Get HLP mememberships
         * @return { Promise } promise
         */
        this.getHLP = () => {
            var deferred = $q.defer(),
                url = 'staff/user_memberships/get_available_hlps.json';

            sntBaseWebSrv.getJSON(url).then(function (response) {
                var results = _.map (response.data, ( each ) => {
                    return {
                        desc: each.hl_description,
                        value: each.hl_value
                    };
                });

                deferred.resolve(results);
            }, function (error) {
                deferred.resolve(error);
            });

            return deferred.promise;
        };

        /**
         * Get FFP mememberships
         * @return { Promise } promise
         */
        this.getFFP = () => {
            var deferred = $q.defer(),
                url = 'staff/user_memberships/get_available_ffps.json';

            sntBaseWebSrv.getJSON(url).then(function (response) {
                var results = _.map (response.data, ( each ) => {
                    return {
                        desc: each.ff_description,
                        value: each.ff_value
                    };
                });

                deferred.resolve(results);
            }, function (error) {
                deferred.resolve(error);
            });

            return deferred.promise;
        };

        /**
         * Get HLP membership levels
         * @return { Promise } promise
         */
        this.getHLPLevels = () => {
            var deferred = $q.defer(),
                url = 'staff/user_memberships/get_available_hlps.json';

            sntBaseWebSrv.getJSON(url).then(function (response) {
                var levels = [];

                _.each(response.data, (hlp) => {
                    _.each(hlp.levels, (level) => {
                        levels.push({
                            value: level.membership_level
                        });
                    });
                });

                deferred.resolve(levels);
            }, function (error) {
                deferred.resolve(error);
            });

            return deferred.promise;
        };

        /**
         * Get FFP membership levels
         * @return { Promise } promise
         */
        this.getFFPLevels = () => {
            var deferred = $q.defer(),
                url = 'staff/user_memberships/get_available_ffps.json';

            sntBaseWebSrv.getJSON(url).then(function (response) {
                var levels = [];

                _.each(response.data, (hlp) => {
                    _.each(hlp.levels, (level) => {
                        levels.push({
                            value: level.membership_level
                        });
                    });
                });

                deferred.resolve(levels);
            }, function (error) {
                deferred.resolve(error);
            });

            return deferred.promise;
        };

        /**
         * Get all memberships
         * @return { Promise } promise
         */
        this.getMemberShips = () => {
            var deferred = $q.defer(),
                promises = [];

            promises.push(this.getHLP());
            promises.push(this.getFFP());

            $q.all(promises).then(function (response) {
                deferred.resolve(response[0].concat(response[1]));
            });

            return deferred.promise;
        };

        /**
         * Get all membership levels
         * @return { Promise } promise
         */
        this.getMemberShipLevels = () => {
            var deferred = $q.defer(),
                promises = [];

            promises.push(this.getHLPLevels());
            promises.push(this.getFFPLevels());

            $q.all(promises).then(function (response) {
                var membershipLevels = response[0].concat(response[1]);

                membershipLevels = _.uniq(membershipLevels, function (entry) {
                    return entry.value;
                });

                deferred.resolve(membershipLevels);
            });

            return deferred.promise;
        };

        /**
         * Get reservation statuses
         * @param {String} type reference value type
         * @return { Promise } promise
         */
        this.getReferenceValuesByType = (type) => {
            var deferred = $q.defer(),
                url = 'api/reference_values?type=' + type;

            sntBaseWebSrv.getJSON(url).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.resolve(error);
            });

            return deferred.promise;
        };

        /**
         * Get reservation types
         */
        this.getReservationTypes = () => {
            var deferred = $q.defer(),
                url = 'api/reservation_types';

            sntBaseWebSrv.getJSON(url).then(function (response) {
                deferred.resolve(response.reservation_types);
            }, function (error) {
                deferred.resolve(error);
            });

            return deferred.promise;
        };


        this.processFilterSelections = ( filterValues ) => {
            var promises = [],
                deferred = $q.defer();

            _.each(filterValues, function (value, key) {
                switch (key) {
                    case FILTER_KEYS['BOOKING_ORIGIN_CODE']:
                    case FILTER_KEYS['ORIGIN_CODE']:
                        promises.push(reportSubSrv.fetchBookingOrigins());
                        break;
                    case FILTER_KEYS['MARKET_CODE']:
                        promises.push(reportSubSrv.fetchMarkets());
                        break;
                    case FILTER_KEYS['RESERVATION_STATUS']:
                        promises.push(self.getReferenceValuesByType('reservation_status'));
                        break;                    
                    case FILTER_KEYS['ROOM_NO']:
                        promises.push(self.getRoomNos());
                        break;
                    case FILTER_KEYS['ROOM_TYPE']:
                    case FILTER_KEYS['ARRIVAL_ROOM_TYPE']:
                    case FILTER_KEYS['DEPARTURE_ROOM_TYPE']:
                        promises.push(reportSubSrv.fetchRoomTypeList());
                        break;
                    case FILTER_KEYS['SEGMENT_CODE']:
                        promises.push(reportSubSrv.fetchSegments());
                        break;
                    case FILTER_KEYS['SOURCE_CODE']:
                        promises.push(reportSubSrv.fetchSources());
                        break;
                    case FILTER_KEYS['ARRIVAL_RATE_CODE']:
                        promises.push(self.getRateList());
                        break;
                    case FILTER_KEYS['CI_AGENT']:
                    case FILTER_KEYS['CO_AGENT']:
                        promises.push(self.getCICOAgents());
                        break;
                    case FILTER_KEYS['CI_APPLICATION']:
                    case FILTER_KEYS['CO_APPLICATION']:
                        promises.push(self.getCICOApplications());
                        break;
                    case FILTER_KEYS['COUNTRY']:
                    case FILTER_KEYS['NATIONALITY']:
                        promises.push(self.getCountries());
                        break;
                    case FILTER_KEYS['LANGUAGE']:
                        promises.push(self.getGuestLanguages());
                        break;
                    case FILTER_KEYS['PRIMARY_PAYMENT_METHOD']:
                        promises.push(self.getPaymentMethods());
                        break;
                    case FILTER_KEYS['MEMBERSHIP']:
                        promises.push(self.getMemberShips());
                        break;
                    case FILTER_KEYS['MEMBERSHIP_LEVEL']:
                        promises.push(self.getMemberShipLevels());
                        break;
                    
                    default:
                }
            });

            $q.all(promises).then(function (data) {
                deferred.resolve(data);
            }, function () {
                deferred.resolve([]);
            });

            return deferred.promise;
        };


    }]);