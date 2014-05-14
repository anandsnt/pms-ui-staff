sntRover.service('RVCompanyCardSrv',['$q', 'rvBaseWebSrvV2', function($q, rvBaseWebSrvV2){
	
	var self = this;
	
	this.fetchContactInformation = function(){
		var deferred = $q.defer();		
		var url =  '/sample_json/contracts/rvCompanyCardDetails.json';			
		rvBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;		
		
	};
	
	this.fetchContractsList = function(){
		var deferred = $q.defer();		
		var url =  '/sample_json/contracts/rvCompanyCardContractsList.json';	
		RVBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;		
	};
	
	this.fetchContractsDetails = function(){
		var deferred = $q.defer();		
		var url =  '/sample_json/contracts/rvCompanyCardContractsDetails.json';	
		RVBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;		
	};


}]);