admin.service('adCheckinSrv',['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv){
/*
* To fetch checkin
* @return {object} checkin details
*/	
this.fetch = function(){
	var deferred = $q.defer();
	var url = '/admin/checkin_setups/list_setup.json';	
	
	ADBaseWebSrv.getJSON(url).then(function(data) {
		deferred.resolve(data);
	},function(data){
		deferred.reject(data);
	});
	return deferred.promise;
};

/*
* To save checkin
* @param {object} checkin details
*/	
this.save = function(data){
	var deferred = $q.defer();
	var url = '/admin/checkin_setups/save_setup';	
	
	ADBaseWebSrv.postJSON(url,data).then(function(data) {
		deferred.resolve(data);
	},function(data){
		deferred.reject(data);
	});
	return deferred.promise;
};


}]);