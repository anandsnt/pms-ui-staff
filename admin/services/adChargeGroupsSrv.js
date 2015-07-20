admin.service('ADChargeGroupsSrv',['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv){

	/**
    *   A getter method to return the charge group list
    */
	this.fetch = function(){
		var deferred = $q.defer();
		var url = '/admin/charge_groups.json';

		ADBaseWebSrv.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/*
    * Service function to update charge group
    * @return {object} status of update
    */
	this.save = function(data){

		var deferred = $q.defer();
		var url = '/admin/charge_groups';

		ADBaseWebSrv.postJSON(url,data).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};
	/*
    * Service function to update charge group.
    * @return {object} status of update
    */
	this.update = function(data){

		var deferred = $q.defer();
		var url = '/admin/charge_groups/'+data.value;

		ADBaseWebSrv.putJSON(url,data).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};
	/*
    * Service function to delete charge group item.
    * @return {object} status of deletion
    */
	this.deleteItem = function(data){

		var deferred = $q.defer();
		var url = '/admin/charge_groups/'+data.value;

		ADBaseWebSrv.deleteJSON(url,data).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

}]);