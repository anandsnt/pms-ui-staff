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
		maintenance: 'maintenance'
	}
})
.service('rvDiarySrv', ['$q', 'RVBaseWebSrv', 'rvBaseWebSrvV2', 'rvDiaryConstants', 'rvDiaryMetadata', 
    function ($q, RVBaseWebSrv, rvBaseWebSrvV2, rvDiaryConstants, rvDiaryMetadata) {

    	this.start_date = undefined;

    	this.meta = rvDiaryMetadata;

    	this.store = Object.create(null, {
    		rooms: {
    			enumerable: true,
    			writable:true,
    			value: Object.create(null)
    		},
    		room_types: {
    			enumerable: true,
    			writable: true,
    			value: Object.create(null)
    		},
    		occupancies: {
    			enumerable: true,
    			writable: true,
    			value: Object.create(null)
    		}
    	});

    	(function() { 
    		function defaults(url, type) {
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
	    		availability: defaults('api/hourly_availability', 'data'),
	    		availability_count: defaults('api/hourly_availability', 'count'),
	    		occupancy: defaults('api/hourly_occupancy', 'data')
	    	});
    	}).call(this);

    	this.availability_count = [];
    	this.availability = [];
    	this.occupancy = [];
    	this.rooms = [];
    	this.room_types = [];

    	/*function Model(params) {
    		if(!(this instanceof Model)) {
    			return new Model(params);
    		}

    		_.extend(this, params);
    	}

    	Model.prototype = {
    		constructor: Model,
    		normalize: function() {
    			return;
    		},
    		copy: function() {
    			return _.extend({}, this);
    		}
    	};

    	function Collection() {
    		if(!(this instanceof Collection)) {
    			return new Collection(arguments);
    		}

    		Array.call(this, Array.prototype.slice.call(arguments));
    	}
    	Collection.prototype = Object.create(Array.prototype);
    	Collection.prototype.constructor = Collection;

    	function Rooms(arr) {
    		Collection.call(this, arr);
    	}

    	Rooms.prototype = Object.create(Collection.prototype);
    	Rooms.prototype.constructor = Rooms;

    	function Room(params) {
    		Model.call(this, params);
    	}

    	Room.prototype = Object.create(Model.prototype);
    	Room.prototype.constructor = Room;
    	Room.prototype.meta = rvDiaryMetadata.room;
    	Room.prototype.normalize = function(index) {
    		room.room_type = index.room_types[room.room_type_id].name;
		    			
			if(!room[this.meta.row_children]) {
				room[this.meta.row_children] = [];
			}	
    	};
    	Room.prototype.copy = function() {
			var rc_meta = this.meta.row_children,
				newRoom = {}, 
				resLen = (_.isArray(this[rc_meta]) ? this[rc_meta].length : 0);

			_.extend(newRoom, this);

			newRoom[rc_meta] = [];

			for(var i = 0; i < resLen; i++) {
				newRoom[rc_meta].push(copyReservation(room[rc_meta][i]));
			}

			return newRoom;
    	};
    	Room.prototype.insertOccupancy = function(occupancy) {
    		var new_children = [], cur_children = this[this.meta.row_children];

    		for(var i = 0, len = cur_children.length; i < len; i++) {
    			if(cur_children[i][this.meta.start_date] > occupancy[this.meta.start_date]) {
    				new_children.push(occupancy);
    			}

    			new_children.push(cur_children[i]);
    		}

    		this[this.meta.row_children] = new_children;
    	};

    	function Occupancy(params) {
    		Model.call(this, params);
    	}
    	Occupancy.prototype = Object.create(Model);
    	Occupancy.prototype.constructor = Occupancy;
    	Occupancy.prototype.meta = rvDiaryMetadata.occupancy;
    	Occupancy.prototype.normalize = function() {
			var meta = this.meta;

			this[meta.start_date] 	= this.normalizeTime(occupancy.arrival_date, occupancy.arrival_time);
			this[meta.start_date] 	= this.normalizeTime(occupancy.departure_date, occupancy.departure_time);
			this[meta.maintenance] 	= this.normalizeMaintenanceInterval(room.departure_cleaning_time);
    	};
    	Occupancy.prototype.copy = function() {
    		
    	};
    	Occupancy.prototype.normalizeTime = function(time, date) {
    		var t_a = time.slice(0, -1),
    			t_b = time.slice(-1);

    		return Date.parse(date + ' ' + t_a + ' ' + t_b);
    	};
    	Occupancy.prototype.normalizeMaintenanceInterval = function(time, base_interval) {
    		var t_a = time.slice(0, -2),
    			t_b = time.slice(-3),
    			intervals = 60 / base_interval;

    		return intervals * t_a + parseInt(60 / base_interval);
    	};*/

    	this.createIndex = function(payload, prop_name, index_prop_name) {
    		var collection = payload[prop_name],
    			i = 0,
    			len = collection.length,
    			idx = this.store[index_prop_name] = Object.create(null);

    		for(; i < len; ++i) {
    			idx[collection[i].id] = collection[i];
    		}
    	};

    	this.normalizeTimeSlots = function(time_slots, extra_params, index) {
    		var rooms = this.rooms,
    			room_types = this.room_types,
    			children = rvDiaryMetadata.room.row_children,
    			slot_id = rvDiaryMetadata.occupancy.id,
    			room,
    			slot,
    			findParams = {};

    		findParams[slot_id] = undefined;

    		if(time_slots.length > 0) {
	    		for(var i = 0, len = time_slots.length; i < len; i++) {
	    			slot = time_slots[i];
	    			room = index.rooms[slot[room_id]];
	    			findParams[slot_id] =slot[slot_id];

    				if(!_.findWhere(room[children], findParams)) {
	    				this.normalizeOccupancy(room, slot);

	    				room[children].push(slot);
	    			}		
	    		}
			}
    	};

    	this.normalizeRooms = function(rooms, index) {
    		if(!Object.prototype.hasOwnProperty.call('__ready')) {
	    		for(var i = 0, len = rooms.length; i < len; i++) {
	    			this.normalizeRoom(rooms[i], index);
	    		}

	    		Object.defineProperty(rooms, '__ready', { value: true });
	    	}
    	};

    	this.normalizeRoom = function(room, index) {		
			room.room_type = index.room_types[room.room_type_id].name;
		    			
			if(!room[rvDiaryMetadata.room.row_children]) {
				room[rvDiaryMetadata.room.row_children] = [];
			}			
    	};

    	this.normalizeOccupancy = function(room, occupancy) {
    		if(!Object.prototype.hasOwnProperty.call(occupancy, '__ready')) {
				occupancy[rvDiaryMetadata.occupancy.start_date] 	= this.normalizeTime(occupancy.arrival_date, occupancy.arrival_time);
			    occupancy[rvDiaryMetadata.occupancy.end_date] 	    = this.normalizeTime(occupancy.departure_date, occupancy.departure_time);
			    occupancy[rvDiaryMetadata.occupancy.maintenance] 	= this.normalizeMaintenanceInterval(room.departure_cleaning_time);

			    Object.defineProperty(occupancy, '__ready', { value: true });
			}
    	};

    	this.normalizeMaintenanceInterval = function(time, base_interval) {
    		var t_a = time.slice(0, -2),
    			t_b = time.slice(-3),
    			intervals = 60 / base_interval;

    		return intervals * t_a + parseInt(60 / base_interval);
    	};

    	this.normalizeTime = function(date, time) {
    		var t_a = time.slice(0, -1),
    			t_b = time.slice(-1);

    		return Date.parse(date + ' ' + t_a + ' ' + t_b);
    	};

    	this.merge = function(room, incomingData) {
    		var r = this.store.rooms[room[rvDiaryMetadata.room.id]];

    		r = rvDiaryUtilSrv.copyRoom(room);

    		r[rvDiaryMetadata.room.row_children] = _.union(r[rvDiaryMetadata.room.row_children], incomingData);
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

				self.normalizeTimeSlots(self.occupancy, self.store);

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

				self.normalizeTimeSlots(self.occupancy, self.store);

				q.resolve({
					data: self.rooms
				});
			}, function(err) {
				q.reject(err);
			});

    		return q.promise;
    	};

    	this.fetchAvailability = function(start_date, end_date, rate_id, room_type_id) {
    		var self = this, q = $q.defer();

			this.fetchData(start_date, end_date, self.api_types.availability, rate_id, room_type_id)
			.then(function(payload) {
		   		var data = payload.results;

		   		if(_.isArray(data)) {
			   		for(var i = 0, len = data.length; i < len; i++) {
			   			data[i].temporary = true;
			   		}

			   		self.availability = data;

			   		self.normalize(self.availability);
			   	}

			   	q.resolve({
		   			data: self.rooms  			
		   		});
		   }, function(err) {
		   		q.reject(err);
		   });
			//});
			return q.promise;
    	};

    	this.fetchAvailabilityCount = function(start_date, end_date) {
    		var self = this, q = $q.defer();

			this.fetchData(start_date, end_date, 1, Object.keys(self.store.room_types), self.api_types.availability_count)
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
