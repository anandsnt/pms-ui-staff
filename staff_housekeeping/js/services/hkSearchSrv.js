hkRover.service('HKSearchSrv',['$http', '$q', function($http, $q){

	this.fetch = function(){
		var deferred = $q.defer();
		var url = '/house/search.json';

		$http.get(url).success(function(response, status) {
		    //deferred.resolve(response.data);
		    deferred.resolve(response.data);
		    console.log(response.data.rooms[0].room_no);

		}).error(function(data, status) {
		    deferred.reject(data);
		});
		return deferred.promise;
	}


}]);