admin.service('adReportsFilterSrv', ['$q', 'ADBaseWebSrvV2',
    function($q, ADBaseWebSrvV2) {
        var self = this;

        // ------------------------------------------------------------------------------------------------------------- A. EXPOSED METHODS
        self.fetchFilterData = function(filters) {
            var deferred = $q.defer(),
                promises = [];

            self['filters'] = {};

            _.each(filters, function(filterKey) {
                promises.push(requestMap[filterKey]().then(function(response) {
                    self['filters'][filterKey] = response;
                }));
            });

            $q.all(promises).then(function() {
                deferred.resolve(self['filters']);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });

            return deferred.promise;
        };

        // ------------------------------------------------------------------------------------------------------------- B. CACHING

        self.cache = {
            config: {
                lifeSpan: 600 // in seconds
            },
            responses: {}
        };

        // ------------------------------------------------------------------------------------------------------------- C. MAPPING
        var requestMap = {
            "PMS_TYPES": function() {
                var deferred = $q.defer();

                deferred.resolve([{
                    value: 'STANDALONE',
                    name: 'Standalone'
                }, {
                    value: 'OVERLAY',
                    name: 'Overlay'
                }]);
                return deferred.promise;
            },
            "HOTELS": function() {
                var deferred = $q.defer(),
                    url = "/admin/hotels?is_minimal=true";

                if (!self.cache.responses['HOTELS'] || Date.now() > self.cache.responses['HOTELS']['expiryDate']) {
                    ADBaseWebSrvV2.getJSON(url).then(function(response) {
                        var hotels = [];

                        _.each(response.data.hotels, function(hotel) {
                            hotels.push({
                                value: hotel.id,
                                name: hotel.hotel_name,
                                isStandAlone: hotel.is_external_pms_available === "false",
                                chain: hotel.chain_id
                            });
                        });

                        self.cache.responses['HOTELS'] = {
                            data: hotels,
                            expiryDate: Date.now() + (self.cache['config'].lifeSpan * 1000)
                        };

                        deferred.resolve(hotels);
                    }, function(data) {
                        deferred.reject(data);
                    });
                } else {
                    deferred.resolve(self.cache.responses['HOTELS']['data']);
                }

                return deferred.promise;
            },
            "HOTEL_CHAINS": function() {

                var deferred = $q.defer(),
                    url = "/admin/hotel_chains.json?is_minimal=true";

                if (!self.cache.responses['HOTEL_CHAINS'] || Date.now() > self.cache.responses['HOTEL_CHAINS']['expiryDate']) {
                    ADBaseWebSrvV2.getJSON(url).then(function(response) {
                        self.cache.responses['HOTEL_CHAINS'] = {
                            data: response.data.chain_list,
                            expiryDate: Date.now() + (self.cache['config'].lifeSpan * 1000)
                        };

                        deferred.resolve(response.data.chain_list);
                    }, function(data) {
                        deferred.reject(data);
                    });
                } else {
                    deferred.resolve(self.cache.responses['HOTEL_CHAINS']['data']);
                }
                return deferred.promise;
            }
        };
    }
]);