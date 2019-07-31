admin.service('adStaahSetupSrv', [
    '$http', '$q', 'ADBaseWebSrvV2',
    function ($http, $q, ADBaseWebSrvV2) {
        var service = this;

        service.resetAuthToken = function () {
            return ADBaseWebSrvV2.postJSON('/api/integrations/vectron/reset_auth_token');

        };
    }
]);
