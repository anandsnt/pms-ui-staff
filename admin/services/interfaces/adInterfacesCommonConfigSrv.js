admin.service('adInterfacesCommonConfigSrv', ['$http', '$q', 'ADBaseWebSrvV2', '$log', 'adExternalInterfaceCommonSrv',
    function($http, $q, ADBaseWebSrvV2, $log, adExternalInterfaceCommonSrv) {

        var service = this;

        /**
         *
         * @return {deferred.promise|{then, catch, finally}} Promise for a request to fetch the rates
         */
        service.fetchRatesMinimal = function() {
            return ADBaseWebSrvV2.getJSON('/api/rates/minimal?exclude_expired=true');
        };

        /**
         *
         * @param {String} interfaceIdentifier unique string identifier for the interface
         * @return {deferred.promise|{then, catch, finally}} Promise for a request to fetch the configuration
         */
        service.fetchConfiguration = function(interfaceIdentifier) {
            var errorText = '',
                deferred = $q.defer();

            if (!interfaceIdentifier) {
                errorText = 'MISSING PARAMETER: fetchConfigurations service expects interface identifier';
                $log.error(errorText);
                deferred.reject([errorText]);
            }

            return ADBaseWebSrvV2.getJSON('api/integrations/' + interfaceIdentifier + '/settings');
        };

        service.initSync = function(params) {
            return ADBaseWebSrvV2.postJSON('api/integrations/' + params.interfaceIdentifier + '/sync', params.payLoad);
        };

        /**
         *
         * @param {Object} params used to build the API endpoint
         * @return {deferred.promise|{then, catch, finally}} Promise for a request to save the configuration
         */
        service.saveConfiguration = function(params) {
            return ADBaseWebSrvV2.postJSON('api/integrations/' + params.interfaceIdentifier + '/settings', params.config);
        };

        service.updateMappings = function(params) {
            return ADBaseWebSrvV2.postJSON('api/hotel_settings/' + params.interfaceIdentifier + '/save_room_mapping', params.config);
        };

        /**
         *
         * @return {deferred.promise|{then, catch, finally}} Promise for an object containing list of paymentMethods, bookingOrigins and rates
         */
        service.fetchOptionsList = function(list) {
            var deferred = $q.defer(),
                promises = [],
                meta = {};

            var metaLists = list || ['PAYMENT_METHODS', 'BOOKING_ORIGINS', 'RATES', 'ROOM_TYPES'];

            if (metaLists.indexOf('PAYMENT_METHODS') > -1) {
                promises.push(adExternalInterfaceCommonSrv.fetchPaymethods().then(function(response) {
                    meta.paymentMethods = response.payments;
                }));
            }

            if (metaLists.indexOf('BOOKING_ORIGINS') > -1) {
                promises.push(adExternalInterfaceCommonSrv.fetchOrigins().then(function(response) {
                    meta.bookingOrigins = response.booking_origins;
                }));
            }

            if (metaLists.indexOf('RATES') > -1) {
                promises.push(service.fetchRatesMinimal().then(function(response) {
                    meta.rates = response.results;
                }));
            }

            if (metaLists.indexOf('ROOM_TYPES') > -1) {
                promises.push(adExternalInterfaceCommonSrv.fetchRoomTypes().then(function(response) {
                    meta.roomTypes = response.room_types;
                }));
            }

            $q.all(promises).then(function() {
                deferred.resolve(meta);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });

            return deferred.promise;
        };

        service.fetchRoomMappings = function(params) {
            var deferred = $q.defer(),
                promises = [],
                meta = {};

            var a = {'room_mappings': [{'id': 3,
                'property_id': 22,
                'integration_id': 34,
                'typeof': 'room_number',
                'value': 200,
                'external_value': 5,
                'meta_data': {'description': 'Service'},
                'created_at': '2018-06-21T16:53:29.564Z',
                'updated_at': '2018-06-21T16:53:29.564Z'}, {'id': 4,
                    'property_id': 22,
                    'integration_id': 34,
                    'typeof': 'room_number',
                    'value': 300,
                    'external_value': '6',
                    'meta_data': {'description': 'Rum 101'},
                    'created_at': '2018-06-21T16:53:29.564Z',
                    'updated_at': '2018-06-21T16:53:29.564Z'}, {'id': 5,
                        'property_id': 22,
                        'integration_id': 34,
                        'typeof': 'room_number',
                        'value': null,
                        'external_value': '7',
                        'meta_data': {'description': 'Rum 102'},
                        'created_at': '2018-06-21T16:53:29.564Z',
                        'updated_at': '2018-06-21T16:53:29.564Z'}, {'id': 6,
                            'property_id': 22,
                            'integration_id': 34,
                            'typeof': 'room_number',
                            'value': null,
                            'external_value': '8',
                            'meta_data': {'description': 'Rum 103'},
                            'created_at': '2018-06-21T16:53:29.564Z',
                            'updated_at': '2018-06-21T16:53:29.564Z'}, {'id': 7,
                                'property_id': 22,
                                'integration_id': 34,
                                'typeof': 'room_number',
                                'value': null,
                                'external_value': '9',
                                'meta_data': {'description': 'Rum 104'},
                                'created_at': '2018-06-21T16:53:29.564Z',
                                'updated_at': '2018-06-21T16:53:29.564Z'}, {'id': 8,
                                    'property_id': 22,
                                    'integration_id': 34,
                                    'typeof': 'room_number',
                                    'value': null,
                                    'external_value': '10',
                                    'meta_data': {'description': 'Rum 105'},
                                    'created_at': '2018-06-21T16:53:29.564Z',
                                    'updated_at': '2018-06-21T16:53:29.564Z'}, {'id': 9,
                                        'property_id': 22,
                                        'integration_id': 34,
                                        'typeof': 'room_number',
                                        'value': null,
                                        'external_value': '11',
                                        'meta_data': {'description': 'Rum 106'},
                                        'created_at': '2018-06-21T16:53:29.564Z',
                                        'updated_at': '2018-06-21T16:53:29.564Z'}, {'id': 10,
                                            'property_id': 22,
                                            'integration_id': 34,
                                            'typeof': 'room_number',
                                            'value': null,
                                            'external_value': '12',
                                            'meta_data': {'description': 'Rum 107'},
                                            'created_at': '2018-06-21T16:53:29.564Z',
                                            'updated_at': '2018-06-21T16:53:29.564Z'}, {'id': 11,
                                                'property_id': 22,
                                                'integration_id': 34,
                                                'typeof': 'room_number',
                                                'value': null,
                                                'external_value': '13',
                                                'meta_data': {'description': 'Rum 108'},
                                                'created_at': '2018-06-21T16:53:29.564Z',
                                                'updated_at': '2018-06-21T16:53:29.564Z'}, {'id': 12,
                                'property_id': 22,
                                'integration_id': 34,
                                'typeof': 'room_number',
                                'value': null,
                                'external_value': '14',
                                'meta_data': {'description': 'Rum 109'},
                                'created_at': '2018-06-21T16:53:29.564Z',
                                'updated_at': '2018-06-21T16:53:29.564Z'}, {'id': 13,
                                    'property_id': 22,
                                    'integration_id': 34,
                                    'typeof': 'room_number',
                                    'value': null,
                                    'external_value': '15',
                                    'meta_data': {'description': 'Rum 110'},
                                    'created_at': '2018-06-21T16:53:29.564Z',
                                    'updated_at': '2018-06-21T16:53:29.564Z'}, {'id': 14,
                                'property_id': 22,
                                'integration_id': 34,
                                'typeof': 'room_number',
                                'value': null,
                                'external_value': '16',
                                'meta_data': {'description': 'Rum 111'},
                                'created_at': '2018-06-21T16:53:29.564Z',
                                'updated_at': '2018-06-21T16:53:29.564Z'}, {'id': 15,
                                    'property_id': 22,
                                    'integration_id': 34,
                                    'typeof': 'room_number',
                                    'value': null,
                                    'external_value': '17',
                                    'meta_data': {'description': 'Rum 201'},
                                    'created_at': '2018-06-21T16:53:29.564Z',
                                    'updated_at': '2018-06-21T16:53:29.564Z'}, {'id': 16,
                                'property_id': 22,
                                'integration_id': 34,
                                'typeof': 'room_number',
                                'value': 400,
                                'external_value': '18',
                                'meta_data': {'description': 'Rum 202'},
                                'created_at': '2018-06-21T16:53:29.564Z',
                                'updated_at': '2018-06-21T16:53:29.564Z'}, {'id': 17,
                                'property_id': 22,
                                'integration_id': 34,
                                'typeof': 'room_number',
                                'value': null,
                                'external_value': '19',
                                'meta_data': {'description': 'Rum 203'},
                                'created_at': '2018-06-21T16:53:29.564Z',
                                'updated_at': '2018-06-21T16:53:29.564Z'}, {'id': 18,
                                    'property_id': 22,
                                    'integration_id': 34,
                                    'typeof': 'room_number',
                                    'value': null,
                                    'external_value': '20',
                                    'meta_data': {'description': 'Rum 204'},
                                    'created_at': '2018-06-21T16:53:29.564Z',
                                    'updated_at': '2018-06-21T16:53:29.564Z'}, {'id': 19,
                                    'property_id': 22,
                                    'integration_id': 34,
                                    'typeof': 'room_number',
                                    'value': null,
                                    'external_value': '21',
                                    'meta_data': {'description': 'Rum 205'},
                                    'created_at': '2018-06-21T16:53:29.564Z',
                                    'updated_at': '2018-06-21T16:53:29.564Z'}, {'id': 20,
                                'property_id': 22,
                                'integration_id': 34,
                                'typeof': 'room_number',
                                'value': null,
                                'external_value': '22',
                                'meta_data': {'description': 'Rum 206'},
                                'created_at': '2018-06-21T16:53:29.564Z',
                                'updated_at': '2018-06-21T16:53:29.564Z'}, {'id': 21,
                                'property_id': 22,
                                'integration_id': 34,
                                'typeof': 'room_number',
                                'value': null,
                                'external_value': '23',
                                'meta_data': {'description': 'Rum 207'},
                                'created_at': '2018-06-21T16:53:29.564Z',
                                'updated_at': '2018-06-21T16:53:29.564Z'}, {'id': 22,
                                    'property_id': 22,
                                    'integration_id': 34,
                                    'typeof': 'room_number',
                                    'value': null,
                                    'external_value': '24',
                                    'meta_data': {'description': 'Rum 208'},
                                    'created_at': '2018-06-21T16:53:29.564Z',
                                    'updated_at': '2018-06-21T16:53:29.564Z'}, {'id': 23,
                                'property_id': 22,
                                'integration_id': 34,
                                'typeof': 'room_number',
                                'value': null,
                                'external_value': '25',
                                'meta_data': {'description': 'Rum 209'},
                                'created_at': '2018-06-21T16:53:29.564Z',
                                'updated_at': '2018-06-21T16:53:29.564Z'}, {'id': 24,
                                    'property_id': 22,
                                    'integration_id': 34,
                                    'typeof': 'room_number',
                                    'value': null,
                                    'external_value': '26',
                                    'meta_data': {'description': 'Rum 210'},
                                    'created_at': '2018-06-21T16:53:29.564Z',
                                    'updated_at': '2018-06-21T16:53:29.564Z'}, {'id': 25,
                                    'property_id': 22,
                                    'integration_id': 34,
                                    'typeof': 'room_number',
                                    'value': null,
                                    'external_value': '27',
                                    'meta_data': {'description': 'Rum 211'},
                                    'created_at': '2018-06-21T16:53:29.564Z',
                                    'updated_at': '2018-06-21T16:53:29.564Z'}, {'id': 26,
                                'property_id': 22,
                                'integration_id': 34,
                                'typeof': 'room_number',
                                'value': null,
                                'external_value': '28',
                                'meta_data': {'description': 'Rum 212'},
                                'created_at': '2018-06-21T16:53:29.564Z',
                                'updated_at': '2018-06-21T16:53:29.564Z'}, {'id': 27,
                                    'property_id': 22,
                                    'integration_id': 34,
                                    'typeof': 'room_number',
                                    'value': null,
                                    'external_value': '29',
                                    'meta_data': {'description': 'Rum 213'},
                                    'created_at': '2018-06-21T16:53:29.564Z',
                                    'updated_at': '2018-06-21T16:53:29.564Z'}],
                'total_count': 88,
                'errors': null,
                'is_eod_in_progress': false,
                'is_eod_manual_started': false,
                'is_eod_failed': true,
                'is_eod_process_running': false};

            // promises.push(adExternalInterfaceCommonSrv.fetchRoomMappings().then(function(response) {
            //     meta.room_mappings = response.room_mappings;
            // }));

            promises.push(adExternalInterfaceCommonSrv.fetchRoom(params).then(function(response) {
                meta.rooms = response.data.rooms;
                meta.total_count = response.data.total_count;
                meta.room_mappings = a.room_mappings;
            }));

            $q.all(promises).then(function() {
                deferred.resolve(meta);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });

            return deferred.promise;
        };

        service.countryList = [];
        service.currencyList = [];

        service.fetchCountryList = function() {
            var deferred = $q.defer();
            var url = '/ui/country_list.json';

            if (service.countryList.length) {
                deferred.resolve(service.countryList);
            } else {
                ADBaseWebSrvV2.getJSON(url).then(function(countyList) {
                    // change key names for the select box directive
                    _.each(countyList, function(country) {
                        country.name = country.value;
                        country.value = country.id;
                    });
                    service.countryList = countyList;
                    deferred.resolve(countyList);
                }, function(data) {
                    deferred.reject(data);
                });
            }
            return deferred.promise;
        };

        service.fetchCurrencyList = function() {
            var deferred = $q.defer();
            var url = '/ui/currency_list';
            
            if (service.countryList.length) {
                deferred.resolve(service.currencyList);
            } else {
                ADBaseWebSrvV2.getJSON(url).then(function(currencyList) {
                    // change key names for the select box directive
                    _.each(currencyList, function(currency) {
                        currency.name = currency.code;
                        currency.value = currency.id;
                    });
                    service.currencyList = currencyList;
                    deferred.resolve(currencyList);
                }, function(data) {
                    deferred.reject(data);
                });
            }
            return deferred.promise;
        };

    }
]);
