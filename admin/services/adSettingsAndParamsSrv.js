admin.service('settingsAndParamsSrv',['$http', '$q', 'ADBaseWebSrvV2','ADBaseWebSrv', function($http, $q, ADBaseWebSrvV2,ADBaseWebSrv){

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
		var url = "/api/hotel_settings/change_settings";
		ADBaseWebSrvV2.postJSON(url,data).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
    *   A getter method to return the charge codes list
    */
    this.fetchChargeCodes = function(){
        var deferred = $q.defer();
        var url = '/admin/charge_codes/minimal_list.json';
        
        ADBaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data);
        },function(data){
            deferred.reject(data);
        });
        return deferred.promise;
    };
}]);