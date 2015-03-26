admin.service('adSiteminderSetupSrv',['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2){
   
	this.fetchSetup = function(data){
            console.log(data);
		var deferred = $q.defer();
		var url = 'admin/get_ota_connection_config.json';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
  
   
	this.testSetup = function(data){
            console.log('testing with data:');
            console.log(data);
		var deferred = $q.defer();
		var url = 'admin/test_ota_connection';	
		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
        
	this.saveSetup = function(data){
            console.log('saving data:');
            console.log(data);

		var deferred = $q.defer();
		var url = 'admin/save_ota_connection_config';	
		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};

}]);