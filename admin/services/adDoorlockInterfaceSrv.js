admin.service('ADDoorlockInterfaceSrv',['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){

	this.fetch = function(){
		var deferred = $q.defer();
		//var url = '/sample_json/door_lock_interface/render.json';
		var url = '/api/door_lock_interfaces.json';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};


	this.save = function(params){
		var deferred = $q.defer();
		//var url = '/sample_json/door_lock_interface/render.json';
		var url = '/api/door_lock_interfaces';

		ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

}]);