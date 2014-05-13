admin.service('ADRatesSrv', ['$http', '$q', 'ADBaseWebSrvV2',
    function ($http, $q, ADBaseWebSrvV2) {

        this.fetchRates = function (data) {
            var deferred = $q.defer();

            var url = "/api/rates.json";
            ADBaseWebSrvV2.getJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchRateTypes = function () {
            var deferred = $q.defer();

            //var url = " /sample_json/ng_admin/rate_types.json";
            var url = "/api/rate_types.json";
            ADBaseWebSrvV2.getJSON(url).then(function (data) {
                deferred.resolve(data.results);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.importRates = function () {
            var deferred = $q.defer();
            var url = "/api/rates/import";
            ADBaseWebSrvV2.postJSON(url).then(function (data) {
                deferred.resolve(data.results);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchDateRanges = function (params) {
            var deferred = $q.defer();

            var url = "/api/rates/" + params.rate_id + "/rate_date_ranges";
            ADBaseWebSrvV2.getJSON(url).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        var that = this;
        this.rateDetails = {};

        // get rate details
        this.fetchDetails = function (params) {
            var deferred = $q.defer();
            // fetch hotel business date
            this.fetchHotelInfo = function () {
                var url = "/api/rover_header_info";
                ADBaseWebSrvV2.getJSON(url).then(function (data) {
                    data = data.data;
                    that.rateDetails.business_date = data.business_date;
                    deferred.resolve(that.rateDetails);
                }, function (data) {
                    deferred.reject(data);
                });

            }



            var url = "/api/rates/" + params.rateId;
            ADBaseWebSrvV2.getJSON(url).then(function (data) {
                that.rateDetails = data;
                this.fetchHotelInfo();
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

    }
]);