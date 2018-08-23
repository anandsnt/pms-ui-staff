angular.module('sntRover').service('RVRoomAssignmentSrv', ['$q', 'RVBaseWebSrv', 'rvBaseWebSrvV2', function($q, RVBaseWebSrv, rvBaseWebSrvV2) {

	this.getRooms = function(param) {
		var deferred = $q.defer();
		var url =  '/staff/rooms/get_rooms';

		RVBaseWebSrv.postJSON(url, param).then(function(data) {
			var start = (param.page - 1) * param.per_page,
			    end = start + param.per_page;

			data.totalCount =  data.rooms.length;   
			data.rooms = data.rooms.slice(start, end);

			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;

	};
	this.getPreferences = function(param) {
		var deferred = $q.defer();
		var url =  '/staff/preferences/room_assignment.json';

		RVBaseWebSrv.getJSON(url, param).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;

	};
	this.assignRoom = function(param) {
		var deferred = $q.defer();
		var url =  '/staff/reservation/modify_reservation';

		RVBaseWebSrv.postJSON(url, param).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;

	};

	this.UnAssignRoom = function(param) {
		var deferred = $q.defer();
		var reservationId = param.reservationId;
		var url =  'api/reservations/' + reservationId + '/unassign_room';

		rvBaseWebSrvV2.postJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;

	};
	this.moveInHouseRooms = function(param) {
		var deferred = $q.defer();
		var url =  '/staff/reservation/room_inhouse_move';

		rvBaseWebSrvV2.getJSON(url, param).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;

	};
	// Search rooms based on the query string
	this.searchRooms = function( param ) {
		var deferred = $q.defer();
		var url =  'api/rooms/search';

		RVBaseWebSrv.postJSON(url, param).then(function(data) {	
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;

	};
	// Get rooms belonging to a given room type
	this.getRoomsByRoomType = function(param) {
		var deferred = $q.defer();
		var url =  '/api/rooms/retrieve_available_rooms';

		RVBaseWebSrv.postJSON(url, param).then(function(data) {		
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;

	};
}]);