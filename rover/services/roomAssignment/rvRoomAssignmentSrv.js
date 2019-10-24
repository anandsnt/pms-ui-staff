angular.module('sntRover').service('RVRoomAssignmentSrv', ['$q', 'RVBaseWebSrv', 'rvBaseWebSrvV2', function($q, RVBaseWebSrv, rvBaseWebSrvV2) {

    var self = this;

    // Holds the cached response for available rooms API
    this.cachedRoomsResponse = {};

    this.getRooms = function(param) {
        var deferred = $q.defer();
        var url =  '/staff/rooms/get_rooms';

        RVBaseWebSrv.postJSON(url, param).then(function(data) {     
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

    // Perform pagination on the given data
    this.getPaginatedResult  = function (response, pageNo, perPage) {
        var start = ( pageNo - 1 ) * perPage,
            end = start + perPage,
            data = JSON.parse(JSON.stringify(response));

        data.rooms = !_.isEmpty(data.rooms) ? data.rooms.slice(start, end) : data.rooms;
        return data;
    };
    // Search rooms based on the query string
    this.searchRooms = function( params ) {
        var deferred = $q.defer(),
            url =  'api/rooms/search';

        if (params.page_no === 1) {
            RVBaseWebSrv.postJSON(url, params).then(function(data) {    
                self.cachedRoomsResponse = JSON.parse(JSON.stringify(data));
                deferred.resolve(self.getPaginatedResult(data, params.page_no, params.per_page));

            }, function(data) {
                self.cachedRoomsResponse = {};
                deferred.reject(data);
            });
        } else {
            deferred.resolve(self.getPaginatedResult(self.cachedRoomsResponse, params.page_no, params.per_page));
        }
        
        return deferred.promise;

    };
    // Get rooms belonging to a given room type
    this.getRoomsByRoomType = function( params ) {
        var deferred = $q.defer(),
            url =  '/api/rooms/retrieve_available_rooms';

        if (params.page_no === 1) {
            RVBaseWebSrv.postJSON(url, params).then(function(data) {        
                self.cachedRoomsResponse = JSON.parse(JSON.stringify(data));
                deferred.resolve(self.getPaginatedResult(data, params.page_no, params.per_page));
            }, function(data) {
                self.cachedRoomsResponse = {};
                deferred.reject(data);
            });
        } else {            
            deferred.resolve(self.getPaginatedResult(self.cachedRoomsResponse, params.page_no, params.per_page));
        }
        
        return deferred.promise;
    };
}]);