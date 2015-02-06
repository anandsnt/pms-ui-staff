sntRover.service('RVReservationPackageSrv',['$http', '$q', 'rvBaseWebSrvV2', function($http, $q, RVBaseWebSrvV2){
   

	var that =this;	
	this.getReservationPackages = function(){
		var deferred = $q.defer();
		var url = '/sample_json/packages/reservationPackages.json';
		RVBaseWebSrvV2.getJSON(url).then(function(data) {
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});	
		return deferred.promise;
	};
	
	
	
}]);