sntRover
.factory('RVDiaryRooms', ['Q', 'rvDiarySrv', 'rvDiaryStoreSrv', 'rvDiaryCollectionSrv',
    function(Q, rvDiarySrv, store, classes) {   


    function Rooms(rooms) {

    }
    Rooms.prototype = Object.create(classes.Collection.prototype);
    Rooms.prototype.constructor = Rooms;

    function Room(room) {

    }
    Room.prototype = Object.create(classes.Simplex.constructor);
    Room.prototype.constructor = Room;
    
}]);