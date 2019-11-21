admin.service('ACGIIntegrationSrv', ['$http', '$q', 'ADBaseWebSrvV2',
    function($http, $q, ADBaseWebSrvV2) {

        var service = this;

        /**
         *
         * @param {String} interfaceIdentifier unique string identifier for the interface
         * @return {deferred.promise|{then, catch, finally}} Promise for a request to fetch the configuration
         */
        service.fetchConfiguration = function() {
            return ADBaseWebSrvV2.getJSON('/admin/archival_transfer_setup/archive_options.json');
        };
        /**
         *
         * @param {Object} params used to build the API endpoint
         * @return {deferred.promise|{then, catch, finally}} Promise for a request to save the configuration
         */
        service.saveConfiguration = function(params) {
            return ADBaseWebSrvV2.postJSON('/admin/archival_transfer_setup/update_options.json', params.config);
        };

    }
]);
