angular.module('admin').service('ADCertificateSrv', ['$http', '$q', 'ADBaseWebSrvV2',
    function ($http, $q, ADBaseWebSrvV2) {

        var url = '/admin/certificates/public_key_for_qr_code_encryption';

        this.fetch = function () {
            return ADBaseWebSrvV2.getJSON(url);
        };

        this.save = function (certificates) {
            return ADBaseWebSrvV2.putJSON(url, certificates);
        };

    }
]);
