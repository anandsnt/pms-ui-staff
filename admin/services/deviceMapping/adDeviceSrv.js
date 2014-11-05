admin.service('ADDeviceSrv',['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){
   /**
    * To fetch the list of device mapping
    * @return {object} mapping list json
    */
	this.fetch = function(){
		
		var deferred = $q.defer();
		var url = '/api/work_stations.json';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
   /*
    * To save new device mapping
    * @param {array} data of the new department
    * @return {object} status and new id of new department
    */
	this.createMapping = function(data){
		var deferred = $q.defer();
		var url = '/api/work_stations';	

		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
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
	this.getDeviceMappingDetails = function(data){
		var deferred = $q.defer();
		var id = data.id;
		var url = '/api/work_stations/'+id;	

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
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
	this.updateMapping = function(data){

		var deferred = $q.defer();
		var url = '/api/work_stations/'+data.id;

		ADBaseWebSrvV2.putJSON(url, data).then(function(data) {
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