admin.service('ADRatesConfigureSrv',['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){
	
	this.currentSetData = {};
	this.setCurrentSetData = function(data){
		alert("efe")
		this.currentSetData =data;
	};
	this.getCurrentSetData = function(data){
		return this.currentSetData;
	};

	this.fetchSetsInDateRange = function(data) {
		var deferred = $q.defer();

		// var url = " /sample_json/ng_admin/rate_types.json";
		var url = "/api/rate_date_ranges/"+data.id;
		// var url = "/sample_json/rates/rates_config_add.json";
		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
	
	this.saveSet = function(data){
		var deferred = $q.defer();
		var url = "/api/rate_sets/"+data.id;
		ADBaseWebSrvV2.putJSON(url, data).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
	this.deleteSet = function(id){
		
		var deferred = $q.defer();
		var url = "/api/rate_sets/"+id;
		ADBaseWebSrvV2.deleteJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;

	};
  
}]);