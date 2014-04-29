admin.service('ADMarketsSrv',['$http', '$q', 'ADBaseWebSrv2', function($http, $q, ADBaseWebSrv2){
	
	/**
    *   A getter method to return the markets list
    */
	this.fetch = function(){
		var deferred = $q.defer();
		var url = '/api/market_segments.json';
		
		ADBaseWebSrv2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
	/*
    * Service function to save markets
    * @return {object} status of update
    */
	this.save = function(data){

		var deferred = $q.defer();
		var url = '/api/market_segments';
		
		ADBaseWebSrv2.postJSON(url,data).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};
	/*
    * Service function to update markets.
    * @return {object} status of update
    */
	this.update = function(data){

		var deferred = $q.defer();
		var url = '/api/market_segments/'+data.value;
		
		ADBaseWebSrv2.putJSON(url,data).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};
	/*
    * Service function to delete market item.
    * @return {object} status of deletion
    */
	this.deleteItem = function(data){

		var deferred = $q.defer();
		var url = '/api/market_segments/'+data.value;
		
		ADBaseWebSrv2.deleteJSON(url,data).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};
	
}]);