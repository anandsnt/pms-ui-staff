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
            return this.getJSON(url, params);
        };

        service.fetchAllRoomTypesInfo = function (params) {
            var url = '/api/daily_rates/room_restrictions';
            return this.getJSON(url, params);
        };

        service.fetchSingleRateInfo = function (params) {
            var url = '/api/daily_rates/' + params.rate_id;
            return this.getJSON(url, _.omit(params, 'rate_id'));
        };

        service.fetchRates = function () {
            var url = '/api/rates/minimal';
            return this.getJSON(url);
        };        

        service.fetchRestrictionTypes = function() {
            var url = '/api/restriction_types';
            return this.getJSON(url, undefined, 'results');
        };

        service.applyAllRestrictions = (params) => {
            var url = '/api/daily_rates';
            return this.postJSON(url, params);
        };

        service.fetchRateDetails = (params) => {
            var url = '/api/rates/' + params.rate_id;
            return this.getJSON(url);
        };

        service.fetchRoomTypes = () => {
            var url = '/api/room_types.json?exclude_pseudo=true&exclude_suite=true';
            return this.getJSON(url, undefined, 'results');
        };

        service.removeCustomRate = (params) => {
            var url = '/api/daily_rates/remove_custom_rate';
            return this.postJSON(url, params);
        };
        
        service.updateSingleRateRestrictionData = (params) => {
            var url = '/api/daily_rates/';
            return this.postJSON(url, params);
        };


        service.fetchCommonRestrictions = (params) => {
            var url = '/api/daily_rates/all_restrictions';
            return this.getJSON(url, params);           
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
                    ..._.pick(params, 'from_date', 'to_date', 'varied_inclusive'),
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
                let paramsForCommonRestrictions = _.pick(params, 'from_date', 'to_date', 'varied_inclusive');

                if(params.room_type_id) {
                    paramsForCommonRestrictions['room_type_ids[]'] = [params.room_type_id];
                }

                promises.push(service.fetchCommonRestrictions(paramsForCommonRestrictions)
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

        /**
         * utility method as getJSON is repeating all the time
         * @param  {String} url
         * @param  {Object} params 
         * @return {Object} Promise
         */
        this.getJSON = (url, params, keyFromResult) => {
            var deferred = $q.defer();
            BaseWebSrvV2.getJSON(url, params).then(function (data) {
                deferred.resolve(keyFromResult ? data[keyFromResult] : data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise; 
        };

        /**
         * utility method as postJSON is repeating all the time
         * @param  {String} url
         * @param  {Object} params 
         * @return {Object} Promise
         */
        this.postJSON = (url, params) => {
            var deferred = $q.defer();
            BaseWebSrvV2.postJSON(url, params)
                .then(data => {
                    deferred.resolve(data);
                }, error => {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        /**
         * to fetch the diffent restriction with status against for rates/roomTypes 
         * @param  {Object} params [API params]
         * @return {Object} Promise
         */
        this.fetchAllRestrictionsWithStatus = (params) => {
            var url = '/api/daily_rates/all_restriction_statuses';
            return this.getJSON(url, params);
        };

        /**
         * to fetch the different restriction and room types
         * @param  {Object} params [api params]
         * @return {Object}        [promise]
         */
        this.fetchRoomTypeWithRestrictionStatus = (params) => {
            var promises = [],
                deferred = $q.defer(),
                response = {};

            //room types info.
            var paramsForFetchRoomType = _.omit(params, 'fetchRoomTypes');
            promises.push(
                this.fetchAllRoomTypesInfo(paramsForFetchRoomType)
                .then((data) => {
                    response.roomTypeAndRestrictions = data.results;
                })
            );

            //different restriction
            var paramsForCommonRestrictions = _.pick(params, 'from_date', 'to_date');
            if(params.room_type_id) {
                paramsForCommonRestrictions['room_type_ids[]'] = [params.room_type_id];
            }
            promises.push(
                this.fetchAllRestrictionsWithStatus(paramsForCommonRestrictions)
                .then((data) => {
                    response.restrictionsWithStatus = data.results;
                })
            );
            

            if (params.fetchRoomTypes) {
                promises.push(
                    this.fetchRoomTypes()
                    .then((data) => {
                        response.roomTypes = data;
                    })
                );
            }

            $q.all(promises).then((data) => {
                deferred.resolve(response);
            });

            return deferred.promise;
        };

        /**
         * to fetch the common restriction and single rate details
         * @param  {Object} params [api params]
         * @return {Object}        [promise]
         */
        this.fetchSingleRateDetailsAndCommonRestrictions = (params) => {
            var promises = [],
                deferred = $q.defer(),
                response = {};

            //single rate info.
            var paramsForSingleRate = _.omit(params, 'fetchRoomTypes', 'fetchRates');
            promises.push(
                this.fetchSingleRateInfo( paramsForSingleRate )
                .then( data => {
                    response.roomTypeAndRestrictions = data.results;
                })
            );

            //common restriction params
            var commonRestrictionsParams = {
                ..._.pick(params, 'from_date', 'to_date'),
                'rate_ids[]': [params.rate_id]
            };
            promises.push(
                this.fetchAllRestrictionsWithStatus( commonRestrictionsParams )
                .then( data => {
                    response.restrictionsWithStatus = data.results;
                })
            );
            

            if (params.fetchRoomTypes) {
                promises.push(
                    this.fetchRoomTypes()
                    .then((data) => {
                        response.roomTypes = data;
                    })
                );
            }
            if (params.fetchRates) {
                promises.push(
                    this.fetchRates()
                    .then((data) => {
                        response.rates = data.results;
                    })
                );
            }

            $q.all(promises).then((data) => {
                deferred.resolve(response);
            });

            return deferred.promise;
        };

        /**
         * to fetch single rate's restriction and amount details
         * @param  {Object} params [api params]
         * @return {Object}        [promise]
         */
        this.fetchSingleRateRestrictionsAndAmountsDetails = (params) => {
            var promises = [],
                deferred = $q.defer(),
                response = {};

            //fetch single rate info
            var paramsForSingleRateInfo = _.omit(params, 'fetchRoomTypes', 'fetchRates');
            promises.push(
                this.fetchSingleRateInfo(paramsForSingleRateInfo)
                .then((data) => {
                    response.roomTypeAndRestrictions = data.results;
                })
            );

            //varied and common restrictions
            var commonRestrictionsParams = {
                ..._.pick(params, 'from_date', 'to_date'),
                'rate_ids[]': [params.rate_id]
            }
            if(params.room_type_id) {
                commonRestrictionsParams['room_type_ids[]'] = [params.room_type_id];
            }            
            promises.push(
                this.fetchAllRestrictionsWithStatus(commonRestrictionsParams)
                .then((data) => {
                    response.restrictionsWithStatus = data.results;
                })
            );
            

            if (params.fetchRoomTypes) {
                promises.push(
                    this.fetchRoomTypes()
                    .then((data) => {
                        response.roomTypes = data;
                    })
                );
            }
            if (params.fetchRates) {
                promises.push(
                    this.fetchRates()
                    .then((data) => {
                        response.rates = data.results;
                    })
                );
            }

            $q.all(promises).then((data) => {
                deferred.resolve(response);
            });

            return deferred.promise;
        };

        /**
         * to fetch the common restriction with restriction status and daily rates
         * @param  {Object} params [API params]
         * @return {Object} Promise
         */
        this.fetchRateRestrictionDetailsAndCommonRestrictions = ( params ) => {
            var promises = [],
                deferred = $q.defer(),
                response = {};

            //rate restriction details fetch
            var paramsForRateRestrictionAPI = _.omit(params, 
                'fetchRates',
                'considerRateIDsInAllRestrictionStatusFetch'
            );
            promises.push(
                service.fetchMultipleRateInfo( paramsForRateRestrictionAPI )
                .then(( data ) => {
                    response.dailyRateAndRestrictions = data.results;
                    response.totalCount = data.total_count;
                })
            );

            //restrcition details with status
            var paramsForCommonRestrictions = _.pick(params, 
                'from_date',
                'to_date',
                'name_card_ids[]',
                'varied_inclusive',
                'rate_type_ids[]',
            );
            if(params['considerRateIDsInAllRestrictionStatusFetch']){
               paramsForCommonRestrictions['rate_ids[]'] = params['rate_ids[]']; 
            }

            promises.push(
                service.fetchAllRestrictionsWithStatus( paramsForCommonRestrictions )
                .then(( data ) => {
                    response.restrictionsWithStatus = data.results;
                })
            );
            
            //fetch all and return the results
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
                    ..._.pick(params, 'from_date', 'to_date', 'name_card_ids[]', 'varied_inclusive')
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