admin.service('ADBillingGroupSrv',['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2){
   /**
    * To fetch the list of billing groups
    */
	this.fetch = function(){
		
		var deferred = $q.defer();
		var url = 'api/billing_groups.json';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/**
    * To fetch the charge codes billing groups
    */
	this.getChargeCodes = function(){
		
		var deferred = $q.defer();
		var url = ' /api/billing_groups/charge_codes.json';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
  /*
    * To fetch billing group detail
    */
	this.getBillingGroupDetails = function(id){

		var deferred = $q.defer();
		var url = 'api/billing_groups/'+ id;
		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/*
    * To create billing group data
    */
	this.createBillingGroup = function(data){

		var deferred = $q.defer();
		var url = 'api/billing_groups';
		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
   /*
    * To update billing group data
    */
	this.updateBillingGroup = function(data){

		var deferred = $q.defer();
		var url = 'api/billing_groups/'+data.id;
		ADBaseWebSrvV2.putJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/*
    * To delete billing group data
    */
	this.deleteBillingGroup = function(id){

		var deferred = $q.defer();
		var url = '/api/billing_groups/'+id;
		ADBaseWebSrvV2.deleteJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

}]);