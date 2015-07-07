admin.service('ADSegmentsSrv',['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){

	/**
    *   A getter method to return the origins list
    */
	this.fetch = function(){
		var deferred = $q.defer();
		var url = '/api/segments';
		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
    *   A post method to enable/disable origins
    */
	this.toggleUsedOrigins = function(data){
		var deferred = $q.defer();
		var url = '/api/booking_origins/use_origins';
		ADBaseWebSrvV2.postJSON(url,data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/*
    * Service function to save origins
    * @return {object} status of update
    */
	this.save = function(data){

		var deferred = $q.defer();
		var url = '/api/segments';

		ADBaseWebSrvV2.postJSON(url,data).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};
	/*
    * Service function to update origins.
    * @return {object} status of update
    */
	this.update = function(data){

		var deferred = $q.defer();
		var url = '/api/segments/'+data.value;

		ADBaseWebSrvV2.putJSON(url,data).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};
	/*
    * Service function to delete origin item.
    * @return {object} status of deletion
    */
	this.delete = function(data){
		var deferred = $q.defer();
		var url = '/api/segments/'+data.value;

		ADBaseWebSrvV2.deleteJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};


	this.toggleSegmentsUse = function(data){
		var deferred = $q.defer();
		var url = '/api/segments/use_segments';
		ADBaseWebSrvV2.postJSON(url,data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

}]);