sntRover.service('RVLoyaltyProgramSrv',['$q', 'RVBaseWebSrv', function($q, RVBaseWebSrv){
		
	this.addLoyaltyProgram = function(param){
		var deferred = $q.defer();
		var url =  '/wakeup/set_wakeup_calls';			
		RVBaseWebSrv.postJSON(url, param).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;		
		
	};

	this.getLoyaltyDetails = function(param){
		var deferred = $q.defer();
		var url =  '/staff/user_memberships/new_loyalty';			
		RVBaseWebSrv.getJSON(url, param).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;		
		
	};


}]);