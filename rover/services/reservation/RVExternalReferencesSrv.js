angular.module('sntRover').service('RVExternalReferencesSrv', ['$q', 'rvBaseWebSrvV2',
    function($q, RVBaseWebSrvV2) {

        var self = this;


        var fetchExternalSystems = function() {
            var deferred = $q.defer(),
                url = "/api/reference_values/manual_external_reference_interfaces";

            RVBaseWebSrvV2.getJSON(url).then(function(response) {
                deferred.resolve(response.external_interface_types);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };

        var fetchExternalReferences = function(reservationId) {
            var deferred = $q.defer(),
                url = "/api/reservations/" + reservationId + "/external_references";

            RVBaseWebSrvV2.getJSON(url).then(function(response) {
                var references = response.external_references;

                if (references.length === 0) {
                    references.push(self.getEmptyRow());
                }
                deferred.resolve(references);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };

        self.save = function(payLoad) {
            var deferred = $q.defer(),
                url = "/api/reservations/" + payLoad.reservationId + "/external_references";

            RVBaseWebSrvV2.postJSON(url, {
                external_confirm_no: payLoad.reference.external_confirm_no,
                external_interface_type_id: payLoad.reference.external_interface_type_id
            }).then(function(response) {
                deferred.resolve(response);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };

        self.update = function(payLoad) {
            var deferred = $q.defer(),
                url = "/api/reservations/" + payLoad.reservationId + "/external_references/" + payLoad.reference.id;

            RVBaseWebSrvV2.putJSON(url, {
                external_confirm_no: payLoad.reference.external_confirm_no,
                external_interface_type_id: payLoad.reference.external_interface_type_id
            }).then(function(response) {
                deferred.resolve(response);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };

        self.remove = function(payLoad) {
            var deferred = $q.defer(),
                url = "/api/reservations/" + payLoad.reservationId + "/external_references/" + payLoad.referenceId;

            RVBaseWebSrvV2.deleteJSON(url).then(function(response) {
                deferred.resolve(response);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };

        self.getEmptyRow = function() {
            return {
                external_interface_type_id: "",
                external_confirm_no: "",
                id: "",
                is_from_rover: true
            };
        };

        self.getExternalData = function(reservationId) {
            var deferred = $q.defer(),
                promises = [];

            self['extRef'] = {};

            promises.push(fetchExternalSystems().then(function(response) {
                self['extRef']['systems'] = response;
            }));
            promises.push(fetchExternalReferences(reservationId).then(function(response) {
                self['extRef']['references'] = response;
            }));

            $q.all(promises).then(function() {
                deferred.resolve(self['extRef']);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });

            return deferred.promise;
        };
    }
]);