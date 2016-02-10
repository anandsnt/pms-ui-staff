admin.service('ADzestWebGlobalSettingsSrv',['$q', 'ADBaseWebSrvV2', function($q, ADBaseWebSrvV2){

   /*
	* service class for zest web global settings
	*/

   /*
    * getter method to zest web global settings
    * @return {object} zest web global settings
    */
	this.fetchZestwebGlobalSettings = function(){
		var deferred = $q.defer();
		var url = '/sample_json/zestweb_v2/zestweb_global_settings.json';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

	/*
	* method to save the zest web global settings
	* @param {object} with zest web global settings
	*/
	this.saveZestwebGlobalSettings = function(data){
		var deferred = $q.defer();
		var url = '/admin/hotel/save_announcements_settings';

		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

}]);