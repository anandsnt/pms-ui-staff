sntRover.service('RVReservationAddonsSrv', ['$q', 'rvBaseWebSrvV2',
    function($q, RVBaseWebSrvV2) {

        var that =  this;
        this.addonData = {};

        this.fetchAddonData = function() {
            var deferred = $q.defer();

            that.fetchAddons = function() {
                var url = '/api/addons';
                RVBaseWebSrvV2.getJSON(url).then(function(data) {
                    that.addonData.addons = data;
                    deferred.resolve(that.addonData);
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });
                return deferred.promise;
            };

            var url = '/api/charge_groups';
            RVBaseWebSrvV2.getJSON(url).then(function(data) {
                console.log('charge groups');
                console.log(data);
                that.addonData.addonCategories = data.results;
                that.fetchAddons();
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };

    }
]);