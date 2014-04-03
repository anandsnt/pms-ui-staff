admin.service('ADRateTypeSrv', ['$http', '$q', 'ADBaseWebSrv',
function($http, $q, ADBaseWebSrv) {

	this.fetch = function() {
		var deferred = $q.defer();
		
		var url = "/admin/hotel_rate_types.json";
		//var url = "/api/admin/rate_types";
		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

}]);
