sntRover.service('RVJournalSrv',['$http', '$q', 'BaseWebSrvV2', function($http, $q, BaseWebSrvV2){
   	
   	this.filterData = {};
	this.revenueData = {};
	this.paymentData = {};

	this.fetchGenericData = function(){
		var deferred = $q.defer();
		var url = '/sample_json/journal/journal_common.json';
			BaseWebSrvV2.getJSON(url).then(function(data) {
				this.filterData = data;
				angular.forEach(this.filterData.departments,function(item, index) {
		       		item.checked = false;
		       	});
		       	angular.forEach(this.filterData.employees,function(item, index) {
		       		item.checked = false;
		       	});
			   	deferred.resolve(this.filterData);
			},function(data){
			    deferred.reject(data);
			});	
		return deferred.promise;
	};

	this.fetchRevenueData = function(){
		var deferred = $q.defer();
		var url = '/sample_json/journal/journal_revenue.json';
			BaseWebSrvV2.getJSON(url).then(function(data) {
				this.revenueData = data;
			   	deferred.resolve(this.revenueData);
			},function(data){
			    deferred.reject(data);
			});	
		return deferred.promise;
	};

	this.fetchCashierData = function(){
		var deferred = $q.defer();
		var url = '/sample_json/journal/journal_cashier.json';
			BaseWebSrvV2.getJSON(url).then(function(data) {
			   	deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});	
		return deferred.promise;
	};

	this.fetchCashierDetails = function(url){
		var deferred = $q.defer();	
		BaseWebSrvV2.getJSON(url).then(function(data) {
			   	deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});	
		return deferred.promise;
	};
   
}]);