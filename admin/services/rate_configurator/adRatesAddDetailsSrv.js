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
             * Service function to fetch cancelation penalties
             * @return {object}  cancelation penalties
             */
            this.fetchCancelationPenalties = function () {
                var url = " /api/policies?policy_type=CANCEL_PENALTIES";
                ADBaseWebSrvV2.getJSON(url).then(function (data) {
                    that.addRatesDetailsData.cancelationPenalties = data.results;
                    console.log(that.addRatesDetailsData)
                    deferred.resolve(that.addRatesDetailsData);
                }, function (data) {
                    deferred.reject(data);
                });
            };


            /*
             * Service function to fetch deposit policies
             * @return {object} deposit policies
             */
            this.fetchDepositPolicies = function () {
                var url = "/api/policies?policy_type=DEPOSIT_REQUESTED";
                ADBaseWebSrvV2.getJSON(url).then(function (data) {
                    that.addRatesDetailsData.depositPolicies = data.results;
                    this.fetchCancelationPenalties();
                }, function (data) {
                    deferred.reject(data);
                });
            };

               /*
             * Service function to fetch markets
             * @return {object} markets
             */
            this.fetchMarkets = function () {
                var url = "/api/market_segments?is_active=true";
                ADBaseWebSrvV2.getJSON(url).then(function (data) {
                    that.addRatesDetailsData.markets = data.markets;
                    this.fetchDepositPolicies();
                }, function (data) {
                    deferred.reject(data);
                });
            };


            /*
             * Service function to fetch source
             * @return {object} source
             */
            this.fetchSources = function () {
                var url = "/api/sources.json?is_active=true";
                ADBaseWebSrvV2.getJSON(url).then(function (data) {
                    that.addRatesDetailsData.sources = data.sources;
                    this.fetchMarkets();
                }, function (data) {
                    deferred.reject(data);
                });
            };

              /*
             * Service function to fetch charge codes
             * @return {object} charge codes
             */
            this.fetchChargeCodes = function () {
                var url = "/api/charge_codes";
                ADBaseWebSrvV2.getJSON(url).then(function (data) {
                    that.addRatesDetailsData.charge_codes = data.results;
                    this.fetchSources();
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