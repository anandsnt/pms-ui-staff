admin.service('ADSourcesSrv',['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){

	/**
    *   A getter method to return the sources list
    */
	this.fetch = function(){
		var deferred = $q.defer();
		var url = '/api/sources.json';
		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/**
    *   A post method to enable/disable sources
    */
	this.toggleUsedSources = function(data){
		var deferred = $q.defer();
		var url = '/api/sources/use_sources';
		ADBaseWebSrvV2.postJSON(url,data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/*
    * Service function to save source
    * @return {object} status of update
    */
	this.save = function(data){

		var deferred = $q.defer();
		var url = '/api/sources';

		ADBaseWebSrvV2.postJSON(url,data).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};
	/*
    * Service function to update source.
    * @return {object} status of update
    */
	this.update = function(data){

		var deferred = $q.defer();
		var url = '/api/sources/'+data.value;

		ADBaseWebSrvV2.putJSON(url,data).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};
	/*
    * Service function to delete source.
    * @return {object} status of deletion
    */
	this.deleteItem = function(data){

		var deferred = $q.defer();
		var url = '/api/sources/'+data.value;

		ADBaseWebSrvV2.deleteJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

}]);