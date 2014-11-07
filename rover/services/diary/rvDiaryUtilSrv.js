sntRover
.factory('rvDiaryUtilSrv', ['rvDiaryMetadata',
    function (rvDiaryMetadata) {
    	var meta = rvDiaryMetadata,
    		occ_meta = meta.occupancy,
    		rom_meta = meta.room,
    		avl_meta = meta.availability,
    		hops = Object.prototype.hasOwnProperty,
    		slice = Array.prototype.slice,
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
    		shallowCopy,
    		deepCopy,
    		copyArray;

		copyArray = function(src, dest){
    		var val; 

    		dest = [];

    		for(var i = 0, len = src.length; i < len; i++) {
    			if(_.isObject(src[i])) {
    				val = deepCopy(src[i]);
    			} else if (_.isArray(src[i])) {
    				val = copyArray(src[i]);
    			} else {
    				val = src[i];
    			}
    			
    			dest.push(val);
    		}

    		return dest;
    	};

    	shallowCopy = function(dest, src) {
    		var k;

    		for(k in src) {
    			if(hops.call(src, k) && 
    			   typeof src[k] !== 'function') {
    				dest[k] = src[k];
    			}
    		}

    		return dest;
    	};

		deepCopy = function(obj) {
			var newRes = {};

				for(var k in  obj) {
					if(hops.call(obj, k)) {
						if(obj[k] instanceof Date) {
							newRes[k] = new Date(obj[k].getTime());
						} else if(_.isArray(obj[k])) {
							newRes[k] = copyArray(obj[k]);
						} else if(_.isObject(obj[k])) {
							newRes[k] = deepCopy(obj[k]);
						} else {
							newRes[k] = obj[k];
						}
					}
				}

			return newRes;
		};

		roomIndex = function(rooms, room) {
			var idx = -1;

			for(var i = 0, len = data.length; i < len; i++){
				if(data[i].id === room.id) {
					idx = i;
					return idx;
				}
			}
		
			return idx;
		};

		reservationIndex = function(room, reservation) {
			var idx = -1, occupancy = room.occupancy;

			for(var i = 0, len = occupancy.length; i < len; i++) {
				if(occupancy[i].reservation_id === reservation.reservation_id) {
					idx = i;
					return idx;
				}
			}

			return idx;		
		};

		copyReservation = function(reservation) {
			return shallowCopy({}, reservation);
		};

		/*copyRoom = function(room) {
			var rc_meta = rom_meta.row_children,
				newRoom = {}, 
				children,
				len = (_.isArray(room.occupancy) ? room.occupancy.length : 0);

			shallowCopy(newRoom, room);

			Object.defineProperty(newRoom, rc_meta, {
				configurable: true,
				value: []
			});

			children = newRoom[rc_meta];

			for(var i = 0; i < len; i++) {
				children.push(copyReservation(room[rc_meta][i]));
			}

			return newRoom;
		};*/

		copyRoom = function(room) {
			return deepCopy(room);
		};

		updateRoomStatus = function(room, status) {
			room[meta.room.status] = status;
		};

		updateReservation = function(room, reservation) {
			var idx = reservationIndex(room, reservation);
		
			if(idx > -1) {
				room.occupancy[idx] = reservation;
			}		
		};

		removeReservation = function(room, reservation) {
			var idx = reservationIndex(room, reservation);
		
			if(idx > -1) {
				return room.occupancy.splice(idx, 1);
			}

			return;	
		};

		clearRoomQuery = function(rooms) {
			var room,
				reject = function(child) {
					return child.temporary === true;
				};

			for(var i = 0, len = rooms.length; i < len; i++) {
				room = rooms[i];
				room.occupancy = _.reject(room.occupancy, reject);	
				room = deepCopy(room);							 
			}
		};
		
		/*clearRoomQuery = function(rooms) {
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
		}; */ 

	 	reservationRoomTransfer = function(rooms, nextRoom, room, reservation) { //, commit) {
			var data = rooms,
				oldRoom, 
				newRoom, 
				idxOldRoom, 
				idxNewRoom;

			oldRoom = copyRoom(room);

			if(nextRoom.id !== room.id) {
				newRoom = copyRoom(nextRoom);

				removeReservation(oldRoom, reservation);

				newRoom.occpuancy.push(copyReservation(reservation));
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

		clearRowClasses = function(rooms) {
	    	var data = rooms;

	    	for(var i = 0, len = data.length; i < len; i++) {
	    		data[i] = deepCopy(data[i]);
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
			reservationRoomTransfer: reservationRoomTransfer,
			clearRowClasses: clearRowClasses,
			shallowCopy: shallowCopy,
			copyArray: copyArray,
			deepCopy: deepCopy
		}; 	
	}
]);