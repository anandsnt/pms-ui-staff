sntRover.service('RVWorkstationSrv',['$q', 'RVBaseWebSrv', 'rvBaseWebSrvV2', function($q, RVBaseWebSrv, rvBaseWebSrvV2){

	this.setWorkstation = function(param){
		var deferred = $q.defer();
		var url =  '/api/workstations/set_workstation';
		RVBaseWebSrv.postJSON(url, param).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.createWorkstation = function(param){
		var deferred = $q.defer();
		var url =  '/staff/preferences/room_assignment.json';
		RVBaseWebSrv.getJSON(url, param).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;

	};
	
}]);