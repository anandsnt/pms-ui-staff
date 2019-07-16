admin.service('ADDataCenterSrv', ['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2) {

	this.fetchDataCenters = function(params) {

		var deferred = $q.defer();
		var url = '/api/features?page=1&per_page=10&query=&sort_dir=true&sort_field=name';

		ADBaseWebSrvV2.getJSON(url, params).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};

}]);