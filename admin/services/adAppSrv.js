admin.service('ADAppSrv',['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv){

	this.fetch = function(){
		var deferred = $q.defer();
		var url = '/sample_json/ng_admin/adApp.json';	
		//var url = '/sample_json/ng_admin/adSntApp.json';
		ADBaseWebSrv.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};


}]);