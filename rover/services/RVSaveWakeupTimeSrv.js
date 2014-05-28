sntRover.service('RVSaveWakeupTimeSrv',['$q', 'RVBaseWebSrv', function($q, RVBaseWebSrv){
		
	this.saveWakeupTime = function(param){
		var deferred = $q.defer();
		var url =  '/staff/guest_cards/'+userId;			
		RVBaseWebSrv.putJSON(url, param).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;		
		
	};

	this.deleteWakeupTime = function(param){
		var deferred = $q.defer();
		var url =  '/staff/guest_cards/'+userId;			
		RVBaseWebSrv.putJSON(url, param).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;		
		
	};

	this.getWakeupTimeDetails = function(param){
		var deferred = $q.defer();
		var dataToSend = param.data;
		var url =  '/staff/guest_cards/'+userId;			
		RVBaseWebSrv.postJSON(url, dataToSend).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;		
		
	};


}]);