sntRover.service('RVSaveWakeupTimeSrv',['$q', 'RVBaseWebSrv', function($q, RVBaseWebSrv){

	this.saveWakeupTime = function(param){
		var deferred = $q.defer();
		var url =  '/wakeup/set_wakeup_calls';
		RVBaseWebSrv.postJSON(url, param).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;

	};

	this.getWakeupTimeDetails = function(param){
		var deferred = $q.defer();
		var url =  '/wakeup/wakeup_calls';
		RVBaseWebSrv.postJSON(url, param).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;

	};


}]);