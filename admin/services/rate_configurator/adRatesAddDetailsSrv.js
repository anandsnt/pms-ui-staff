admin.service('ADRatesAddDetailsSrv', ['$q', 'ADBaseWebSrvV2',
    function ($q, ADBaseWebSrvV2) {

        this.addRatesDetailsData = {};
        var that = this;

        /*
         * Service function to fetch rate types
         * @return {object} rate types
         */
        this.fetchRateTypes = function () {

             var deferred = $q.defer();
              /*
             * Service function to fetch HotelSettings
             * @return {object} HotelSettings
             */
            this.fetchChargeCodes = function () {
                var url = "/api/charge_codes";
                ADBaseWebSrvV2.getJSON(url).then(function (data) {
                    that.addRatesDetailsData.charge_codes = data.results;
                    deferred.resolve(that.addRatesDetailsData);
                }, function (data) {
                    deferred.reject(data);
                });
            };

         
            /*
             * Service function to fetch HotelSettings
             * @return {object} HotelSettings
             */
            this.fetchHotelSettings = function () {
                var url = "/api/hotel_settings";
                ADBaseWebSrvV2.getJSON(url).then(function (data) {
                    that.addRatesDetailsData.hotel_settings = data;
                    this.fetchChargeCodes();
                }, function (data) {
                    deferred.reject(data);
                });
            };

            /*
             * Service function to rates
             * @return {object} rates
             */
            this.fetchBasedOnTypes = function (data) {
                var url = "/api/rates";
                var data = {
                    'page': '1',
                    'per_page': '10000',
                    'query': '',
                    'sort_dir': 'asc',
                    'sort_field': ''
                };
                ADBaseWebSrvV2.getJSON(url, data).then(function (data) {
                    that.addRatesDetailsData.based_on = data;
                    this.fetchHotelSettings();

                }, function (data) {
                    deferred.reject(data);
                });
            };

            var url = "/api/rate_types/active";
            ADBaseWebSrvV2.getJSON(url).then(function (data) {
                that.addRatesDetailsData.rate_types = data;
                this.fetchBasedOnTypes();
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        /*
         * Service function to create new rate
         * @params {object} rates details
         */
        this.createNewRate = function (data) {
            var deferred = $q.defer();
            var url = "/api/rates";
            ADBaseWebSrvV2.postJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        /*
         * Service function to update new rate
         * @params {object} rates details
         */
        this.updateNewRate = function (param) {

            var data = param.updatedData;
            var id = param.rateId;

            var deferred = $q.defer();
            var url = "/api/rates/" + param.rateId;

            ADBaseWebSrvV2.putJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
    }
]);