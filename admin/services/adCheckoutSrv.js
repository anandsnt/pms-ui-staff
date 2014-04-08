admin.service('adCheckoutSrv',['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv){
   /*
    * To fetch checkin
    * @return {object} checkin details
    */	
	this.fetch = function(){
		var deferred = $q.defer();
		var url = '/admin/get_checkout_settings.json';	
		
		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

	 /*
    * To save checkin
    * 
    */	
	this.save = function(data){
		var deferred = $q.defer();
		var url = '/admin/save_checkout_settings';	
		
		ADBaseWebSrv.postJSON(url,data).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

}]);