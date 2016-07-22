admin.service('adTelnetInterfaceSrv',['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){
   /**
    * To test the telent
    */
	this.testTelnetConnectivity = function(params){

		var deferred = $q.defer();
		var url = '/admin/telnet';

		ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
		    deferred.resolve();
		},function(error){
		    deferred.reject(error);
		});
		return deferred.promise;
	};
}]);