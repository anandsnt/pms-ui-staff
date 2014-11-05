sntRover
.constant('rvDiaryConstants', { 
	TIME_SPAN_SEEK: 48 * 86400000, 
	SEEK_OFFSET: -7200,
	RESERVATION_API: 'api/hourly_availability' })
.constant('rvDiaryMetadata', {
	room: {
		id: 'id',
		number: 'room_no',
		type: 'room_type',
		type_id: 'room_type_id',
		row_children: 'occupancy'
	},
	occupancy: {
		id: 'reservation_id',
		room_id: 'room_id',
		room_type: 'room_type',
		status: 'reservatopm_status',
		guest: 'reservation_primary_guest_full_name',
		start_date: 'arrival',
		end_date: 'departure',
		maintenance: 'maintenance',
		rate: 'amount'
	},
	availability: {
		room_id: 'id',
		price: 'amount',
		rate_type_id: 'rate_type_id'
	}
})
.service('rvDiarySrv', ['$q', 'RVBaseWebSrv', 'rvBaseWebSrvV2', 'rvDiaryConstants', 'rvDiaryMetadata', 
    function ($q, RVBaseWebSrv, rvBaseWebSrvV2, rvDiaryConstants, rvDiaryMetadata) {
    	var meta = rvDiaryMetadata,
    		store,
    		data,
    		DS = Object.create(null, { attr: { enumerable: true, value: function(val) { return { enumerable: true, writable: true, value: val }; }}});

    	this.start_date = undefined;

    	(function(index_prop_name) { 
    		var define = function(val) {
    				return {
    					enumerable: true,
    					writable: true,
    					value: val
    				};
    			};

	    	this[index_prop_name] = Object.create(null, {
	    		rooms: 			define(Object.create(null)),
	    		room_types: 	define(Object.create(null)),
	    		occupancies: 	define(Object.create(null))
	    	});
    	}).call(this, 'store');

    	this.api_types 			= undefined;
		this.availability_count = [];
    	this.availability 		= [];
    	this.occupancy 			= [];
    	this.rooms 				= [];
    	this.room_types 		= [];

    	(function() { 
    		function defaults(url, type) {
    			function define(val) {
	    			return {
	    				enumerable: true,
	    				value: val
	    			};
	    		}
    			return { 
    				value: Object.create(null, {
		    			url: {
		    				enumerable: true,
		    				value: url
		    			},
		    			type: {
		    				enumerable: true,
		    				value: type
		    			} 
		    		})
    			};
    		}

	    	this.api_types = Object.create(null, {
	    		availability: 		defaults('api/hourly_availability', 'data'),
	    		availability_count: defaults('api/hourly_availability', 'count'),
	    		occupancy: 			defaults('api/hourly_occupancy', 'data')
	    	});
    	}).call(this);

    	this.createIndex = function(payload, prop_name, index_prop_name) {
    		var collection = payload[prop_name],
    			i = 0,
    			len = collection.length,
    			idx = this.store[index_prop_name] = Object.create(null);

    		for(; i < len; ++i) {
    			idx[collection[i].id] = collection[i];
    		}
    	};

    	this.normalizeTimeSlots = function(time_slots, extra_params) {
    		var rooms 			= this.rooms,
    			room_types 		= this.room_types,
    			isAvailability 	= (_.isArray(time_slots) && time_slots.length > 0 ? time_slots[0].temporary : false),
    			children 		= meta.room.row_children,
    			slot_id 		= meta.occupancy.id,
    			room,
    			slot,
    			findParams = {},
    			index = this.store;

    		findParams[slot_id] = undefined;

    		if(time_slots.length > 0) {
	    		for(var i = 0, len = time_slots.length; i < len; i++) {
	    			slot = time_slots[i];

	    			room = index.rooms[slot.room_id];

	    			findParams[slot_id] =slot[slot_id];

    				if(!_.findWhere(room[children], findParams)) {
	    				this.normalizeOccupancy(room, slot);

	    				room[children].push(slot);
	    			}		
	    		}
			}
    	};

    	this.normalizeRooms = _.once(function(rooms) {
    		var index = this.store;

    		if(!Object.prototype.hasOwnProperty.call('__ready')) {
	    		for(var i = 0, len = rooms.length; i < len; i++) {
	    			this.normalizeRoom(rooms[i], index);
	    		}

	    		Object.defineProperty(rooms, '__ready', { value: true });
	    	}
    	});

    	this.normalizeRoom = function(room) {		
			room.room_type = this.store.room_types[room.room_type_id].name;
		    			
			if(!room[meta.room.row_children]) {
				room[meta.room.row_children] = [];
			}			
    	};

    	this.normalizeOccupancy = function(room, occupancy) {
    		var meta = rvDiaryMetadata.occupancy, room_type = this.store.room_types[room.room_type_id];

    		if(!Object.prototype.hasOwnProperty.call(occupancy, '__ready')) {
				occupancy[meta.start_date] 		= this.normalizeTime(occupancy.arrival_date, occupancy.arrival_time);
			    occupancy[meta.end_date] 	    = this.normalizeTime(occupancy.departure_date, occupancy.departure_time);
			    occupancy[meta.maintenance] 	= this.normalizeMaintenanceInterval(room_type.departure_cleanning_time, 15);

			    Object.defineProperty(occupancy, '__ready', { value: true });
			}
    	};

    	this.normalizeMaintenanceInterval = function(time, base_interval) {
    		var t_a = time.slice(0, -3),
    			t_b = time.slice(-2),
    			intervals = 60 / base_interval;

    		return intervals * t_a + parseInt(intervals);
    	};

    	this.normalizeTime = function(date, time) {
    		var std = (time.indexOf('am') > -1 || time.indexOf('pm') > -1),
    			t_a = time.slice(0, -1),
    			t_b = time.slice(-1);

    		return Date.parse(date + ' ' + (std ? t_a + ' ' + t_b : time));
    	};

    	this.chompPast = function(cutoff_date) {
    		var to_splice = [],
    			cur_room,
    			cur_occupancy;

    		for(var i = 0, len = this.rooms.length; i < len; i++) {
    			cur_room = this.rooms[i];
    			cur_occupancy = cur_room[meta.room.row_children];

    			for(var j = 0, jlen = cur_occupancy.length; j < jlen; j++) {
    				if(cur_occupancy[j].arrival < start_date) {
    					to_splice.push(j);
    				}
    			}
    			while(to_splice.length > 0) {
    				cur_occupancy[j].splice(to_splice.pop());
    			}
    		}
    	};

    	this.merge = function(room, incomingData) {
    		var r = this.store.rooms[room[meta.room.id]];

    		r = rvDiaryUtilSrv.copyRoom(room);

    		r[meta.room.row_children] = _.union(r[meta.room.row_children], incomingData);
    	};
    	
    	this.init = function(start_date, end_date) {
			var self = this, q=  $q.defer();

    		this.start_date = start_date;

			this.fetchData(start_date, end_date, self.api_types.occupancy)
			.then(function(data) {
				if(self.room_types.length === 0) {
					self.room_types = data.room_types;
					self.room_types.unshift({ id: 'All', name: 'All', description: 'All' });
					self.createIndex(data, 'room_types', 'room_types');
				}

				if(self.rooms.length === 0) {
					self.rooms = data.rooms;
					self.createIndex(data, 'rooms', 'rooms');
					self.normalizeRooms(self.rooms, self.store, self.store);
				}

				self.occupancy = _.union(self.occupancy, data.occupancy);
				self.createIndex(data, 'occupancy', 'occupancy');

				self.normalizeTimeSlots(self.occupancy);

				q.resolve({
					data: self.rooms
				});
			}, function(err) {
				q.reject(err);
			});

    		return q.promise;
    	};

    	this.fetchOccupancy = function(start_date, end_date) {
    		var self = this, q=  $q.defer();

			this.fetchData(start_date, end_date, self.api_types.occupancy)
			.then(function(data) {
				self.occupancy = _.union(self.occupancy, data.occupancy);

				self.createIndex(data, 'occupancy', 'occupancy');

				self.normalizeTimeSlots(data.occupancy);

				q.resolve({
					data: self.rooms
				});
			}, function(err) {
				q.reject(err);
			});

    		return q.promise;
    	};

    	this.fetchAvailability = function(start_date, end_date, rate_id, room_type_id) {
    		var self = this, q = $q.defer(), gen_uid = _.uniqueId('available-');

			this.fetchData(start_date, end_date, self.api_types.availability, rate_id, room_type_id)
			.then(function(payload) {
		   		var data 	= payload.results[0].availability,
		   			start 	= start_date.toComponents().time,
		   			end 	= end_date.toComponents().time,
		   			available_slots = [],
		   			slot;

		   		if(_.isArray(data)) {
			   		for(var i = 0, len = data.length; i < len; i++) {
			   			slot = _.extend({}, data[i]);

			   			slot.temporary 				= true;
			   			slot.room_id 				= slot.id;
			   			slot.arrival_date 			= start_date.toLocaleDateString();
			   			slot.arrival_time 			= start.hours + ':' + (start.minutes < 10 ? '0' : '') + start.minutes;
			   			slot.departure_date 		= end_date.toLocaleDateString();
			   			slot.departure_time 		= end.hours + ':' + (end.minutes < 10 ? '0' : '') + end.minutes;
			   			slot.reservatopm_status 	= 'available';
			   			slot.room_service_status 	= '';
			   			slot.reservation_id 		= gen_uid;
			   			slot.key 					= _.uniqueId('post_') + '-' + slot.id + '-' + data[i].id;

			   			delete slot.id;

			   			available_slots.push(slot);
			   		}

			   		self.availability = Array.prototype.slice.call(available_slots);

			   		self.normalizeTimeSlots(self.availability);
			   	}

			   	q.resolve({
		   			data: self.rooms,
		   			availability: self.availability		
		   		});
		   }, function(err) {
		   		q.reject(err);
		   });
			//});
			return q.promise;
    	};

    	this.fetchAvailabilityCount = function(start_date, end_date) {
    		var self = this, q = $q.defer();

			this.fetchData(start_date, end_date, self.api_types.availability_count)
		   	.then(function(data) {
		   		self.availability_count = data;
		   		
		   		q.resolve(self.availability_count);	   	
		   	}, function(err) {
		   		q.reject(err);
		   	});
    		
			return q.promise;
    	};

        this.fetchData = function (start_date, end_date, type_config, rate_id, room_type_id) {
            var deferred = $q.defer (),
            	start_time = start_date.toComponents().time,
            	end_time = end_date.toComponents().time,
            	begin = start_date.toLocaleDateString().replace(/\//g, '-').split('-').reverse(),
            	end = end_date.toLocaleDateString().replace(/\//g, '-').split('-').reverse(),
            	dto = { 
            		begin_time: start_time.hours + ':' + (start_time.minutes < 10 ? '0' + start_time.minutes : start_time.minutes),
					end_time: end_time.hours + ':' + (end_time.minutes < 10 ? '0' + end_time.minutes : end_time.minutes),
					begin_date: begin.shift() + '-' + begin.reverse().join('-'),
					end_date: end.shift() + '-' + end.reverse().join('-'),
					type: type_config.type		
            	};

            if(rate_id) {
            	dto.rate_id = rate_id;				
            }

            if(room_type_id) {
            	dto.room_type_id = room_type_id;
            }

			rvBaseWebSrvV2.getJSON(type_config.url, dto)
			.then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});

            return deferred.promise;
        };
}]);
