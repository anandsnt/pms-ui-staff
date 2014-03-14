hkRover.service('HKSearchSrv',['$http', '$q', function($http, $q){
	
	var _this = this;
	//this.cacheResults = false;
	this.roomList = "";
	this.fetch = function(){
		var deferred = $q.defer();
		var url = '/house/search.json';
		/*if(_this.cacheResults){
			deferred.resolve(_this.data);
			return deferred.promise;
		}*/		
		$http.get(url).success(function(response, status) {
		    _this.roomList = response.data;
		    deferred.resolve(_this.roomList);

		}).error(function(data, status) {
		    deferred.reject(data);
		});
		return deferred.promise;
	}


}]);