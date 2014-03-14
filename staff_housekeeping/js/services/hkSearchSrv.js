hkRover.service('HKSearchSrv',['$http', '$q', function($http, $q){
	
	var _this = this;
	this.roomList = "";
	
	this.fetch = function(){
		var deferred = $q.defer();
		var url = '/house/search.json';
		
		$http.get(url).success(function(response, status) {
			if(response.status == "success"){
			    _this.roomList = response.data;
			    deferred.resolve(_this.roomList);
			}else{
				console.log("error");
			}
			
		}).error(function(data, status) {
		    deferred.reject(data);
		});
		return deferred.promise;
	}


}]);