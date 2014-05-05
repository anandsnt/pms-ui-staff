admin.service('ADRatesConfigureSrv',['$http', '$q', 'ADBaseWebSrvV2','$rootScope', function($http, $q, ADBaseWebSrvV2,$rootScope){
	
	this.currentSetData = {};
	this.dateId ='';
	this.hasBaseRate = false;
	this.setCurrentSetData = function(data){
		this.currentSetData =data;
		 $rootScope.$broadcast('dateRangeUpdated',this.currentSetData);
	};
	this.getCurrentSetData = function(data){
		return this.currentSetData;
	};
	
	this.setDateId = function(id){
		this.dateId =id;
	};
	var that = this;

	this.fetchSetsInDateRange = function(data) {
		var deferred = $q.defer();
		var url = "/api/rate_date_ranges/"+data.id;
		that.setDateId(data.id);
		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
	
	this.saveSet = function(data){
		console.log(data);
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
	this.updateDateRange = function(data){
		var deferred = $q.defer();
		var id = that.dateId;
		var url = "/api/rate_date_ranges/"+id;
		ADBaseWebSrvV2.putJSON(url, data).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
  
}]);