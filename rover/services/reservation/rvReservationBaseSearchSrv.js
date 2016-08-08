angular.module('sntRover').service('RVReservationBaseSearchSrv', ['$q', 'rvBaseWebSrvV2', 'dateFilter',
    function($q, RVBaseWebSrvV2, dateFilter) {

        var that = this;
        this.reservation = {
            'settings': {},
            'roomTypes': {},
            'businessDate': {}
        };

        //-------------------------------------------------------------------------------------------------------------- CACHE CONTAINERS

        this.cache = {
            config: {
                lifeSpan: 3600 //in seconds
            },
            responses: {
                restrictionTypes: null,
                rateDetails: null,
                sortOrder: null,
                taxMeta: null,
                customMeta: null
            }
        }

        //-------------------------------------------------------------------------------------------------------------- CACHE CONTAINERS



        //This method returns the default view chosen in the Admin/Reservation/Reservation Settings
        this.getRoomRatesDefaultView = function() {
            var view = "ROOM_TYPE";
            if (that.reservation.settings && that.reservation.settings.default_rate_display_name) {
                if (that.reservation.settings.default_rate_display_name === 'Recommended') {
                    view = "RECOMMENDED";
                } else if (that.reservation.settings.default_rate_display_name === 'By Rate') {
                    view = "RATE";
                }
            }
            return view;
        };

        this.getRoomTypeLevel = function(roomTypeId) {
            var level = -1;
            if (!!that.reservation.roomTypes) {
                var roomTypeDetails = _.find(that.reservation.roomTypes, {
                    id: roomTypeId
                });
                level = roomTypeDetails.level;
            }
            return level;
        }

        this.fetchBaseSearchData = function() {
            var deferred = $q.defer();

            that.fetchBussinessDate = function() {
                var url = '/api/business_dates/active';
                RVBaseWebSrvV2.getJSON(url).then(function(data) {
                    that.reservation.businessDate = data.business_date;
                    deferred.resolve(that.reservation);
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });
                return deferred.promise;
            };

            that.fetchRoomTypes = function() {
                var url = 'api/room_types.json?exclude_pseudo=true&per_page=100';
                RVBaseWebSrvV2.getJSON(url).then(function(data) {
                    that.reservation.roomTypes = data.results;
                    that.fetchBussinessDate();
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });
                return deferred.promise;
            };

            if (isEmpty(that.reservation.settings) && isEmpty(that.reservation.roomTypes) && isEmpty(that.reservation.businessDate)) {
                var url = '/api/hotel_settings/show_hotel_reservation_settings';
                RVBaseWebSrvV2.getJSON(url).then(function(data) {
                    that.reservation.settings = data;
                    that.fetchRoomTypes();
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });
            } else {
                deferred.resolve(that.reservation);
            };

            return deferred.promise;
        };

        this.fetchCompanyCard = function(data) {
            var deferred = $q.defer();
            var url = '/api/accounts';
            RVBaseWebSrvV2.getJSON(url, data).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.autoCompleteCodes = function(data) {
            var deferred = $q.defer();
            var url = '/api/code_search';
            RVBaseWebSrvV2.getJSON(url, data).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        this.fetchCurrentTime = function() {
            var deferred = $q.defer();
            var url = '/api/hotel_current_time';
            RVBaseWebSrvV2.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchAvailability = function(param) {
            var deferred = $q.defer();
            var url = '/api/availability?from_date=' + param.from_date + '&to_date=' + param.to_date + '&override_restrictions=true';

            if (!!param.company_id) {
                url += '&company_id=' + param.company_id;
            }

            if (!!param.travel_agent_id) {
                url += '&travel_agent_id=' + param.travel_agent_id;
            }

            if (!!param.group_id) {
                url += '&group_id=' + param.group_id;
            }

            if (!!param.promotion_code) {
                url += '&promotion_code=' + encodeURI(param.promotion_code); //to handle special characters
            }

            if (!!param.allotment_id) {
                url += '&allotment_id=' + encodeURI(param.allotment_id);
            }

            RVBaseWebSrvV2.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };
        this.fetchMinTime = function() {
            var deferred = $q.defer();
            var url = '/api/hourly_rate_min_hours';
            RVBaseWebSrvV2.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchSortPreferences = function() {
            var deferred = $q.defer(),
                url = '/api/sort_preferences/list_selections';
            if (that.cache.responses['sortOrder'] === null || Date.now() > that.cache.responses['sortOrder']['expiryDate']) {
                RVBaseWebSrvV2.getJSON(url).then(function(data) {
                    that.cache.responses['sortOrder'] = {
                        data: data.room_rates,
                        expiryDate: Date.now() + (that.cache['config'].lifeSpan * 1000)
                    };
                    deferred.resolve(data.room_rates);
                }, function(data) {
                    deferred.reject(data);
                });
            } else {
                deferred.resolve(that.cache.responses['sortOrder']['data']);
            }
            return deferred.promise;
        };

        this.fetchAddonsForRates = function(params) {
            var deferred = $q.defer(),
                url = '/api/addons/rate_addons';
            RVBaseWebSrvV2.getJSON(url, params).then(function(data) {
                deferred.resolve(data.rate_addons);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.hasAnyConfiguredAddons = function(params) {
            var deferred = $q.defer();
            var url = '/api/addons/configured';
            RVBaseWebSrvV2.getJSON(url, params).then(function(data) {
                deferred.resolve(data.addons_configured);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };

        this.getActivePromotions = function() {
            var deferred = $q.defer();
            var url = '/api/promotions?is_active=true';
            RVBaseWebSrvV2.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };

        this.fetchUserMemberships = function(guestId) {
            var deferred = $q.defer();
            var url = '/staff/user_memberships.json?user_id=' + guestId;
            RVBaseWebSrvV2.getJSON(url).then(function(response) {
                deferred.resolve(response.data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.checkOverbooking = function(params) {
            var deferred = $q.defer();
            var url = '/api/availability/overbooking_check';
            RVBaseWebSrvV2.getJSON(url, params).then(function(response) {
                deferred.resolve(response.results);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchOrdinaryRates = function(params) {
            var deferred = $q.defer();
            var url = '/api/availability/rates';
            RVBaseWebSrvV2.getJSON(url, params).then(function(response) {
                deferred.resolve(response);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchContractRates = function(params) {
            var deferred = $q.defer();
            var url = '/api/availability/contracts';
            RVBaseWebSrvV2.getJSON(url, params).then(function(response) {
                deferred.resolve(response);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchGroupRates = function(params) {
            var deferred = $q.defer(),
                groupId = params.group_id || params.allotment_id;

            var url = '/api/availability/groups/' + groupId;
            RVBaseWebSrvV2.getJSON(url, params).then(function(response) {
                deferred.resolve(response);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchRates = function(params) {
            var deferred = $q.defer(),
                promises = [];

            that['rates'] = [];

            // Make this call IFF there is a group/ allotment attached
            if (params.group_id) {
                promises.push(that.fetchGroupRates(params).then(function(response) {
                    _.each(response.rates, function(rate) {
                        if (rate.id === null) {
                            rate.id = '_CUSTOM_' + params.group_id;
                        }
                    });
                    that['rates'] = that['rates'].concat(response.rates);
                }));
            } else {
                promises.push(that.fetchOrdinaryRates(params).then(function(response) {

                    that['rates'] = that['rates'].concat(response.rates);
                }));

                // Make this call IFF there is a company / TA card attached
                if (!!params.company_id || !!params.travel_agent_id) {
                    promises.push(that.fetchContractRates(params).then(function(response) {
                        _.each(response.rates, function(rate) {
                            rate.isCorporate = true;
                        });
                        that['rates'] = that['rates'].concat(response.rates);
                    }));
                }
            }


            $q.all(promises).then(function() {
                deferred.resolve(that['rates']);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });

            return deferred.promise;

        };

        this.fetchRestricitonTypes = function() {
            var deferred = $q.defer(),
                url = '/api/restriction_types';
            if (that.cache.responses['restrictionTypes'] === null || Date.now() > that.cache.responses['restrictionTypes'].expiryDate) {
                RVBaseWebSrvV2.getJSON(url).then(function(data) {
                    data.results.push({
                        id: 98,
                        value: "INVALID_PROMO",
                        description: "PROMOTION INVALID",
                        activated: true
                    });

                    data.results.push({
                        id: 99,
                        activated: true,
                        value: 'HOUSE_FULL',
                        description: 'NO HOUSE AVAILABILITY'
                    });

                    var restriction_types = {};
                    _.each(data.results, function(resType) {
                        restriction_types[resType.id] = {
                            key: resType.value,
                            value: ['CLOSED', 'CLOSED_ARRIVAL', 'CLOSED_DEPARTURE', 'HOUSE_FULL', 'INVALID_PROMO'].indexOf(resType.value) > -1 ? resType.description : resType.description + ':'
                        }
                    });

                    that.cache.responses['restrictionTypes'] = {
                        data: restriction_types,
                        expiryDate: Date.now() + (that.cache['config'].lifeSpan * 1000)
                    };

                    deferred.resolve(restriction_types);
                }, function(data) {
                    deferred.reject(data);
                });
            } else {
                deferred.resolve(that.cache.responses['restrictionTypes']['data']);
            }
            return deferred.promise;
        };


        this.fetchRatesDetailed = function(params) {
            var deferred = $q.defer(),
                url = '/api/rates/detailed';

            if ((params && params.isForceRefresh) || that.cache.responses['rateDetails'] === null || Date.now() > that.cache.responses['rateDetails']['expiryDate']) {
                RVBaseWebSrvV2.getJSON(url).then(function(response) {
                    var rates = [];
                    _.each(response.results, function(rate) {
                        rates[rate.id] = rate;
                    });

                    that.cache.responses['rateDetails'] = {
                        data: rates,
                        expiryDate: Date.now() + (that.cache['config'].lifeSpan * 1000)
                    };

                    deferred.resolve(rates);
                }, function(data) {
                    deferred.reject(data);
                });
            } else {
                deferred.resolve(that.cache.responses['rateDetails']['data']);
            }
            return deferred.promise;
        };

        this.fetchCustomRateConfig = function() {
            var deferred = $q.defer(),
                url = 'api/rates/custom_group_rate_taxes';
            if (that.cache.responses['customMeta'] === null || Date.now() > that.cache.responses['customMeta']['expiryDate']) {
                RVBaseWebSrvV2.getJSON(url).then(function(response) {
                    var customMeta = response;
                    that.cache.responses['customMeta'] = {
                        data: customMeta,
                        expiryDate: Date.now() + (that.cache['config'].lifeSpan * 1000)
                    };
                    deferred.resolve(customMeta);
                }, function(data) {
                    deferred.reject(data);
                });
            } else {
                deferred.resolve(that.cache.responses['customMeta']['data']);
            }
            return deferred.promise;
        };

        this.fetchRatesMeta = function(params) {
            var deferred = $q.defer(),
                promises = [];

            that['rates-restrictions'] = {};

            promises.push(that.fetchRatesDetailed(params).then(function(response) {
                that['rates-restrictions']['rates'] = response;
            }));

            promises.push(that.fetchRestricitonTypes(params).then(function(response) {
                that['rates-restrictions']['restrictions'] = response;
            }));

            promises.push(that.fetchCustomRateConfig().then(function(response) {
                that['rates-restrictions']['customRates'] = response;
            }));

            $q.all(promises).then(function() {
                deferred.resolve(that['rates-restrictions']);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });

            return deferred.promise;
        };

        this.fetchTaxInformation = function() {
            var deferred = $q.defer(),
                url = 'api/rates/tax_information';
            if (that.cache.responses['taxMeta'] === null || Date.now() > that.cache.responses['taxMeta']['expiryDate']) {
                RVBaseWebSrvV2.getJSON(url).then(function(response) {
                    var taxMeta = response.tax_codes;
                    that.cache.responses['taxMeta'] = {
                        data: taxMeta,
                        expiryDate: Date.now() + (that.cache['config'].lifeSpan * 1000)
                    };
                    deferred.resolve(taxMeta);
                }, function(data) {
                    deferred.reject(data);
                });
            } else {
                deferred.resolve(that.cache.responses['taxMeta']['data']);
            }
            return deferred.promise;
        };


        this.fetchHouseAvailability = function(params) {
            var deferred = $q.defer(),
                url = 'api/availability/house';
            RVBaseWebSrvV2.getJSON(url, params).then(function(response) {
                var houseAvailbility = {};
                _.each(response.results, function(availability) {
                    houseAvailbility[availability.date] = availability.availability;
                })
                deferred.resolve(houseAvailbility);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchTaxRateAddonMeta = function(params) {
            var deferred = $q.defer(),
                promises = [];

            that['meta'] = {};

            promises.push(that.fetchTaxInformation().then(function(response) {
                that['meta']['taxInfo'] = response;
            }));
            promises.push(that.fetchAddonsForRates(params).then(function(response) {
                that['meta']['rateAddons'] = response;
            }));

            $q.all(promises).then(function() {
                deferred.resolve(that['meta']);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });

            return deferred.promise;
        };
    }
]);