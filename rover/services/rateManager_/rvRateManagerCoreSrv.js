angular.module('sntRover').service('rvRateManagerCoreSrv', ['$q', 'BaseWebSrvV2', 'rvRateManagerRestrictionsSrv', 'rvRateManagerHierarchyRestrictionsSrv',
    function($q, BaseWebSrvV2, rvRateManagerRestrictionsSrv, rvRateManagerHierarchyRestrictionsSrv) {

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

        service.fetchMultipleRateInfo = function(params) {
            var url = rvRateManagerRestrictionsSrv.rateRestrictionsUrl(params);

            params = _.omit(params, 'restrictionType', 'hierarchialRateRestrictionRequired');
            return this.getJSON(url, params);
        };

        service.fetchRateWithAmount = function(params) {
            var url = '/api/daily_rates/rates_amount_by_date';

            params = _.omit(params, 'restrictionType', 'hierarchialRateRestrictionRequired');
            return this.getJSON(url, params);
        };

        service.fetchAllRoomTypesInfo = function(params) {
            var url = rvRateManagerRestrictionsSrv.roomTypeRestrictionUrl(params);

            params = _.omit(params, 'restrictionType', 'hierarchialRoomTypeRestrictionRequired');

            return this.getJSON(url, params);
        };

        service.fetchAllRateTypesInfo = function(params) {
            var deferred = $q.defer(),
                url = rvRateManagerRestrictionsSrv.rateTypeRestrictionsUrl(params);

            params = _.omit(params, 'restrictionType', 'hierarchialRateTypeRestrictionRequired');

            BaseWebSrvV2.getJSON(url, params).then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        service.fetchRateTypeList = function() {
            var url = '/api/rate_types/active';

            return this.getJSON(url);
        };

        service.fetchSingleRateInfo = function(params) {
            var url = '/api/daily_rates/' + params.rate_id;

            return this.getJSON(url, _.omit(params, 'rate_id'));
        };

        service.fetchSingleRateTypeInfo = function(params) {
            var url = '/api/daily_rates/rate_restrictions';

            return this.getJSON(url, params);
        };

        service.fetchRates = function() {
            var url = '/api/rates/minimal';

            return this.getJSON(url);
        };

        service.fetchRestrictionTypes = function() {
            var url = '/api/restriction_types';

            return this.getJSON(url, undefined, 'results');
        };

        service.applyAllRestrictions = (params) => {
            var url = rvRateManagerRestrictionsSrv.getURLforApplyAllRestrictions(params);
            
            params = rvRateManagerRestrictionsSrv.processParamsforApplyAllRestrictions(params);
            return this.postJSON(url, params);
        };

        service.fetchRateDetails = (params) => {
            var url = '/api/rates/' + params.rate_id;

            return this.getJSON(url);
        };

        service.fetchRoomTypes = () => {
            var url = '/api/room_types.json?exclude_pseudo=true';

            return this.getJSON(url, undefined, 'results');
        };

        service.removeCustomRate = (params) => {
            var url = '/api/daily_rates/remove_custom_rate';

            return this.postJSON(url, params);
        };

        service.updateSingleRateRestrictionData = (params) => {
            var url = rvRateManagerRestrictionsSrv.getURLforApplyAllRestrictions(params);

            params = rvRateManagerRestrictionsSrv.processParamsforApplyAllRestrictions(params);
            return this.postJSON(url, params);
        };

        service.fetchCommonRestrictions = (params) => {
            var url = '/api/daily_rates/all_restrictions';

            return this.getJSON(url, params);
        };

        service.fetchActiveRestrictionsList = (params) => {
            var url = '/api/restriction_types';

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

            if (params.fetchCommonRestrictions) {
                let commonRestrictionsParams = {
                    ..._.pick(params, 'from_date', 'to_date', 'varied_inclusive'),
                    'rate_ids[]': [params.rate_id]
                };

                promises.push(service.fetchCommonRestrictions(commonRestrictionsParams)
                    .then((data) => {
                        response.commonRestrictions = data.results;
                    })
                );
            }

            fetchPanelRestritctions(promises, response, params);

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

            
            promises.push(service.fetchRoomTypeAvailability(params).then((data) => {
                response.roomTypeAvailability = data;
            }));

            $q.all(promises).then(() => {
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
                response.roomTypeAndRestrictions = params.hierarchialRoomTypeRestrictionRequired ?
                rvRateManagerRestrictionsSrv.processRoomTypeRestrictionResponse(data.results) :
                data.results;
            }));

            if (params.fetchCommonRestrictions) {
                let paramsForCommonRestrictions = _.pick(params, 'from_date', 'to_date', 'varied_inclusive');

                if (params.room_type_id) {
                    paramsForCommonRestrictions['room_type_ids[]'] = [params.room_type_id];
                }

                promises.push(service.fetchCommonRestrictions(paramsForCommonRestrictions)
                    .then((data) => {
                        response.commonRestrictions = data.results;
                    })
                );
            }

            fetchPanelRestritctions(promises, response, params);

            if (params.fetchRoomTypes) {
                promises.push(service.fetchRoomTypes().then((data) => {
                    response.roomTypes = data;
                }));
            }

            promises.push(service.fetchRoomTypeAvailability(params).then((data) => {
                response.roomTypeAvailability = data;
            }));

            $q.all(promises).then((data) => {
                deferred.resolve(response);
            });

            return deferred.promise;
        };

        service.fetchRateTypes = (params) => {
            var promises = [],
                roomTypes = [],
                roomTypeAndRestrictions = [],
                commonRestrictions = [],
                deferred = $q.defer(),
                response = {};

            promises.push(service.fetchAllRateTypesInfo(_.omit(params, 'fetchCommonRestrictions', 'fetchRateTypes')).then((data) => {
                response.rateTypeAndRestrictions = params.hierarchialRateTypeRestrictionRequired ?
                                                    rvRateManagerRestrictionsSrv.processRateTypeRestrictionResponse(data.results) :
                                                    data.results;
                response.totalCount = data.total_count || data.results[0].rate_types.length;
            }));

            if (params.fetchCommonRestrictions) {
                let paramsForCommonRestrictions = _.pick(params, 'from_date', 'to_date', 'varied_inclusive');

                promises.push(service.fetchCommonRestrictions(paramsForCommonRestrictions)
                    .then((data) => {
                        response.commonRestrictions = data.results;
                    })
                );
            }

            fetchPanelRestritctions(promises, response, params);

            if (params.fetchRateTypes) {
                promises.push(service.fetchRateTypeList().then((data) => {
                    response.rateTypes = data;
                }));
            }

            $q.all(promises).then((data) => {
                deferred.resolve(response);
            });
            return deferred.promise;
        };

        var fetchPanelRestritctions = (promises, response, params) => {
            // Adding as part of CICO-77002, laying out base. House panel restrictions to be added in later story
            // as it is currently taken as common restriction which has use in many other places.
            var activeHierarchies = _.pluck(_.where(rvRateManagerRestrictionsSrv.activeHierarchyRestrictions(), {active: true}), 'level'),
                options = {
                    from_date: params.from_date,
                    to_date: params.to_date,
                    'levels[]': activeHierarchies
                };

            if (activeHierarchies.length !== 0) {
                response.panelRestrictions = {};
                promises.push(
                    rvRateManagerHierarchyRestrictionsSrv.fetchHierarchyRestrictions(options).then((data) => {
                        response.panelRestrictions.houseRestrictions = rvRateManagerRestrictionsSrv.formatRestrictionsData(data.house, {forPanel: true});
                        response.panelRestrictions.rateTypeRestrictions = rvRateManagerRestrictionsSrv.formatRestrictionsData(data.rate_type, {forPanel: true});
                        response.panelRestrictions.roomTypeRestrictions = rvRateManagerRestrictionsSrv.formatRestrictionsData(data.room_type, {forPanel: true});
                        response.panelRestrictions.rateRestrictions = rvRateManagerRestrictionsSrv.formatRestrictionsData(data.rate, {forPanel: true});
                    })
                );
            }
        };

        /**
         * utility method as getJSON is repeating all the time
         * @param  {String} url
         * @param  {Object} params
         * @return {Object} Promise
         */
        this.getJSON = (url, params, keyFromResult) => {
            params = _.omit(params, 'restrictionType', 'hierarchialRateTypeRestrictionRequired');
            var deferred = $q.defer();

            BaseWebSrvV2.getJSON(url, params).then(function(data) {
                deferred.resolve(keyFromResult ? data[keyFromResult] : data);
            }, function(data) {
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
            var url = rvRateManagerRestrictionsSrv.getURLforAllRestrictionsWithStatus( params );

            params = _.omit(params, 'restrictionType', 'hierarchialRoomTypeRestrictionRequired', 'hierarchialRateTypeRestrictionRequired', 'hierarchialRateRestrictionRequired');

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

            // room types info.
            var paramsForFetchRoomType = _.omit(params, 'fetchRoomTypes');

            promises.push(
                this.fetchAllRoomTypesInfo(paramsForFetchRoomType)
                    .then((data) => {
                        response.roomTypeAndRestrictions = data.results;
                    })
            );

            // different restriction
            var paramsForCommonRestrictions = _.pick(params, 'from_date', 'to_date', 'restrictionType', 'hierarchialRoomTypeRestrictionRequired');

            if (params.room_type_id) {
                paramsForCommonRestrictions['room_type_ids[]'] = [params.room_type_id];
            }
            promises.push(
                this.fetchAllRestrictionsWithStatus(paramsForCommonRestrictions)
                    .then((data) => {
                        response.restrictionsWithStatus = params.hierarchialRoomTypeRestrictionRequired ?
                        rvRateManagerRestrictionsSrv.processRoomTypeRestrictionResponse(data.results) :
                        data.results;
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

            $q.all(promises).then(() => {
                deferred.resolve(response);
            });

            return deferred.promise;
        };

        /**
         * to fetch the common restriction and single rate details
         * @param  {Object} params [api params]
         * @return {Object}        [promise]
         */
        this.fetchSingleRateTypeDetailsAndCommonRestrictions = (params) => {
            var promises = [],
                deferred = $q.defer(),
                response = {};

            // single rate info.
            var paramsForSingleRateType = _.omit(params, 'fetchRoomTypes', 'fetchRates');

            promises.push(
                this.fetchSingleRateTypeInfo(paramsForSingleRateType)
                    .then(data => {
                        response.rateAndRestrictions = data.results;
                    })
            );

            // common restriction params
            var commonRestrictionsParams = _.pick(params, 'from_date', 'to_date', 'restrictionType', 'hierarchialRateTypeRestrictionRequired');

            if (params.rate_type_id) {
                commonRestrictionsParams['rate_type_ids[]'] = [params.rate_type_id];
            }

            promises.push(
                this.fetchAllRestrictionsWithStatus(commonRestrictionsParams)
                    .then(data => {
                        response.restrictionsWithStatus = params.hierarchialRateTypeRestrictionRequired ?
                        rvRateManagerRestrictionsSrv.processRateTypeRestrictionResponse(data.results) :
                        data.results;
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

            $q.all(promises).then(() => {
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

            // single rate info.
            var paramsForSingleRate = _.omit(params, 'fetchRoomTypes', 'fetchRates', 'hierarchialRateRestrictionRequired');

            promises.push(
                this.fetchSingleRateInfo(paramsForSingleRate)
                    .then(data => {
                        response.roomTypeAndRestrictions = data.results;
                    })
            );

            // common restriction params
            var commonRestrictionsParams = {
                ..._.pick(params, 'from_date', 'to_date', 'hierarchialRateRestrictionRequired'),
                'rate_ids[]': [params.rate_id]
            };

            promises.push(
                this.fetchAllRestrictionsWithStatus(commonRestrictionsParams)
                    .then(data => {

                        if (params.hierarchialRateRestrictionRequired) {
                            var processedData = rvRateManagerRestrictionsSrv.processRateRestrictionResponse(data.results, true);
                                
                            response.restrictionsWithStatus = [{
                                date: data.results[0].date,
                                restrictions: processedData[0].rates[0].restrictions
                            }];
                        }
                        else {
                            response.restrictionsWithStatus = data.results;
                        }
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

            $q.all(promises).then(() => {
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

            // fetch single rate info
            var paramsForSingleRateInfo = _.omit(params, 'fetchRoomTypes', 'fetchRates');

            promises.push(
                this.fetchSingleRateInfo(paramsForSingleRateInfo)
                    .then((data) => {
                        response.roomTypeAndRestrictions = data.results;
                    })
            );

            // varied and common restrictions
            var commonRestrictionsParams = {
                ..._.pick(params, 'from_date', 'to_date', 'restrictionType'),
                'rate_ids[]': [params.rate_id]
            };

            if (params.room_type_id) {
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

            $q.all(promises).then(() => {
                deferred.resolve(response);
            });

            return deferred.promise;
        };

        /**
         * to fetch the common restriction with restriction status and daily rates
         * @param  {Object} params [API params]
         * @return {Object} Promise
         */
        this.fetchRateRestrictionDetailsAndCommonRestrictions = (params) => {
            var promises = [],
                deferred = $q.defer(),
                response = {};

            // rate restriction details fetch
            var paramsForRateRestrictionAPI = _.omit(params,
                'fetchRates',
                'considerRateIDsInAllRestrictionStatusFetch'
            );

            promises.push(
                service.fetchMultipleRateInfo(paramsForRateRestrictionAPI)
                    .then((data) => {
                        response.dailyRateAndRestrictions = data.results;
                        response.totalCount = data.total_count;
                    })
            );

            // restrcition details with status
            var paramsForCommonRestrictions = _.pick(params,
                'from_date',
                'to_date',
                'name_card_ids[]',
                'varied_inclusive',
                'rate_type_ids[]',
                'restrictionType'
            );

            if (params['considerRateIDsInAllRestrictionStatusFetch']) {
                paramsForCommonRestrictions['rate_ids[]'] = params['rate_ids[]'];
            }

            promises.push(
                service.fetchAllRestrictionsWithStatus(paramsForCommonRestrictions)
                    .then((data) => {
                        response.restrictionsWithStatus = data.results;
                    })
            );

            // fetch all and return the results
            $q.all(promises).then(() => {
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

            // CICO-77791
            let paramsForRateAPI = _.omit(params, 'fetchRates', 'fetchCommonRestrictions', 'considerRateIDsInCommonRestriction');

            if (params.hierarchialRateRestrictionRequired) {
                promises.push(service.fetchRateWithAmount(paramsForRateAPI).then((data) => {
                    response.rateAmountList = data.results;
                }));
            }

            promises.push(service.fetchMultipleRateInfo(paramsForRateAPI).then((data) => {
                response.dailyRateAndRestrictions = data.results;
                response.totalCount = data.total_count || data.results[0].rates.length;
            }));

            if (params.fetchCommonRestrictions) {

                let paramsForCommonRestrictions = {
                    ..._.pick(params, 'from_date', 'to_date', 'name_card_ids[]', 'varied_inclusive')
                };

                if (params["rate_type_ids[]"]) {
                    paramsForCommonRestrictions['rate_type_ids[]'] = params['rate_type_ids[]'];
                }

                if (params['considerRateIDsInCommonRestriction']) {
                    paramsForCommonRestrictions['rate_ids[]'] = params['rate_ids[]'];
                }

                promises.push(service.fetchCommonRestrictions(paramsForCommonRestrictions)
                    .then((data) => {
                        response.commonRestrictions = data.results;
                    })
                );
            }

            fetchPanelRestritctions(promises, response, params);

            if (params.fetchRates) {
                promises.push(service.fetchRates().then((data) => {
                    response.rates = data.results;
                }));
            }

            $q.all(promises).then(() => {
                if (params.hierarchialRateRestrictionRequired) {
                    let concatedRateData = rvRateManagerRestrictionsSrv.concatRateWithAmount(response.rateAmountList, response.dailyRateAndRestrictions);

                    response.dailyRateAndRestrictions =  rvRateManagerRestrictionsSrv.processRateRestrictionResponse(concatedRateData);
                }
                deferred.resolve(response);
            });

            return deferred.promise;
        };

        /**
         * Fetch house availability for the given date range
         * @param {Object} params - hold the request params
         * @return {Promise}
         */
        service.fetchHouseAvailability = (params) => {
            var url = '/api/availability_main',
                deferred = $q.defer();
            
            BaseWebSrvV2.getJSON(url, params).then((data) => {
                deferred.resolve(data.results);
            }, (error) => {
                deferred.reject(error);
            });

            return deferred.promise;

        };

        /**
         * Fetch room type availability for the given date range
         * @param {Object} params - hold the request params
         * @return {Promise}
         */
        service.fetchRoomTypeAvailability = (params) => {
            var url = '/api/availability/room_types',
                deferred = $q.defer(),
                requestParams = {
                    from_date: params.from_date,
                    to_date: params.to_date,
                    is_include_overbooking: false
                };
            
            BaseWebSrvV2.getJSON(url, requestParams).then((data) => {
                deferred.resolve(data.results);
            }, (error) => {
                deferred.reject(error);
            });

            return deferred.promise;

        };

        /**
         * Fetch house events count for a date range
         * @param {Object} params - hold the request params
         * @return {Promise}
         */
        service.fetchEventsCount = (params) => {
            var url = '/api/house_events/count_per_day',
                deferred = $q.defer(),
                requestParams = {
                    start_date: params.from_date,
                    end_date: params.to_date
                };

            BaseWebSrvV2.getJSON(url, requestParams).then((response) => {
                // For maintaining the same structure, when this is fetched along with house availability
                // we have given this structure
                var eventData = {};

                eventData.eventsCount = response.data;
                deferred.resolve(eventData);
            }, (error) => {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        /**
         * Fetch house availability and house events count for the given date range
         * @param {Object} params - hold the request params
         * @return {Promise}
         */
        service.fetchHouseAvailabilityAndEventsCount = (params) => {
            var deferred = $q.defer(),
                promises = [],
                response = {};

            promises.push(service.fetchHouseAvailability(params).then((data) => {
                response.houseAvailability = data;
            }));

            promises.push(service.fetchEventsCount(params).then((data) => {
                response.eventsCount = data.eventsCount;
            }));
            
            $q.all(promises).then(() => {
                deferred.resolve(response);
            });

            return deferred.promise;

        };

        /**
         * Fetch house availability and house events count for the given date range
         * @param {Object} params - hold the request params
         * @return {Promise}
         */
        service.fetchHouseEventsByDate = (params) => {
            var url = '/api/house_events',
                deferred = $q.defer();

            BaseWebSrvV2.getJSON(url, params).then((response) => {
                deferred.resolve(response.data);
            }, (error) => {
                deferred.reject(error);
            });

            return deferred.promise;
        };

    }
]);
