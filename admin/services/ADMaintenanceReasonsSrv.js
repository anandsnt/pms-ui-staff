admin.service('ADMaintenanceReasonsSrv',['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){

	/**
    *   A getter method to return the Maintenance Reason list
    */
	this.fetch = function(){
		var deferred = $q.defer();
		var url = '/api/maintenance_reasons.json';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/*
    * Service function to update Maintenance Reason
    * @return {object} status of update
    */
	this.save = function(data){

		var deferred = $q.defer();
		var url = '/api/maintenance_reasons';

		ADBaseWebSrvV2.postJSON(url,data).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};
	/*
    * Service function to update Maintenance Reason.
    * @return {object} status of update
    */
	this.update = function(data){

		var deferred = $q.defer();
		var url = '/api/maintenance_reasons/'+data.value;

		ADBaseWebSrvV2.putJSON(url,data).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};
	/*
    * Service function to delete Maintenance Reason item.
    * @return {object} status of deletion
    */
	this.deleteItem = function(data){

		var deferred = $q.defer();
		var url = '/api/maintenance_reasons/'+data.value;

		ADBaseWebSrvV2.deleteJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

}]);