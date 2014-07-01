sntRover.service('RVSearchSrv',['$q', 'RVBaseWebSrv', function($q, RVBaseWebSrv){
	
	var self = this;
	
	this.fetch = function(dataToSend){
		var deferred = $q.defer();
		dataToSend.fakeDataToAvoidCache = new Date();
		var url =  'search.json';			
		RVBaseWebSrv.getJSON(url, dataToSend).then(function(data) {
			for(var i = 0; i < data.length; i++){
				data[i].is_row_visible = true;
			}
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;		
		
	};


}]);