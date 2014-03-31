admin.service('ADMappingSrv', ['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv) {

	this.fetch = function(data) {
		var deferred = $q.defer();
		var url = "/admin/external_mappings/" + data.id + "/list_mappings.json";
		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
	
	this.editMapping = function(data){

		var deferred = $q.defer();
		var url = '/admin/external_mappings/'+data.editId+'/edit_mapping.json'
		
		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
			
		});
		return deferred.promise;
	};

}]);
