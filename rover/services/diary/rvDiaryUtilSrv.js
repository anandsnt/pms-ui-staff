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
    		clearRowClasses;

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
			//var newReservation = _.extend({}, reservation);

			//newReservation.start_date = new Date(newReservation.start_date);
			//newReservation.end_date = new Date(newReservation.end_date);

			return _.extend({}, reservation);
		};

		copyRoom = function(room) {
			var rc_meta = meta.room.row_children,
				newRoom = {}, 
				resLen = (_.isArray(room[rc_meta]) ? room[rc_meta].length : 0);

			_.extend(newRoom, room);

			newRoom[rc_meta] = [];

			for(var i = 0; i < resLen; i++) {
				newRoom[rc_meta].push(copyReservation(room[rc_meta][i]));
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
				throw Error('rooms is not an array.');
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