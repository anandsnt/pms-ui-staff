sntRover.service('RVJournalSrv',['$http', '$q', 'BaseWebSrvV2', function($http, $q, BaseWebSrvV2){
   	
   	this.filterData = {};
	this.revenueData = {};
	this.paymentData = {};

	this.fetchGenericData = function(){
		console.log("API fetchGenericData");
		var deferred = $q.defer();
		var url = '/sample_json/journal/journal_common.json';
			BaseWebSrvV2.getJSON(url).then(function(data) {
				this.filterData = data;
			   	deferred.resolve(this.filterData);
			},function(data){
			    deferred.reject(data);
			});	
		return deferred.promise;
	};

	this.fetchRevenueData = function(){
		var deferred = $q.defer();
		var url = '/sample_json/journal/journal_revenue.json.json';
			BaseWebSrvV2.getJSON(url).then(function(data) {
				this.revenueData = data;
			   	deferred.resolve(this.revenueData);
			},function(data){
			    deferred.reject(data);
			});	
		return deferred.promise;
	};
   
}]);