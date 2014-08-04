admin.service('settingsAndParamsSrv',['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){

	/*
    * To fetch settings and params
    * @return {object} 
    */	
	this.fetchsettingsAndParamsSrv = function(){
		var deferred = $q.defer();
		//var url = '/admin/hotel_chains.json';	
		
		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

}]);