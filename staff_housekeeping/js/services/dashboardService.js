hkRover.service('DashboardService',['$http', '$q', function($http, $q){
	this.data = {
		"guests_duein": "144",
		"guests_inhouse": "1",
		"guests_dueout": "1",
		"rooms_occupied": "20",
		"rooms_clean": "2",
		"rooms_dirty": "23"
	}	

	this.fetch = function(){
		var deferred = $q.defer();
		var url = 'keys/fetch_encode_key.json';
		$http.get(url).success(function(data, status) {
		    // Some extra manipulation on data if you want...
		    deferred.resolve(data);
		}).error(function(data, status) {
		    deferred.reject(data);
		});

		return deferred.promise;
	}
}]);