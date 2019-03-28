admin.service('adInterfacesSrv', ['$http', '$q', 'ADBaseWebSrvV2', '$log',
    function($http, $q, ADBaseWebSrvV2, $log) {
        /**
         *
         * @param {String} interfaceIdentifier unique string identifier for the interface
         * @return {deferred.promise|{then, catch, finally}} Promise for a request to fetch the configuration
         */
        this.getSettings = function(integration) {
            var errorText = '',
                deferred = $q.defer();

            if (!integration) {
                errorText = 'MISSING PARAMETER: fetchConfigurations service expects interface identifier';
                $log.error(errorText);
                deferred.reject([errorText]);
            }

            return ADBaseWebSrvV2.getJSON('ifc/' + integration + '/settings');
        };

        this.synchronize = function(params) {
            return ADBaseWebSrvV2.postJSON('ifc/proxy/property/synchronize_integration', params);
        };

        /**
         *
         * @param {Object} params used to build the API endpoint
         * @return {deferred.promise|{then, catch, finally}} Promise for a request to save the configuration
         * Should put all values to interface for update/create
         */
        this.updateSettings = function(params) {
            return ADBaseWebSrvV2.putJSON('ifc/proxy/settings/update_all_by_integration', params);
        };
    }
]);
