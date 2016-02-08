admin.service('adReportsFilterSrv', ['$q', 'ADBaseWebSrvV2',
    function($q, ADBaseWebSrvV2) {
        var self = this;
        // ------------------------------------------------------------------------------------------------------------- A. MAPPING


        // ------------------------------------------------------------------------------------------------------------- B. CACHING
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
        }

        // ------------------------------------------------------------------------------------------------------------- B. CACHING

        self.cache = {
            config: {
                lifeSpan: 300 //in seconds
            },
            responses: {}
        }

        // ------------------------------------------------------------------------------------------------------------- A. MAPPING
        var requestMap = {
            "PMS_TYPES": function() {
                var deferred = $q.defer();
                deferred.resolve([{
                    value: 'STANDALONE',
                    name: 'STANDALONE'
                }, {
                    value: 'OVERLAY',
                    name: 'OVERLAY'
                }]);
                return deferred.promise;
            },
            "HOTELS": function() {
                var deferred = $q.defer(),
                    url = "/admin/hotels?is_minimal=true";

                ADBaseWebSrvV2.getJSON(url).then(function(response) {
                    var hotels = [];
                    _.each(response.data.hotels, function(hotel) {

                        hotels.push({
                            value: hotel.id,
                            name: hotel.hotel_name,
                            isStandAlone: hotel.is_external_pms_available === "false",
                            chain: hotel.chain_id
                        })

                    });
                    deferred.resolve(hotels);
                }, function(data) {
                    deferred.reject(data);
                });

                return deferred.promise;
            },
            "HOTEL_CHAINS": function() {

                var deferred = $q.defer(),
                    url = "/admin/hotel_chains.json?is_minimal=true";

                ADBaseWebSrvV2.getJSON(url).then(function(response) {
                    deferred.resolve(response.data.chain_list);
                }, function(data) {
                    deferred.reject(data);
                });

                return deferred.promise;

            }
        }
    }
]);