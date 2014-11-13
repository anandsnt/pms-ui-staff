sntRover
    .factory('rvDiaryStore', ['rvDiaryUtil', 'rvDiaryMetadata',
  function(util, meta) {
            var store = {
                    start_date: undefined,
                    end_date: undefined,
                    arrival_times: [],
                    rates: [],
                    rate_types: [],
                    room_types: [],
                    rooms: [],
                    occupancy: [],
                    availability: []
                },
                has = Object.prototype.hasOwnProperty,
                slice = Array.prototype.slice,
                define = Object.defineProperty,
                normalizeRooms,
                normalizeRoom,
                normalizeOccupancies,
                normalizeOuccupancy,
                normalizeAvailableOccupancy,
                normalizeTime,
                normalizeMaintenanceInterval,
                linkRooms,
                formatIncomingTimeData,
                mergeOccupanciesInASCTime;

            normalizeRooms = function(room_types, rooms) {
				var normalize = _.partial(normalizeRoom, room_types);

                room_types.unshift({ id: 'All', name: 'All', description:'All' });

				rooms.forEach(function(room) {
					rooms = normalize(room);
				});
			};

			normalizeRoom = function(room_types, room) {
				var rt;

                room.id = +room.id;
                room.room_no = +room.room_no;
                room.room_type_id = +room.room_type_id; 

                rt = _.findWhere(room_types, {
					id: room.room_type_id
				});

				room.key = _.uniqueId('rm-' + room.id + '-');
				room.room_type = (rt ? rt.name : '');

				if (!has.call(room, 'occupancy')) {
					define(room, 'occupancy', {
						enumerable: true,
						configurable: true,
						writable: true,
						value: []
					});
				}

				return room;
			};

			normalizeOccupancies = function(room_types, occupancies) {
				var normalize = _.partial(normalizeOccupancy, room_types);

				occupancies.forEach(function(occupancy) {
					normalize(occupancy);
				});
			};

            normalizeOccupancy = function(room_types, occupancy) {
                var m = meta.occupancy,
                    room_type = _.findWhere(room_types, {
                        id: occupancy.room_type_id
                    });

                occupancy.key = _.uniqueId('oc-' + occupancy[m.id] + '-');

                occupancy[m.start_date] = normalizeTime(occupancy.arrival_date,
                    occupancy.arrival_time);
                occupancy[m.end_date] = normalizeTime(occupancy.departure_date,
                    occupancy.departure_time);
                occupancy[m.maintenance] = normalizeMaintenanceInterval(room_type.housekeeping_task_completion_time, 15);

                occupancy[m.room_type] = room_type.name; //room_type.name;
            };

            mergeOccupanciesInASCTime = function(occupancies) {
                var rooms = store.rooms,
                    room,
                    m_arrival = meta.occupancy.arrival;


                occupancies.forEach(function(occupancy, idx) {
                    var compare = occupancy[m_arrival],
                        pos = -1;

                    room = _.findWhere(rooms, {
                        id: occupancy.room_id
                    });

                    if (room) {
                        room.occupancy.forEach(function(o, idx2) {
                            if (o[m_arrival] > compare) {
                                pos = idx2;
                                return pos;
                            }
                        });

                        if (pos > -1) {
                            room.occupancy.splice(idx, 0, occupancy);
                            pos = -1;
                        }
                    }
                });
            }

            normalizeAvailableOccupancy = function(start_date, end_date, rate_id, gen_uid, slot) {
                var rooms = store.rooms,
                    room, 
                    room_types = store.room_types,
                    pos = -1;

                slot.id = +slot.id;

                room = _.findWhere(rooms, {
                    id: slot.id
                });

                if (room) {
                    slot.temporary = true;
                    slot.room_id = +room.id;
                    slot.room_type_id = +room.room_type_id;
                    slot.reservation_status = 'available';
                    slot.room_service_status = '';
                    slot.reservation_id = gen_uid;
                    slot.rate_id = rate_id;
                    slot.amount = slot.amount;

                    formatIncomingTimeData(slot, start_date, 'arrival');
                    formatIncomingTimeData(slot, end_date, 'departure');

                    if (_.isArray(room.occupancy) && room.occupancy.length > 0) {
                        room.occupancy.forEach(function(o, idx) {
                            if (o.arrival > slot.arrival) {
                                pos = idx;
                                return pos;
                            }
                        });

                        room.occupancy.splice(1, 0, slot);

                        pos = -1;
                    } else {
                        room.occupancy.push(slot);
                    }

                    //SETUP MAINTENANCE SPAN AND ARRIVAL?DEPT IN MS
                    normalizeOccupancy(room_types, slot);

                    if (room.occupancy.length > 0)
                        return slot;
                    else
                        return;
                }
            };

            normalizeTime = function(date, time) {
                var std = (time.indexOf('am') > -1 || time.indexOf('pm') > -1),
                    t_a = time.slice(0, -3),
                    t_b = time.slice(-2);

                return Date.parse(date + ' ' + (std ? t_a + ' ' + t_b : time));
            };

            normalizeMaintenanceInterval = function(time) {
                var intervals = +time / 15,
                    intervals_per_hr = 4;

                return parseInt(intervals); //intervals_per_hr * t_a + parseInt(intervals);
            };

            linkRooms = function(rooms, occupancies) {
                occupancies.forEach(function(occupancy, idx) {
                    var room = _.findWhere(rooms, {
                            id: occupancy.room_id
                        }),
                        findOccupancy = _.findWhere.bind(this, room.occupancy);

                    if (!findOccupancy({
                        reservation_id: occupancy.reservation_id
                    })) {
                        room.occupancy.push(occupancy);
                    }
                });
            };

            formatIncomingTimeData = function(obj, date, prefix) {
                var comp = date.toComponents(),
                    s_date = comp.date,
                    s_time = comp.time;

                obj[prefix + '_date'] = s_date.toDateString();
                obj[prefix + '_time'] = s_time.toString();
            };

            compile = function(data) {
                normalizeRooms(data.room_types, data.rooms);
                normalizeOccupancies(data.room_types, data.occupancy);
                linkRooms(data.rooms, data.occupancy);
            };

            var GUID = function(pre, ids) {
                return _.constant([_.uniqueId(pre + '_'), '-', ids.join('-')]);
            };

            return {
                set: function(field, value) {
                    store[field] = value;

                    return this;
                },
                get: function(field) {
                    return store[field];
                },
                change_set: function(field, value) {

                },
                payload: function() {
                    return store;
                },
                transform: function(payload, filterData) {
                    compile(_.extend(store, util.mixin.apply(null, slice.call(arguments))));
                },
                mergeAvailableSlots: function(start_date, end_date, guid, rate_id, slot) {
                    return normalizeAvailableOccupancy(start_date, end_date, rate_id, guid, slot);
                },
                mergeOccupancies: function(occupancies) {
                    mergeOccupanciesInASCTime(occupancies);
                }
            };
  }

 ]);
