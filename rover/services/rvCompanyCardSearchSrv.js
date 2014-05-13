sntRover.service('RVCompanyCardSearchSrv',['$q', 'RVBaseWebSrv', function($q, RVBaseWebSrv){
	
	var self = this;
	
	this.fetch = function(){
		var deferred = $q.defer();		
		var url =  '/sample_json/contracts/rvCompanyCardSearchSrv.json';			
		RVBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;		
		
	};


}]);