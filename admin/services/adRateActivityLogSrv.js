admin.service('ADRateActivityLogSrv', ['$http', '$q', 'ADBaseWebSrvV2',
function($http, $q, ADBaseWebSrvV2) {
	this.fetchRateLog = function(rateId) {
            var deferred = $q.defer();
            var url = "api/actions?actionable_type=Rate&actionable_id="+rateId.id+"&page=1&per_page=50";
            ADBaseWebSrvV2.getJSON(url).then(function(data) {
                    deferred.resolve(data.results);
            }, function(data) {
                    deferred.reject(data);
            });
            return deferred.promise;
	};
}]);
