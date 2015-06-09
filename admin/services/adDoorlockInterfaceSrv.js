admin.service('ADDoorlockInterfaceSrv',['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){
   /**
    * To fetch the list of hold status
    * @return {object} hold statuses json
    */
	this.fetch = function(){		
		var deferred = $q.defer();
		var url = '/sample_json/door_lock_interface/render.json';
		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
   
}]);