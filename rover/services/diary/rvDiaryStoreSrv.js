sntRover
	.factory('rvDiaryStoreSrv', ['rvDiaryUtilSrv',
		function(util) {
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
				normalizeOuccpancy,
				normalizeAvailableOccupancy,
				normalizeTime,
				normalizeMaintenanceInterval,
				linkRooms,
				formatIncomingTimeData;

			normalizeRooms = function(room_types, rooms) {
				var normalize = _.partial(normalizeRoom, room_types);

				rooms.forEach(function(room) {
					rooms = normalize(room);
				});
			};

			normalizeRoom = function(room_types, room) {
				var rt = _.findWhere(room_types, {
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
				occupancy[m.maintenance] = normalizeMaintenanceInterval(room_type.departure_cleanning_time, 15);

				occupancy[m.room_type] = util.mixin(occupancy[m.room_type], room_type); //room_type.name;
			};

			/*function Occupancy(params) {
				if(!(this instanceof Occupancy)) {
					return new Occupancy(params);
				}

				this.reservation_id;
				this.reservation_status
				this.room_id;
				this.room_type_id;
				this.room_service_status;
				this.rate_id;
				this.rate_total;
				this.arrival_date;
				this.departure_date;

				this.setArrival(start_date) {
					formatIncomingTimeData(slot, start_date, 'arrival');
				};

				this.setDeparture(end_Date) {
					formatIncomingTimeData(slot, end_date, 'departure');
				}
			}*/

			normalizeAvailableOccupancy = function(start_date, end_date, rate_id, gen_uid, slot) {
				var rooms = store.rooms;

				room = _.findWhere(rooms, {
					id: slot.id
				});

				if (room) {
					slot.temporary = true;
					slot.room_id 			= room.id;
					slot.room_type_id 		= room.room_type_id;
					slot.reservation_status = 'available';
					slot.room_service_status = '';
					slot.reservation_id 	= gen_uid;
					slot.rate_id 			= rate_id;
					slot.rate_total 		= slot.amount;

					formatIncomingTimeData(slot, start_date, 'arrival');
					formatIncomingTimeData(slot, end_date, 'departure');

					if (has.call(room, 'occupancy')) {
						room.occupancy = slice.call(room.occupancy).concat([slot]);
					} else {
						room.occupancy = [slot];
					}

					normalizeOccupanices(room_types, room.occupancy);
				}
			};

			normalizeTime = function(date, time) {
				var std = (time.indexOf('am') > -1 || time.indexOf('pm') > -1),
					t_a = time.slice(0, -3),
					t_b = time.slice(-2);

				return Date.parse(date + ' ' + (std ? t_a + ' ' + t_b : time));
			};

			normalizeMaintenanceInterval = function(time, base_interval) {
				var t_a = +time.slice(0, -3),
					t_b = +time.slice(-2),
					intervals = t_b / base_interval,
					intervals_per_hr = 60 / base_interval;

				return intervals_per_hr * t_a + parseInt(intervals);
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
					return _.constant([_.uniqueId(pre + '_') , '-', ids.join('-')]);
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
				mergeAvailableSlots: function(start_date, end_date, guid, rate_id) {
					normalizeAvailableOccupancy(start_date, end_date, guid, rate_id);
				}
			};
		}

	]);