admin.service('ADInterfaceMappingSrv', ['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2',
    function ($http, $q, ADBaseWebSrv, ADBaseWebSrvV2) {
        /*
         * Service function to fetch the mapping list
         * @return {object} mapping list
         */

        this.fetchExternalMappingList = function (data) {
            var hotel_id = data.hotel_id;
            var deferred = $q.defer();
            var url = "/admin/external_mappings/interface_types.json";

            ADBaseWebSrv.getJSON(url).then(function (data) {
                var sortedInterfaceList = _.sortBy(data.interfaces, function(item) {
                    return item.description.toLowerCase();
                });

                // CICO-36466 Admin Interfaces Menu to be sorted by alphabetical
                deferred.resolve(sortedInterfaceList);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        /*
         * Service function to render add mapping screen
         * @return {object} mapping type,snt values to render its dropdowns
         */
        this.fetchAddMapping = function (data) {
            var hotel_id = data.hotel_id, interface_id = data.interface_type_id;
            var deferred = $q.defer();
            var url = "/admin/external_mappings/" + interface_id + "/new_mappings.json";

            ADBaseWebSrv.postJSON(url).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        /*
         * Service function to render edit mapping screen
         * @return {object} mapping type,snt values to render its dropdowns.
         */
        this.fetchEditMapping = function (data) {
            var hotel_id = data.hotel_id, interface_id = data.interface_type_id, mappingTypeId = data.mapping_type_id;
            var deferred = $q.defer();
            var url = '/admin/external_mappings/' + interface_id + '/edit_mapping/' + mappingTypeId + '.json';

            ADBaseWebSrv.getJSON(url).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        this.saveEditMapping = function (data) {
            var hotel_id = data.hotel_id, interface_id = data.interface_type_id, mappingTypeId = data.mapping_type_id;
            var deferred = $q.defer();
            var url = '/admin/external_mappings/' + interface_id + '/update_mapping/' + mappingTypeId + '.json';

            ADBaseWebSrv.postJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        /*
         * Service function to update mapping
         * @return {object} status of update
         */
        this.saveMapping = function (data) {
            // interface_id will be a property in the data file
            var hotel_id = data.hotel_id, interface_id = data.interface_type_id;
            var deferred = $q.defer();
            var url = '/admin/external_mappings/' + interface_id + '/new_mapping/';

            ADBaseWebSrv.postJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        /*
         * Service function to delete mapping
         * @return {object} status of deletion
         */
        this.deleteMapping = function (data) {
            var hotel_id = data.hotel_id, interface_id = data.interface_type_id, mappingTypeId = data.mapping_type_id;
            var deferred = $q.defer();
            var url = "/admin/external_mappings/" + interface_id + "/delete_mapping/" + mappingTypeId + ".json";

            ADBaseWebSrv.deleteJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        /*
         * toggle mapping interface on/off
         */

        this.switchToggle = function (data) {
            var deferred = $q.defer();
            var url = '/admin/ota/update_active/' + data.interface_id + ".json";

            ADBaseWebSrv.postJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchInterfaceExternalMappingsList = function (data) {
            var deferred = $q.defer(),
                url = '/admin/interface_mappings.json';

            ADBaseWebSrvV2.getJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchInterfaceMappingTypes = function(data) {
            var hotel_id = data.hotel_id,
                interface_id = data.interface_type_id,
                deferred = $q.defer(),
                url = '/admin/external_mappings/' + interface_id + '/interface_mappings.json?exclude_mappings=true';

            ADBaseWebSrv.getJSON(url).then(function (data) {
                deferred.resolve(data.mapping_type);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.deleteMappingWithId = function(params) {
            var deferred = $q.defer(),
                url = '/admin/interface_mappings/' + params.mapping_id + '.json';

            ADBaseWebSrvV2.deleteJSON(url).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchMappingWithId = function(params) {
            var deferred = $q.defer(),
                url = '/admin/interface_mappings/' + params.mapping_id + '.json';

            ADBaseWebSrvV2.getJSON(url).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.createNewMapping = function(params) {
            var deferred = $q.defer(),
                url = '/admin/interface_mappings.json';

            ADBaseWebSrvV2.postJSON(url, params).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.updateMapping = function(params) {
            var deferred = $q.defer(),
                url = '/admin/interface_mappings/' + params.mapping_id + '.json';

            ADBaseWebSrvV2.putJSON(url, params).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchUnMappedRooms = function(params) {
            var deferred = $q.defer(),
                url = '/admin/interface_mappings/' + params.interface_id + '/unmapped_rooms.json';

            ADBaseWebSrvV2.getJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.saveAutoMapping = function(params) {
            var deferred = $q.defer(),
                url = 'admin/interface_mappings/auto_mapping.json';

            ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

    }]);
