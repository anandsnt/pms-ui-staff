admin.service('ADChargeCodesSrv',['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv){
	
	/**
    *   A getter method to return the charge codes list
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
	

	this.deleteItem = function(data){
		var value = data.value;
		var deferred = $q.defer();
		var url = '/admin/charge_codes/'+value+'/delete';
		
		ADBaseWebSrv.getJSON(url,data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};



	this.fetchNewDetails = function(){
		var deferred = $q.defer();
		var url = '/admin/charge_codes/new';
		
		ADBaseWebSrv.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};


	
	
}]);