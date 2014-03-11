hkRover.service('HKRoomDetailsSrv',['$http', '$q', function($http, $q){

	this.fetch = function(id){
		var deferred = $q.defer();
		var url = '/house/room/' + id + '.json';

		$http.get(url).success(function(response, status) {
		    deferred.resolve(response.data);

		}).error(function(data, status) {
		    deferred.reject(data);
		});
		return deferred.promise;
	}


}]);