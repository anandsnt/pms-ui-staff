admin.service('adIdeasSetupSrv', ['$http', '$q', 'ADBaseWebSrvV2',
    function($http, $q, ADBaseWebSrvV2) {

        var service = this;
        /**
         * GET IDEAS Setup
         * @return {Promise}
         */
        service.getIdeaSetup = function() {
            var deferred = $q.defer(),
                url = '/api/hotel_settings/ideas';

            ADBaseWebSrvV2.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        /**
         * POST IDEAS Setup
         * @param  {Object]} params payload
         * @return {Promise}        
         */
        service.postIdeasSetup = function(params) {
             var deferred = $q.defer(),
                url = '/api/hotel_settings/ideas';

            ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
    }
]);