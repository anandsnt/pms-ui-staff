admin.service('ADExternalPmsConnectivitySrv',['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv){
   /**
    * To fetch the details of external connection
    * @return {object} external connectivity details
    */
	this.getExternalPmsConnectivityDetails = function(){

		var deferred = $q.defer();
		var url = '/admin/get_pms_connection_config.json';

		ADBaseWebSrv.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

   /*
    * To test connectivity
    * @param {array} data of the connectivity
    * @return {object} status of the api
    */
	this.testConnectivity = function(data){
		var deferred = $q.defer();
		var url = '/admin/test_pms_connection';

		ADBaseWebSrv.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
			if(typeof data === 'string') data = [data];
		    deferred.reject(data);
		});
		return deferred.promise;
	};
   /*
    * To save connectivity details
    * @param {array} details of connectivity
    * @return {object} status of save
    */
	this.saveConnectivity = function(data){
		var deferred = $q.defer();
		var url = '/admin/save_pms_connection_config';

		ADBaseWebSrv.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

}]);