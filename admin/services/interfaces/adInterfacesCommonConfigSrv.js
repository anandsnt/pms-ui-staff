admin.service('adInterfacesCommonConfigSrv', ['$http', '$q', 'ADBaseWebSrvV2', '$log',
    function($http, $q, ADBaseWebSrvV2, $log) {

        var service = this;

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

        service.saveConfiguration = function(params) {
            return ADBaseWebSrvV2.postJSON('api/integrations/' + params.interfaceIdentifier + '/settings', params.config);
        };

    }
]);