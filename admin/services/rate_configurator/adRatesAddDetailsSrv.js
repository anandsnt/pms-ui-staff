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

            that.fetchBusinessDate = function(){
                var url = '/api/business_dates/active';
                ADBaseWebSrvV2.getJSON(url).then(function (data) {
                    that.addRatesDetailsData.business_date = data.business_date;
                    deferred.resolve(that.addRatesDetailsData);
                }, function (data) {
                    deferred.reject(data);
                });
                return deferred.promise;
            };

            that.fetchSelectedRestrictions = function () {
               var url = "/api/restriction_types";
                ADBaseWebSrvV2.getJSON(url).then(function (data) {
                    that.addRatesDetailsData.selectedRestrictions = data.results;
                    that.fetchBusinessDate();
                }, function (data) {
                    deferred.reject(data);
                });
                return deferred.promise;
              };

            that.fetchRestictionDetails = function () {
               var url = "/api/restriction_types";
                ADBaseWebSrvV2.getJSON(url).then(function (data) {
                    that.addRatesDetailsData.restrictionDetails = data.results;
                    that.fetchSelectedRestrictions();
                }, function (data) {
                    deferred.reject(data);
                });
                return deferred.promise;
              };

            that.fetchAddons = function () {
                var params = {
                    "is_active":true,
                    "is_not_reservation_only":true,
                    "per_page":1000,
                    "page":1
                };
                var url = "/api/addons";
                ADBaseWebSrvV2.getJSON(url, params).then(function (data) {
                    that.addRatesDetailsData.addons = data.results;
                    that.fetchRestictionDetails();
                }, function (data) {
                    deferred.reject(data);
                });
            };


            /*
             * Service function to fetch cancelation penalties
             * @return {object}  cancelation penalties
             */
            that.fetchCancelationPenalties = function () {
                var url = "/api/cancellation_policies";
                ADBaseWebSrvV2.getJSON(url).then(function (data) {
                    that.addRatesDetailsData.cancelationPenalties = data.results;
                    that.fetchAddons();

                }, function (data) {
                    deferred.reject(data);
                });
            };


            /*
             * Service function to fetch deposit policies
             * @return {object} deposit policies
             */
            that.fetchDepositPolicies = function () {
                var url = "/api/deposit_policies";
                ADBaseWebSrvV2.getJSON(url).then(function (data) {
                    that.addRatesDetailsData.depositPolicies = data.results;
                    that.fetchCancelationPenalties();
                }, function (data) {
                    deferred.reject(data);
                });
            };

               /*
             * Service function to fetch markets
             * @return {object} markets
             */
            that.fetchMarkets = function () {
                var url = "/api/market_segments?is_active=true";
                ADBaseWebSrvV2.getJSON(url).then(function (data) {
                    that.addRatesDetailsData.markets = data.markets;
                    that.addRatesDetailsData.is_use_markets = data.is_use_markets;
                    that.fetchDepositPolicies();
                }, function (data) {
                    deferred.reject(data);
                });
            };


            /*
             * Service function to fetch source
             * @return {object} source
             */
            that.fetchSources = function () {
                var url = "/api/sources.json?is_active=true";
                ADBaseWebSrvV2.getJSON(url).then(function (data) {
                    that.addRatesDetailsData.sources = data.sources;
                    that.addRatesDetailsData.is_use_sources = data.is_use_sources;
                    that.fetchMarkets();
                }, function (data) {
                    deferred.reject(data);
                });
            };

              /*
             * Service function to fetch charge codes
             * @return {object} charge codes
             */
            that.fetchChargeCodes = function () {
                var url = "/api/charge_codes?is_room_charge_code=true";
                ADBaseWebSrvV2.getJSON(url).then(function (data) {
                    that.addRatesDetailsData.charge_codes = data.results;
                    that.fetchSources();
                }, function (data) {
                    deferred.reject(data);
                });
            };


            /*
             * Service function to fetch HotelSettings
             * @return {object} HotelSettings
             */
            that.fetchHotelSettings = function () {
                var url = "/api/hotel_settings";
                ADBaseWebSrvV2.getJSON(url).then(function (data) {
                    that.addRatesDetailsData.hotel_settings = data;
                    that.fetchChargeCodes();
                }, function (data) {
                    deferred.reject(data);
                });
            };

            /*
             * Service function to rates
             * @return {object} rates
             */
            that.fetchBasedOnTypes = function (data) {
                var url = "/api/rates/minimal?exclude_expired=true";
                ADBaseWebSrvV2.getJSON(url, data).then(function (data) {
                    that.addRatesDetailsData.based_on = data;
                    that.fetchHotelSettings();

                }, function (data) {
                    deferred.reject(data);
                });
            };

            var url = "/api/rate_types/active";
            ADBaseWebSrvV2.getJSON(url).then(function (data) {
                that.addRatesDetailsData.rate_types = data;
                that.fetchBasedOnTypes();
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
         * Service function to validate end date
         * @return {object} status
         */
        this.validateEndDate = function (params) {
            var deferred = $q.defer();
            var url = "/api/rates/validate_end_date";
            ADBaseWebSrvV2.postJSON(url,params).then(function (data) {
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

        this.fetTasksForDefaultWorkType = function(params) {
            var deferred = $q.defer();
            var url = "/api/work_types/"+ params.work_type_id +"/tasks?stayover_only=true&is_active=true";
            ADBaseWebSrvV2.getJSON(url).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
    }
]);
