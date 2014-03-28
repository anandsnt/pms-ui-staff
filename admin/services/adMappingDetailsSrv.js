admin.service('ADMappingDetailsSrv', ['$http', '$q', 'ADBaseWebSrv',
function($http, $q, ADBaseWebSrv) {
	
	
		this.fetchAddData = function(){
		var deferred = $q.defer();
		var url = '/admin/hotels/new.json';	
		//var url = '/sample_json/ng_admin/adSntApp.json';
		ADBaseWebSrv.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};	
	this.fetchEditData = function(data){
		var deferred = $q.defer();
		var url = '/admin/hotels/'+data.id+'/edit.json';	
		//var url = '/sample_json/ng_admin/adSntApp.json';
		ADBaseWebSrv.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};	
	

}]); 