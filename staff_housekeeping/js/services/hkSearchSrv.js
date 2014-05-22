hkRover.service('HKSearchSrv',['$http', '$q', '$window', function($http, $q, $window){

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
		
		$http.get(url)
			.success(function(response, status) {
				if(response.status == "success"){
				    this.roomList = response.data;
				    deferred.resolve(this.roomList);
				}else{
					console.log( 'Server request failed' );
				}
				
			}.bind(this))
			.error(function(response, status) {
			    if(status == 401){ // 401- Unauthorized
	    			// so lets redirect to login page
					$window.location.href = '/house/logout' ;
	    		}else{
	    			deferred.reject(response);
	    		}
			});

		return deferred.promise;
	}

	this.toggleFilter = function(item) {
		this.currentFilters[item] = !this.currentFilters[item];
	};

}]);