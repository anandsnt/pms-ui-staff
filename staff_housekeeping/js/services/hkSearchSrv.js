hkRover.service('HKSearchSrv',['$http', '$q', function($http, $q){

	this.fetch = function(){
		var deferred = $q.defer();
		var url = '/sample_json/staff_hk/hkSearch.json';

		$http.get(url).success(function(response, status) {
		    //deferred.resolve(response.data);
		    deferred.resolve(response);

		}).error(function(data, status) {
		    deferred.reject(data);
		});
		return deferred.promise;
	}


}]);