sntRover.service('RVCompanyCardSrv',['$q', 'RVBaseWebSrv', function($q, RVBaseWebSrv){
	
	var self = this;
	
	this.fetchContactInformation = function(){
		var deferred = $q.defer();		
		var url =  '/sample_json/contracts/rvCompanyCardDetails.json';			
		RVBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;		
		
	};


}]);