sntRover.service('RVReservationAddonsSrv', ['$q', 'rvBaseWebSrvV2',
    function($q, RVBaseWebSrvV2) {

        var that =  this;
        this.addonData = {};

        this.fetchAddonData = function(params) {
            var deferred = $q.defer();
            var url = '/api/charge_groups/for_addons';
            RVBaseWebSrvV2.getJSON(url, params).then(function(data) {
                that.addonData.addonCategories = data.results;
                deferred.resolve(that.addonData);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };

        this.fetchAddons = function(params) {
            var deferred = $q.defer();
            var url = 'api/addons';
            RVBaseWebSrvV2.getJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };

        this.checkInventory = function(params) {
            var deferred = $q.defer();
            var url =  '/api/addons/'+params.addon_id+'/inventory_details';
            RVBaseWebSrvV2.getJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };

    }
]);