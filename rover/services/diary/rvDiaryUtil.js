sntRover
.factory('rvDiaryUtil', ['rvDiaryMetadata',
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
    		copyArray,
    		mixin,
            inherit,
            gridTimeComponents;

        gridTimeComponents = function(arrival_ms, display_total_hours, display) {
            var ret,
                ms_per_day      = 43200000,
                ms_per_hr       = 3600000,
                perspective_offset = (arrival_ms instanceof Date ? new Date(Date.now()).toComponents().time.hours : 0),
                x_origin            = (arrival_ms instanceof Date ? arrival_ms.setHours(new Date(Date.now()).toComponents().time.hours,0,0) : arrival_ms), 
                x_max               = (display_total_hours - perspective_offset) * ms_per_hr, 
                x_min               = (display_total_hours * ms_per_hr - x_max),
                x_right             = x_origin + x_max, 
                x_left              = x_origin - x_min,
                x_offset            = x_origin - (ms_per_hr * 2); 

            ret = {
                x_offset: new Date(x_offset),
                x_origin: new Date(x_origin),
                x_0:  new Date(x_origin),
                x_n: new Date(x_left),
                x_p: new Date(x_right),
                toStartDate: function() {
                    return new Date(new Date(x_left).setHours(0, 0, 0));
                },
                toEndDate: function() {
                    return new Date(new Date(x_right).setHours(23, 59, 0));
                }
            };

            ret.x_origin_start_time = ret.x_origin.toComponents().time.convertToReferenceInterval(15); 
            ret.x_n_time = ret.x_n.toComponents().time.convertToReferenceInterval(15);
            ret.x_p_time = ret.x_p.toComponents().time.convertToReferenceInterval(15);

            if(display) {
                display.x_offset                = x_offset;
                display.x_origin                = x_origin;
                display.x_origin_start_time     = ret.x_0.toComponents().time.convertToReferenceInterval(15); 
                display.x_n                     = x_left;
                display.x_0                     = x_origin; //ret.x_n.getTime();
                display.x_n_time                = ret.x_n.toComponents().time.convertToReferenceInterval(15);
                display.x_p                     = x_right;
                display.x_p_time                = ret.x_p.toComponents().time.convertToReferenceInterval(15);

               ret.display = display;
            }

            return ret;
        };

        inherit = function(child, base) {
            child.prototype = Object.create(base.prototype);
            child.prototype.constructor = child;
        };

		mixin = function() {
			var objects = slice.call(arguments),
				i = 0,
				k,
				len = objects.length,
				base = Object.create(null);

			for(; i < len; i++) {
				for(k in objects[i]) {
					if(hops.call(objects[i], k)) {
						base[k] = objects[i][k];
					}
				}
			}
				
			return base;
		};	

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

			for(var i = 0, len = rooms.length; i < len; i++){
				if(rooms[i].id === room.id) {
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
                m_status = meta.occupancy.status,
				reject = function(child) {
					return angular.lowercase(child[m_status]) === 'available'; //child.temporary === true;
				};

			for(var i = 0, len = rooms.length; i < len; i++) {
				room = rooms[i];
				room.occupancy = _.reject(room.occupancy, reject);	
				room = deepCopy(room);							 
			}
		};

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

                idxOldRoom = roomIndex(rooms, oldRoom);
                idxNewRoom = roomIndex(rooms, newRoom);

                //if(commit) {
                if(idxOldRoom > -1 && idxOldRoom < data.length) {
                    data[idxOldRoom] = oldRoom;
                }

                if(idxNewRoom > -1 && idxNewRoom < data.length) {
                    data[idxNewRoom] = newRoom;
                }
			} else {
				updateReservation(oldRoom, reservation);
			}


		};

		clearRowClasses = function(rooms) {
	    	var data = rooms;

	    	for(var i = 0, len = data.length; i < len; i++) {
	    		data[i] = deepCopy(data[i]);
	    		data[i][meta.room.status] = '';
	    	}
	    };

	    registerNotifictions = function(obj) {
	    	if(_.isObject(obj)) {
	    		for(var k in obj) {
	    			if(hops.call(obj, k)) {
	    				switch(typeof obj[k]) {
	    					case 'function':
	    						
	    					break;
	    				}
	    			}
	    		}
	    	}
	    };

		return {
            gridTimeComponents: gridTimeComponents,
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
			deepCopy: deepCopy,
			mixin: mixin
		}; 	
	}
]);
