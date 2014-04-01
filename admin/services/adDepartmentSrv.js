admin.service('ADDepartmentSrv',['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv){
   /**
    * To fetch the list of users
    * @return {object} users list json
    */
	this.fetch = function(){
		
		var deferred = $q.defer();
		var url = '/admin/departments.json';

		ADBaseWebSrv.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
	this.saveDepartment = function(data){
		var deferred = $q.defer();
		var url = '/admin/departments';	

		ADBaseWebSrv.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
	this.getDepartmentDetails = function(data){
		var deferred = $q.defer();
		var id = data.id;
		var url = '/admin/departments/'+id+'/edit.json';	

		ADBaseWebSrv.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
	
	this.updateDepartment = function(data){

		var deferred = $q.defer();
		var url = '/admin/departments/'+data.value;	

		ADBaseWebSrv.putJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
	this.deleteDepartment = function(id){
		var deferred = $q.defer();
		var url = '/admin/departments/'+id;	

		ADBaseWebSrv.deleteJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
		
	};


}]);