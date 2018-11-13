admin.service('adGuestDataRemovalSrv', ['$http', '$q', 'ADBaseWebSrvV2',
    function($http, $q, ADBaseWebSrvV2) {

        var service = this;

        service.initSync = function() {
            return ADBaseWebSrvV2.getJSON('api/guest_data_removal_settings');
        };

        /**
         *
         * @param {Object} params used to build the API endpoint
         * @return {deferred.promise|{then, catch, finally}} Promise for a request to save the configuration
         */
        service.updateGDRSettings = function(params) {
            return ADBaseWebSrvV2.postJSON('api/guest_data_removal_settings/change', params);
        };
    }
]);
