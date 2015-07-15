admin.service('adExternalInterfaceCommonSrv',['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2){
  
	this.fetchSetup = function(params){
		var deferred = $q.defer();
		var url = 'admin/get_ota_connection_config.json?interface_id='+params.interface_id;

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
	this.fetchOrigins = function(){
		var deferred = $q.defer();
		var url = '/api/booking_origins.json';
		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
	/*
	* To fetch hotel PaymentMethods
	*/
	this.fetchPaymethods = function() {
		var deferred = $q.defer();
		var url = '/admin/hotel_payment_types.json';

		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(errorMessage) {
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};
   
	this.testSetup = function(data){
		var deferred = $q.defer();
		var url = 'admin/test_ota_connection';	
		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
        
	this.toggleActive = function(data){
		var deferred = $q.defer();
		var url = 'admin/ota/update_active/'+data.interface_id;	
		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};

}]);