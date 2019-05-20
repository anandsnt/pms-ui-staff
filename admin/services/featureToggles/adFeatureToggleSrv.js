angular.module('admin')
    .service('ADFeatureToggleSrv', ['$http', '$q', 'ADBaseWebSrvV2', function ($http, $q, ADBaseWebSrvV2) {
        this.fetch = function () {
            return ADBaseWebSrvV2.getJSON('/api/features');
        };

        this.show = function (feature) {
            return ADBaseWebSrvV2.getJSON('/api/features/' + feature);
        };

        this.getHotels = function (params) {
            return ADBaseWebSrvV2.getJSON('/api/hotels', params);
        };

        this.fetchHotelStatus = function (params) {
            return ADBaseWebSrvV2.postJSON('/api/features/' + params.feature + '/hotels', params);
        };
    }]);
