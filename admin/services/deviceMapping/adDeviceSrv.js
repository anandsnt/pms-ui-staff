admin.service('ADDeviceSrv',['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){
   /**
    * To fetch the list of device mapping
    * @return {object} mapping list json
    */
	this.fetch = function(params){

		var deferred = $q.defer();
		var url = '/api/workstations.json';

		ADBaseWebSrvV2.getJSON(url, params).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
   /*
    * To save new device mapping
    * @param {array} data of the new mapping
    * @return {object} status and new id of new mapping
    */
	this.createMapping = function(data){
		var deferred = $q.defer();
		var url = '/api/workstations';

		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
   /*
    * To get the details of the selected mapping
    * @param {array} selected mapping id
    * @return {object} selected mapping details
    */
	this.getDeviceMappingDetails = function(data){
		var deferred = $q.defer();
		var id = data.id;
		var url = '/api/workstations/'+id;

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
   /*
    * To update mapping data
    * @param {array} data of the modified mapping
    * @return {object} status of updated mapping
    */
	this.updateMapping = function(data){

		var deferred = $q.defer();
		var url = '/api/workstations/'+data.id;

		ADBaseWebSrvV2.putJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
   /*
    * To delete the seleceted mapping
    * @param {int} id of the selected mapping
    * @return {object} status of delete
    */
	this.deleteDeviceMapping = function(id){
		var deferred = $q.defer();
		var url = '/api/workstations/'+id;

		ADBaseWebSrvV2.deleteJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
}]);