admin.service('ADZestShortCodeSrv', ['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2) {

	
        this.fetch = function (params) {
            var deferred = $q.defer();
            var url = '/admin/sms_campaigns.json';

            ADBaseWebSrvV2.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        
        
        this.save = function(data) {
            var deferred = $q.defer();
            var url = '/admin/sms_campaigns/' + data.id + '.json';

            ADBaseWebSrvV2.putJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
	};


}]);