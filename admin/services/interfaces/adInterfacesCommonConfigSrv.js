admin.service('adInterfacesCommonConfigSrv', ['$http', '$q', 'ADBaseWebSrvV2', '$log', 'adExternalInterfaceCommonSrv', 'adAxbaseSrv',
    function($http, $q, ADBaseWebSrvV2, $log, adExternalInterfaceCommonSrv, adAxbaseSrv) {

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
        /**
         * @param {Object} params used to build the API endpoint
         * @return {deferred.promise|{then, catch, finally}} Promise for a request to save the room mapping
         */
        service.updateMappings = function(params) {
            return ADBaseWebSrvV2.postJSON('api/hotel_settings/' + params.interfaceIdentifier + '/save_room_mapping', params.config);
        };
        /**
         * @param {Object} params used to build the API endpoint
         * @return {deferred.promise|{then, catch, finally}} Promise for a request to import Rooms
         */
        service.startImportRooms = function(params) {
            return ADBaseWebSrvV2.postJSON('api/hotel_settings/' + params.interfaceIdentifier + '/import_rooms');
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

            promises.push(adAxbaseSrv.fetchRoomMappings().then(function(response) {
                meta.room_mappings = response.room_mappings;
            }));

            promises.push(adExternalInterfaceCommonSrv.fetchRoom(params).then(function(response) {
                meta.rooms = response.data.rooms;
                meta.total_count = response.data.total_count;
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

        service.fetchChargeGroups = function() {
            var deferred = $q.defer();
            var url = '/admin/charge_groups';

            ADBaseWebSrvV2.getJSON(url).then(function(chargeGroups) {
                deferred.resolve(chargeGroups);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        service.fetchTaxChargeCodes = function() {
            var deferred = $q.defer();
            var url = '/admin/charge_codes/tax_charge_code';

            ADBaseWebSrvV2.getJSON(url).then(function(taxChargeCodes) {
                deferred.resolve(taxChargeCodes);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
    }
]);
