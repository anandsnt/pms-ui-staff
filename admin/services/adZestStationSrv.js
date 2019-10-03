admin.service('ADZestStationSrv', ['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2) {


    this.fetch = function() {
        var deferred = $q.defer();
        var url = '/api/hotel_settings/kiosk';

        ADBaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    this.fetchZestStationData = function() {
        var deferred = $q.defer();
        var url = '/api/zest_stations';

        ADBaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };


    this.save = function(data) {
        var deferred = $q.defer();
        var url = '/api/hotel_settings/change_settings';

        ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    this.saveImages = function(data) {
        var url = '/api/hotel_settings/save_configurable_images';

        return ADBaseWebSrvV2.postJSON(url, data);
    };

    this.getImages = function() {
        var url = '/api/hotel_settings/configurable_images';

        return ADBaseWebSrvV2.getJSON(url);
    };

     this.excludePaymenTypes = function(params) {
        var url = '/admin/hotel_payment_types/apply_exclusion';

        return ADBaseWebSrvV2.postJSON(url, params);
    };

    this.savePassportNumberBypassReason = function (data) {
        var url = '/api/hotel_settings/save_passport_entry_bypass_reason';

        return ADBaseWebSrvV2.postJSON(url, data);
    };

    this.deletePassportNumberBypassReason = function (data) {
        var url = '/api/hotel_settings/delete_passport_entry_bypass_reason';

        return ADBaseWebSrvV2.postJSON(url, data);
    };

}]);