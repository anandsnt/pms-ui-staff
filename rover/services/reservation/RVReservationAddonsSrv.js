sntRover.service('RVReservationAddonsSrv', ['$q', 'rvBaseWebSrvV2',
    function($q, RVBaseWebSrvV2) {

        var that =  this;
        this.addonData = {};

        this.fetchAddonData = function() {
            var deferred = $q.defer();
            var url = '/api/charge_groups';
            RVBaseWebSrvV2.getJSON(url).then(function(data) {
                that.addonData.addonCategories = data.results;
                deferred.resolve(that.addonData);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };

        this.fetchAddons = function() {
            var url = 'api/addons?is_active=true';
            RVBaseWebSrvV2.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };

    }
]);