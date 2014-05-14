sntRover.service('RVContactInfoSrv',['$q', 'RVBaseWebSrv', function($q, RVBaseWebSrv){
		
	this.saveContactInfo = function(param){
		var deferred = $q.defer();
		var dataToSend = param.data;
		var userId = param.userId;
		var url =  '/staff/guest_cards/'+userId;			
		RVBaseWebSrv.putJSON(url, dataToSend).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;		
		
	};


}]);