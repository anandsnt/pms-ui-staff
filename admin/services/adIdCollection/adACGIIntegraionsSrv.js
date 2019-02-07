admin.service('ACGIIntegrationSrv', ['$http', '$q', 'ADBaseWebSrvV2', '$log', 'adExternalInterfaceCommonSrv', 'adAxbaseSrv',
    function($http, $q, ADBaseWebSrvV2, $log, adExternalInterfaceCommonSrv, adAxbaseSrv) {

        var service = this;
        /**
         *
         * @param {String} interfaceIdentifier unique string identifier for the interface
         * @return {deferred.promise|{then, catch, finally}} Promise for a request to fetch the configuration
         */
        service.fetchConfiguration = function() {
            return ADBaseWebSrvV2.getJSON('/admin/guest_id_archive_setup/guest_id_archive_options.json');
        };


        /**
         *
         * @param {Object} params used to build the API endpoint
         * @return {deferred.promise|{then, catch, finally}} Promise for a request to save the configuration
         */
        service.saveConfiguration = function(params) {
            return ADBaseWebSrvV2.postJSON('/admin/guest_id_archive_setup/update_options.json', params.config);
        };

    }
]);
