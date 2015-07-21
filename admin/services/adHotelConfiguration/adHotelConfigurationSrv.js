admin.service('ADHotelConfigurationSrv',['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){
   /**
    * To get configuration details
    * @return {object} mapping list json
    */
	this.editHotelConfiguration = function(params){

		var deferred = $q.defer();
		var url = '/api/email_templates/list.json';

		ADBaseWebSrvV2.getJSON(url, params).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
   /*
    * To update configuration
    * @param {array} data of the new mapping
    * @return {object} status and new id of new mapping
    */
   this.updateHotelConfiguration = function(params){
   		var deferred = $q.defer();
		var url = '/api/email_templates/assign_to_hotel.json';

		ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
   };
	this.getTemplateThemes = function(data){
		var deferred = $q.defer();
		var url = '/api/email_templates/email_templates.json';

		ADBaseWebSrvV2.getJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
}]);