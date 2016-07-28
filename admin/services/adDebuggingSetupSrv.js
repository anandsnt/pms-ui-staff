admin.service('adDebuggingSetupSrv',['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2){

	this.fetchDevices = function(){
		var deferred = $q.defer();
		var url = '/api/notifications/notification_device_list?application=ROVER';
		ADBaseWebSrvV2.getJSON(url).then(function({}) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	this.saveSetup = function(data){
		var deferred = $q.defer();
		var url = '/api/notifications/set_loggging_status';
		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
}]);