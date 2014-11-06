sntRover
.factory('rvDiaryUtilSrv', ['rvDiarySrv', 'rvDiaryMetadata',
    function (rvDiarySrv, rvDiaryMetadata) {
    	var meta = rvDiaryMetadata,
    		index = rvDiarySrv.store,
    		findRoom,
    		roomIndex,
    		reservationIndex,
    		copyReservation,
    		copyRoom,
    		updateRoomStatus,
    		updateReservation,
    		removeReservation,
    		clearRoomQuery,
    		reservationRoomTransfer,
    		clearRowClasses,
    		deepCopy,
    		copyArray;

	 	findRoom = function(room) {
			return index.rooms[room[meta.room.id]];
		};

		roomIndex = function(room) {
			var idx = -1, meta_id = meta.room.id, data = rvDiarySrv.rooms;

			if(room) {
				for(var i = 0, len = data.length; i < len; i++){
					if(data[i][meta_id] === room[meta_id]) {
						idx = i;
						return idx;
					}
				}
			}

			return idx;
		};

		reservationIndex = function(room, reservation) {
			var idx = -1, 
				rc_meta = meta.room.row_children, 
				oc_meta = meta.occupancy;

			for(var i = 0, len = room[rc_meta].length; i < len; i++) {
				if(room[rc_meta][i].id === reservation[oc_meta.id]) {
					idx = i;
					return idx;
				}
			}

			return idx;		
		};

		copyReservation = function(reservation) {
			return _.extend({}, reservation);
		};

		deepCopy = function(obj) {
			var hops = Object.prototype.hasOwnProperty,
				slice = Array.prototype.slice,
				newRes = {};

			for(var k in  obj) {
				if(hops.call(obj, k)) {
					if(obj[k] instanceof Date) {
						newRes[k] = new Date(obj[k].getTime());
					} else if(_.isArray(obj[k])) {
						newRes[k] = deepCopy(slice.call(obj[k]));
					} else if(_.isObject(obj[k])) {
						newRes[k] = deepCopy(obj[k]);
					} else {
						newRes[k] = obj[k];
					}
				}
			}

			return newRes;
		};

		copyArray = function(src, dest){
    		dest = [];

    		for(var i = 0, len = src.length; i < len; i++) {
    			dest.push(_.extend({}, src[i]));
    		}

    		return dest;
    	};

		copyRoom = function(room) {
			var rc_meta = meta.room.row_children,
				newRoom = {}, 
				resLen = (_.isArray(room.occupancy) ? room.occupancy.length : 0);

			_.extend(newRoom, room);

			newRoom.occupancy = [];

			for(var i = 0; i < resLen; i++) {
				newRoom.occupancy.push(copyReservation(room.occupancy[i]));
			}

			return newRoom;
		};

		updateRoomStatus = function(room, status) {
			room[meta.room.status] = status;
		};

		updateReservation = function(room, reservation) {
			var idx = reservationIndex(room, reservation);
		
			if(idx > -1) {
				room[meta.room.row_children][idx] = reservation;
			}		
		};

		removeReservation = function(room, reservation) {
			var idx = reservationIndex(room, reservation);
		
			if(idx > -1) {
				return room[meta.room.row_children].splice(idx, 1);
			}

			return;	
		};

		clearRoomQuery = function(rooms) {
			var room, 
				children = meta.room.row_children,
				cur,
				occupancy = [];

			if(!_.isArray(rooms)) {
				return;
			}

			for(var i = 0, len = rooms.length; i < len; i++) {
				room = rooms[i];

				for(var j = 0, jlen = room[children].length; j < jlen; j++) {
					if(!room[children][j].temporary) {
						occupancy.push(room[children][i]);
					}
				}

				room[children] = occupancy;

				room = copyRoom(room);
			}			
		};  

	 	reservationRoomTransfer = function(nextRoom, room, reservation) { //, commit) {
			var data = rvDiarySrv.rooms,
				oldRoom, 
				newRoom, 
				idxOldRoom, 
				idxNewRoom, 
				rc_meta = meta.room.row_children;

			oldRoom = copyRoom(room);

			if(nextRoom.id !== room.id) {
				newRoom = copyRoom(nextRoom);

				removeReservation(oldRoom, reservation);

				newRoom[rc_meta].push(copyReservation(reservation));
			} else {
				updateReservation(oldRoom, reservation);
			}

			idxOldRoom = roomIndex(oldRoom);
			idxNewRoom = roomIndex(newRoom);

			//if(commit) {
			if(idxOldRoom > -1 && idxOldRoom < data.length) {
				data[idxOldRoom] = oldRoom;
			}

			if(idxNewRoom > -1 && idxNewRoom < data.length) {
				data[idxNewRoom] = newRoom;
			}
		};

		clearRowClasses = function() {
	    	var data = rvDiarySrv.rooms;

	    	for(var i = 0, len = data.length; i < len; i++) {
	    		data[i] = copyRoom(data[i]);
	    		data[i][meta.room.status] = '';
	    	}
	    };

		return {
			clearRoomQuery: clearRoomQuery,
			removeReservation: removeReservation,
			updateReservation: updateReservation,
			updateRoomStatus: updateRoomStatus,
			copyRoom: copyRoom,
			copyReservation: copyReservation,
			reservationIndex: reservationIndex,
			roomIndex: roomIndex,
			findRoom: findRoom,
			reservationRoomTransfer: reservationRoomTransfer,
			clearRowClasses: clearRowClasses
		}; 	
	}
]);