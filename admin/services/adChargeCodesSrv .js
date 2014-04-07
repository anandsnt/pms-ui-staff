admin.service('ADChargeCodesSrv',['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv){
	
	/**
    *   A getter method to return the charge group list
    */
	this.fetch = function(){
		var deferred = $q.defer();
		var url = '/admin/charge_codes/list.json';
		
		ADBaseWebSrv.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
	
	
}]);