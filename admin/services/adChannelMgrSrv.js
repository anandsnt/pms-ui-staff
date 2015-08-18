admin.service('ADChannelMgrSrv', ['$http', '$q', 'ADBaseWebSrvV2', 'ADBaseWebSrv',
    function ($http, $q, ADBaseWebSrvV2, ADBaseWebSrv) {

        /*
         * Service function to toggle activate/de-activate rate
         * @params {object} id
         */
        this.toggleActivate = function (params) {
            var id = params.id;
            var deferred = $q.defer();
            var url = "/api/channel_managers/"+id+"/activate";
            

            ADBaseWebSrvV2.putJSON(url,params).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchManagers = function (data) {
            var deferred = $q.defer();

            var url = "/api/channel_managers.json";
            ADBaseWebSrvV2.getJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


    }
]);
