angular.module('sntRover').service('rvRateManagerCoreSrv', ['$q', 'BaseWebSrvV2',
    function ($q, BaseWebSrvV2) {

        /**
         * A. MULTIPLE RATES
         *      /api/daily/rates
         *      Request Params
         *          1. rate_type_ids
         *          2. rate_ids
         *          3. name_card_ids
         *          4. group_by
         *          5. order_id
         *          6. from_date
         *          7. to_date
         * B. ALL ROOM TYPES
         *      /api/daily_rates/room_restrictions
         *      Request Params
         *          1. from_date
         *          2. to_date
         *          3. order_id
         * C. INDIVIDUAL RATE
         *      /api/daily_rates/:id
         *      Request Params
         *          1. from_date
         *          2. to_date
         *          3. order_id
         */

        var service = this;

        this.activeRates = null;

        service.fetchMultipleRateInfo = function (params) {
            var url = '/api/daily_rates';
            var deferred = $q.defer();
            BaseWebSrvV2.getJSON(url, params).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        service.fetchAllRoomTypesInfo = function (params) {
            var url = '/api/daily_rates/room_restrictions';
            var deferred = $q.defer();
            BaseWebSrvV2.getJSON(url, params).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        service.fetchSingleRateInfo = function (params) {
            var url = '/api/daily_rates/' + params.rate_id;
            var deferred = $q.defer();
            BaseWebSrvV2.getJSON(url, _.omit(params, 'rate_id')).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        service.fetchRates = function () {
            var url = '/api/rates/minimal';
            var deferred = $q.defer();
            BaseWebSrvV2.getJSON(url).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };        

        service.fetchRestrictionTypes = function() {
            var url = '/api/restriction_types';
            var deferred = $q.defer();
            BaseWebSrvV2.getJSON(url).then(function (data) {
                deferred.resolve(data.results);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        service.applyAllRestrictions = (params) => {
            var url = ' /api/daily_rates';
            var deferred = $q.defer();
            BaseWebSrvV2.postJSON(url, params).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        service.fetchRateDetails = (params) => {
            var url = ' /api/rates/' + params.rate_id;
            var deferred = $q.defer();
            BaseWebSrvV2.getJSON(url).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        service.fetchRoomTypes = () => {
            var url = '/api/room_types.json?exclude_pseudo=true&exclude_suite=true';
            var deferred = $q.defer();
            BaseWebSrvV2.getJSON(url).then(function (data) {
                deferred.resolve(data.results);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        service.removeCustomRate = (params) => {
            var url = '/api/daily_rates/remove_custom_rate',
                deferred = $q.defer();

            BaseWebSrvV2.postJSON(url, params)
                .then(data => {
                    deferred.resolve(data);
                }, error => {
                    deferred.reject(error);
                });
            return deferred.promise;
        };
        
        service.updateSingleRateRestrictionData = (params) => {
            var url = '/api/daily_rates/',
                deferred = $q.defer();

            BaseWebSrvV2.postJSON(url, params)
                .then(data => {
                    deferred.resolve(data);
                }, error => {
                    deferred.reject(error);
                });
            return deferred.promise;
        };


        service.fetchCommonRestrictions = (params) => {
            var url = '/api/daily_rates/all_restrictions';
            var deferred = $q.defer();
            BaseWebSrvV2.getJSON(url, params).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;           
        };

        service.fetchSingleRateDetailsAndRoomTypes = (params) => {
            var promises = [],
                roomTypes = [],
                rates = [],
                roomTypeAndRestrictions = [],
                commonRestrictions = [],
                deferred = $q.defer(),
                response = {};

            promises.push(service.fetchSingleRateInfo(_.omit(params, 'fetchRoomTypes', 'fetchCommonRestrictions', 'fetchRates')).then((data) => {
                response.roomTypeAndRestrictions = data.results;
            }));

            if(params.fetchCommonRestrictions){
                let commonRestrictionsParams = {
                    ..._.pick(params, 'from_date', 'to_date'),
                    'rate_ids[]': [params.rate_id]
                }
                promises.push(service.fetchCommonRestrictions(commonRestrictionsParams)
                    .then((data) => {
                        response.commonRestrictions = data.results;
                    })
                );
            }

            if (params.fetchRoomTypes) {
                promises.push(service.fetchRoomTypes().then((data) => {
                    response.roomTypes = data;
                }));
            }
            if (params.fetchRates) {
                promises.push(service.fetchRates().then((data) => {
                    response.rates = data.results;
                }));
            }

            $q.all(promises).then((data) => {
                deferred.resolve(response);
            });

            return deferred.promise;
        };

        service.fetchRatesAndRoomTypes = (params) => {
            var promises = [],
                roomTypes = [],
                roomTypeAndRestrictions = [],
                commonRestrictions = [],
                deferred = $q.defer(),
                response = {};

            promises.push(service.fetchAllRoomTypesInfo(_.omit(params, 'fetchRoomTypes', 'fetchCommonRestrictions')).then((data) => {
                response.roomTypeAndRestrictions = data.results;
            }));

            if(params.fetchCommonRestrictions){
                promises.push(service.fetchCommonRestrictions(_.pick(params, 'from_date', 'to_date'))
                    .then((data) => {
                        response.commonRestrictions = data.results;
                    })
                );
            }

            if (params.fetchRoomTypes) {
                promises.push(service.fetchRoomTypes().then((data) => {
                    response.roomTypes = data;
                }));
            }
            $q.all(promises).then((data) => {
                deferred.resolve(response);
            });

            return deferred.promise;
        };

        service.fetchRatesAndDailyRates = (params) => {
            var promises = [],
                rates = [],
                dailyRateAndRestrictions = [],
                deferred = $q.defer(),
                commonRestrictions = [],
                totalCount = 0,
                response = {};

            promises.push(service.fetchMultipleRateInfo(_.omit(params, 'fetchRates', 'fetchCommonRestrictions', 'considerRateIDsInCommonRestriction')).then((data) => {
                response.dailyRateAndRestrictions = data.results;
                response.totalCount = data.total_count;
            }));

            if(params.fetchCommonRestrictions){

                let paramsForCommonRestrictions = {
                    ..._.pick(params, 'from_date', 'to_date', 'name_card_ids[]')
                };

                if(params["rate_type_ids[]"]) {
                    paramsForCommonRestrictions['rate_type_ids[]'] = params['rate_type_ids[]']; 
                }
                
                if(params['considerRateIDsInCommonRestriction']){
                   paramsForCommonRestrictions['rate_ids[]'] = params['rate_ids[]']; 
                }

                promises.push(service.fetchCommonRestrictions(paramsForCommonRestrictions)
                    .then((data) => {
                        response.commonRestrictions = data.results;
                    })
                );
            }          

            if (params.fetchRates) {
                promises.push(service.fetchRates().then((data) => {
                    response.rates = data.results;
                }));
            }

            $q.all(promises).then((data) => {
                deferred.resolve(response);
            });

            return deferred.promise;
        }; 

    }
]);