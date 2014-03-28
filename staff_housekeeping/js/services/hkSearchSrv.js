hkRover.service('HKSearchSrv',['$http', '$q', function($http, $q){
	
	var _this = this;
	this.roomList = "";
	
	this.initFilters = function(){
		return {	
				"dirty" : false,
				"pickup": false,
				"clean" : false,
				"inspected" : false,
				"out_of_order" : false,
				"out_of_service" : false,
				"vacant" : false,
				"occupied" : false,
				"stayover" : false,
				"not_reserved" : false,
				"arrival" : false,
				"arrived" : false,
				"dueout" : false,
				"departed" : false,
				"dayuse": false
				};
	}

	this.currentFilters = this.initFilters();

	
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