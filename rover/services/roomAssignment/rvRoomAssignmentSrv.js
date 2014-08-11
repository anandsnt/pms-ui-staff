sntRover.service('RVRoomAssignmentSrv',['$q', 'RVBaseWebSrv', 'rvBaseWebSrvV2', function($q, RVBaseWebSrv, rvBaseWebSrvV2){
		
	this.getRooms = function(param){
		var deferred = $q.defer();
		var url =  '/staff/rooms/get_rooms';			
		RVBaseWebSrv.postJSON(url, param).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;		
		
	};
	this.getPreferences = function(param){
		var deferred = $q.defer();
		var url =  '/staff/preferences/room_assignment.json';			
		RVBaseWebSrv.getJSON(url, param).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;		
		
	};
	this.assignRoom = function(param){
		var deferred = $q.defer();
		var url =  '/staff/reservation/modify_reservation';			
		RVBaseWebSrv.postJSON(url, param).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;		
		
	};

	this.UnAssignRoom = function(param){
		var deferred = $q.defer();
		var url =  '/api/reservations/unassign_room';			
		RVBaseWebSrv.postJSON(url, param).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;		
		
	};
}]);