
admin.service('ADCountrySortSrv',['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2){
   /**
    * To fetch the country list
    * */
	this.fetchCountries = function(){

		var deferred = $q.defer();
		var url = '/api/countries/sorted_list.json';

		ADBaseWebSrv.getJSON(url).then(function(data) {
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
		var url =  'api/countries/assign_sequence.json';

		ADBaseWebSrv.postJSON(url,params).then(function(data) {
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