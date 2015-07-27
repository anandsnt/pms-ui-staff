admin.service('ADRateActivityLogSrv', ['$http', '$q', 'ADBaseWebSrvV2',
function($http, $q, ADBaseWebSrvV2) {
	this.fetchRateLog = function(rateId) {
            var deferred = $q.defer();
            //per page and current page need to be defined
            var url = "api/actions?actionable_type=Rate&actionable_id="+rateId.id+"&page=1&per_page=50";
            ADBaseWebSrvV2.getJSON(url).then(function(data) {
                    deferred.resolve(data.results);
            }, function(data) {
                    deferred.reject(data);
            });
            return deferred.promise;
	};
        
        this.filterActivityLog = function(params) {
                var deferred = $q.defer();
                var url = "api/actions?actionable_type=Rate&actionable_id="+params.id;
                params = _.omit(params, 'id');

                ADBaseWebSrvV2.getJSON(url, params)
                .then(function(data) {
                        this.cacheReportList = data;
                        deferred.resolve(this.cacheReportList);
                }.bind(this), function(data) {
                        deferred.reject(data);
                });

                return deferred.promise;
        };
}]);
