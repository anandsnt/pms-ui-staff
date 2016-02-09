angular.module('sntRover').service('RVExternalReferencesSrv', ['$q', 'rvBaseWebSrvV2',
    function($q, RVBaseWebSrvV2) {

        var self = this;

        self.fetchExternalSystems = function() {
            var deferred = $q.defer();

            deferred.resolve([{
                id: 1,
                name: 'SynXis',
            }, {
                id: 2,
                name: 'Traveltripper'
            }, {
                id: 3,
                name: 'Siteminder'
            }, {
                id: 4,
                name: 'Windsurfer'
            }]);

            return deferred.promise;
        }

        self.fetchExternalReferences = function() {
            var deferred = $q.defer();
            // var response = [{
            //     external_system: 1,
            //     reference_number: "AX123",
            //     can_edit: false
            // }, {
            //     external_system: 3,
            //     reference_number: "12338NN221",
            //     can_edit: true
            // }];

            var response = [];

            if (response.length === 0) {
                response.push({
                    external_system: "",
                    reference_number: "",
                    can_edit: true
                })
            }

            deferred.resolve(response);
            return deferred.promise;
        };

        self.getExternalData = function() {
            var deferred = $q.defer(),
                promises = [];

            self['extRef'] = {};

            promises.push(self.fetchExternalSystems().then(function(response) {
                self['extRef']['systems'] = response;
            }));
            promises.push(self.fetchExternalReferences().then(function(response) {
                self['extRef']['references'] = response;
            }));

            $q.all(promises).then(function() {
                deferred.resolve(self['extRef']);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });

            return deferred.promise;
        }
    }
]);