admin.service('ADAppSrv',['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv){

	this.fetch = function(){
		var deferred = $q.defer();
		var url = '/admin/hotel_admin/dashboard.json';	
		ADBaseWebSrv.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};


}]);