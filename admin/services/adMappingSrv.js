admin.service('ADMappingSrv', ['$http', '$q', 'ADBaseWebSrv',
function($http, $q, ADBaseWebSrv) {

	this.fetch = function(data){
		var deferred = $q.defer();
		var url = "/admin/external_mappings/"+data.id+"/list_mappings.json";
		//var url = '/admin/hotels/new.json';	
		//var url = '/sample_json/ng_admin/adSntApp.json';
		ADBaseWebSrv.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};	

}]); 