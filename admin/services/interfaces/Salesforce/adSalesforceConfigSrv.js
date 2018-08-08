admin.service('adSalesforceConfigSrv', ['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2) {
    var service = this;

    service.authorize = function() {
        return ADBaseWebSrvV2.getJSON('/api/hotel_settings/salesforce/authorize');
    };

}]);
