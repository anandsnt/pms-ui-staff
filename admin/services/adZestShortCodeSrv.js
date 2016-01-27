admin.service('ADZestShortCodeSrv',['$http', '$q', 'ADBaseWebSrv','ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2){

	
        this.fetch = function () {
            var deferred = $q.defer();
            var url = '/api/hotel_settings/kiosk';//placeholder
            ADBaseWebSrvV2.getJSON(url).then(function(data) {
                deferred.resolve(data);
            },function(data){
                deferred.reject(data);
            });
            return deferred.promise;
        };
        
        
        this.save = function(data){
            var deferred = $q.defer();
            var url = '/api/hotel_settings/change_settings';//placeholder

            ADBaseWebSrvV2.postJSON(url,data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
	};


}]);