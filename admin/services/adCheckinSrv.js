admin.service('adCheckinSrv',['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv){
   /*
    * To fetch checkin
    * @return {object} checkin details
    */	
	this.fetch = function(){
		var deferred = $q.defer();
		var url = '/admin/checkin_setups/list_setup.json';	
		
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
		var url = '/admin/checkin_setups/save_setup';	
		
		ADBaseWebSrv.postJSON(url,data).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};


	 /*
    * To retrive checkin email list 
    * 
    */	
	this.fetchEmailList = function(data){
		var deferred = $q.defer();
		var url = '/admin/get_due_in_guests.json';
			
		
		ADBaseWebSrv.getJSON(url,data).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

}]);