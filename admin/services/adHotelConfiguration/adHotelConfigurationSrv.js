admin.service('ADHotelConfigurationSrv',['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){
   /**
    * To fetch the list of device mapping
    * @return {object} mapping list json
    */
	this.editHotelConfiguration = function(params){
		
		var deferred = $q.defer();
		var url = '/api/email_templates/list.json';

		ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
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
	
}]);