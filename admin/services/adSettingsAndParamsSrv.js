admin.service('settingsAndParamsSrv',['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){

 /*
    * To fetch settings and params
    * @return {object} 
    */	
	this.fetchsettingsAndParams = function(){
		var deferred = $q.defer();
		var url = '/api/hotel_settings';	

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

 /*
    * To save settings and params
    * @return {object} 
    */	
	this.saveSettingsAndParamsSrv = function(data){
		var deferred = $q.defer();
		var url = "/api/hotel_settings";		
		ADBaseWebSrvV2.postJSON(url,data).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

}]);