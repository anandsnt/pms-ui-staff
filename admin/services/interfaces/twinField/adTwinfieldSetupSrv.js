admin.service('adTwinfieldSetupSrv', [
    '$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2) {

        var service = this;

        service.getPaymentChargeCodes = function() {
            return ADBaseWebSrvV2.getJSON('/admin/charge_codes/list.json?charge_code_type=PAYMENT&per_page=100');
        };

        service.getAuthorizationURI = function() {
            return ADBaseWebSrvV2.getJSON('/api/hotel_settings/twinfield/authorize');
        };

    }]);
