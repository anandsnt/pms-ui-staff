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
		var reservationId = param.reservationId;
		var url =  'api/reservations/' + reservationId + '/unassign_room';
		rvBaseWebSrvV2.postJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;

	};
	this.moveInHouseRooms = function(param){
		var deferred = $q.defer();
		var url =  '/staff/reservation/room_inhouse_move';
		rvBaseWebSrvV2.getJSON(url, param).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;

	};
}]);