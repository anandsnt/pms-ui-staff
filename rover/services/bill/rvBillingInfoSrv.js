sntRover.service('RVBillinginfoSrv',['$http', '$q', 'BaseWebSrvV2','RVBaseWebSrv', function($http, $q, BaseWebSrvV2, RVBaseWebSrv){
   
	this.fetchRoutes = function(reservationId){
		var deferred = $q.defer();
		var url = 'api/bill_routings/' + reservationId + '/attached_entities' ;
			BaseWebSrvV2.getJSON(url).then(function(data) {
				
			   	 deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});	

		return deferred.promise;
	};	

	this.fetchAvailableBillingGroups = function(reservationId){
		var deferred = $q.defer();
		var url = 'api/bill_routings/billing_groups';
			BaseWebSrvV2.getJSON(url).then(function(data) {
				
			   	 deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});	

		return deferred.promise;
	};

	this.fetchAvailableChargeCodes = function(reservationId){
		var deferred = $q.defer();
		var url = 'api/bill_routings/charge_codes';
			BaseWebSrvV2.getJSON(url).then(function(data) {
				
			   	 deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});	

		return deferred.promise;
	};

	this.saveRoute = function(data){
		var deferred = $q.defer();
		var url = 'api/bill_routings/save_routing';
			BaseWebSrvV2.postJSON(url, data).then(function(data) {
				
			   	 deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});	

		return deferred.promise;
	};

	this.deleteRoute = function(data){
		var deferred = $q.defer();
		var url = 'api//bill_routings/delete_routing';
			BaseWebSrvV2.postJSON(url, data).then(function(data) {
				
			   	 deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});	

		return deferred.promise;
	};
   
}]);