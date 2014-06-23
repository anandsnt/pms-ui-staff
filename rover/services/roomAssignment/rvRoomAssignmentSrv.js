sntRover.service('RVRoomAssignmentSrv',['$q', 'RVBaseWebSrv', function($q, RVBaseWebSrv){
		
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
		var url =  '/staff/reservation/modify_reservationfghfgjh';			
		RVBaseWebSrv.postJSON(url, param).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;		
		
	};

}]);