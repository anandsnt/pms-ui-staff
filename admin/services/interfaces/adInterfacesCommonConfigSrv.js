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

        /**
         *
         * @return {deferred.promise|{then, catch, finally}} Promise for an object containing list of paymentMethods, bookingOrigins and rates
         */
        service.fetchOptionsList = function(list) {
            var deferred = $q.defer(),
                promises = [],
                meta = {};

            var metaLists = list || ['PAYMENT_METHODS', 'BOOKING_ORIGINS', 'RATES'];

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

            $q.all(promises).then(function() {
                deferred.resolve(meta);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });

            return deferred.promise;
        };

    }
]);