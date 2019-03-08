admin.service('adInterfacesSetupSrv', ['$http', '$q', 'ADBaseWebSrvV2', '$log',
    function($http, $q, ADBaseWebSrvV2, $log) {
        /**
         *
         * @param {String} interfaceIdentifier unique string identifier for the interface
         * @return {deferred.promise|{then, catch, finally}} Promise for a request to fetch the configuration
         */
        this.getSettings = function(interfaceName) {
            let errorText = '',
                deferred = $q.defer();

            if (!interfaceName) {
                errorText = 'MISSING PARAMETER: fetchConfigurations service expects interface identifier';
                $log.error(errorText);
                deferred.reject([errorText]);
            }

            return ADBaseWebSrvV2.getJSON('ifc/' + interfaceName + '/settings');
        };

        this.synchronize = function(params) {
            return ADBaseWebSrvV2.postJSON('api/integrations/' + params.interfaceIdentifier + '/sync', params.payLoad);
        };

        /**
         *
         * @param {Object} params used to build the API endpoint
         * @return {deferred.promise|{then, catch, finally}} Promise for a request to save the configuration
         * Should put all values to interface for update/create
         */
        this.updateSettings = function(params) {
            return ADBaseWebSrvV2.putJSON('ifc/proxy/settings/update_all', params.settings);
        };
    }
]);
