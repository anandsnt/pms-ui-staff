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
   /*
    * To save new department
    * @param {array} data of the new department
    * @return {object} status and new id of new department
    */
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
   /*
    * To get the details of the selected department
    * @param {array} selected department id
    * @return {object} selected department details
    */
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
   /*
    * To update department data
    * @param {array} data of the modified department
    * @return {object} status of updated department
    */
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
   /*
    * To delete the seleceted department
    * @param {int} id of the selected department
    * @return {object} status of delete
    */
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