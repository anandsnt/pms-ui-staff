
admin.service('ADCountrySortSrv',['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2){
   /**
    * To fetch the country list
    * */
	this.fetchCountries = function(){

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
    * To fetch the sorted country list
    * */
	this.fetchSortedList = function(){

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
    * To update the order
    */
	this.saveComponentOrder = function(params){

		var deferred = $q.defer();
		var url = ' /api/billing_groups/charge_codes.json';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
    * To update the order
    */
	this.deleteItem = function(params){

		var deferred = $q.defer();
		var url = ' /api/billing_groups/charge_codes.json';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

}]);