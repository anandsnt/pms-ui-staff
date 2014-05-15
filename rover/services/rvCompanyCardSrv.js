sntRover.service('RVCompanyCardSrv',['$q', 'rvBaseWebSrvV2', function($q, rvBaseWebSrvV2){
	
	var self = this;
	
	this.fetchContactInformation = function(data){
		var id = data.id;
		var deferred = $q.defer();		
		var url =  '/api/accounts/'+id;			
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
		rvBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;		
	};
	
	this.fetchContractsDetails = function(){
		var deferred = $q.defer();		
		var url =  '/sample_json/contracts/rvCompanyCardContractsDetails.json';	
		rvBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;		
	};


}]);