admin.service('ADRateTypeSrv', ['$http', '$q', 'ADBaseWebSrv',
function($http, $q, ADBaseWebSrv) {

	this.fetch = function() {
		var deferred = $q.defer();
		
		//var url = "/admin/hotel_rate_types.json";
		var url = "/api/admin/rate_types";
		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
	
		/**
    *   A post method to update Rate type for a hotel
    *   @param {Object} data for the Rate type list item details.
    */
	this.postRateTypeToggle = function(data){
		var deferred = $q.defer();
		var url = "/api/admin/rate_types/"+data.id+"/activate";
		
		ADBaseWebSrv.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
	   /*
    * To save new RateType
    * @param {array} data of the new RateType
    * @return {object} status and new id of new RateType
    */
	this.saveRateType = function(data){
		var deferred = $q.defer();
		var url = '/api/admin/rate_types';	

		ADBaseWebSrv.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
	
	
	   /*
    * To update RateType data
    * @param {array} data of the modified RateType
    * @return {object} status of updated RateType
    */
	this.updateRateType = function(data){

		var deferred = $q.defer();
		var url = '/api/admin/rate_types/:id'+data.id;	

		ADBaseWebSrv.putJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};

}]);
