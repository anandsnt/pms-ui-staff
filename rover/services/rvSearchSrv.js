sntRover.service('RVSearchSrv',['$q', 'RVBaseWebSrv', function($q, RVBaseWebSrv){
	
	var self = this;
	
	this.fetch = function(){
		var deferred = $q.defer();
		var data = {fakeDataToAvoidCache: new Date(), status: 'INHOUSE'};
		var url =  'search.json';	
		
		RVBaseWebSrv.getJSON(url, data).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;		
		
	};


}]);