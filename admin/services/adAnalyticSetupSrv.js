admin.service('adAnalyticSetupSrv',['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2){
   
	this.fetchSetup = function(){
		var deferred = $q.defer();
		var url = 'api/analytics_setups.json';
		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	this.saveSetup = function(data){
		var deferred = $q.defer();
		var url = 'api/analytics_setups/save_setup';
		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
}]);