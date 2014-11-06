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
    	var meta = rvDiaryMetadata;

    	/*INITIALIZE CONFIGURATION FOR API CALLS*/
    	(function() { 
    		var defaults = function(url, type) {
    			var define = function(val) {
	    			return {
	    				enumerable: true,
	    				value: val
	    			};
	    		};

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
    		};

	    	this.api_types = Object.create(null, {
	    		availability: 		defaults('api/hourly_availability', 'data'),
	    		availability_count: defaults('api/hourly_availability', 'count'),
	    		occupancy: 			defaults('api/hourly_occupancy', 'data')
	    	});
    	}).call(this);
    	/*INITIALIZE CONFIGURATION FOR API CALLS*/

	 	function deepCopy(obj) {
			var hops = Object.prototype.hasOwnProperty,
				slice = Array.prototype.slice,
				newRes = {};

				for(var k in  obj) {
					if(hops.call(obj, k)) {
						if(obj[k] instanceof Date) {
							newRes[k] = new Date(obj[k].getTime());
						} else if(_.isArray(obj[k])) {
							newRes[k] = copyArray(obj[k]);
							/*(function() { 
								var arr = [];

								newRes[k].forEach(function(item, idx) {
									arr.push(deepCopy(item));
								});

								newRes[k] = slice.call(arr);
							})();*/
						} else if(_.isObject(obj[k])) {
							newRes[k] = deepCopy(obj[k]);
						} else {
							newRes[k] = obj[k];
						}
					}
				}

			return newRes;
		}

		function copyArray(src, dest){
    		var cur;

    		dest = [];

    		for(var i = 0, len = src.length; i < len; i++) {
    			cur = src[i];
    			dest.push(deepCopy(cur));
    		}

    		return dest;
    	};

    	this.createIndex = function(index, payload) {
    		var collection = payload,
    			len = collection.length;

    			index = index || Object.create(null);

    		for(i = 0; i < len; ++i) {
    			index[collection[i].id] = deepCopy(collection[i]);
    		}
    	};

		this.normalizeOccupancy = function(room_types, occupancy) {
    		var m = meta.occupancy, 
				room_type = _.findWhere(room_types, { id: occupancy.room_type_id }) 

			occupancy.key 				= _.uniqueId('oc-' + occupancy[meta.occupancy.id] + '-');
			occupancy[m.start_date] 	= this.normalizeTime(occupancy.arrival_date, occupancy.arrival_time);
		    occupancy[m.end_date] 	    = this.normalizeTime(occupancy.departure_date, occupancy.departure_time);
		    occupancy[m.maintenance] 	= this.normalizeMaintenanceInterval(room_type.departure_cleanning_time, 15);
		    occupancy[m.room_type] 		= room_type.name;
    	};

    	this.normalizeOccupanices = function(room_types, occupancies) {
    		var occupancy;

    		for(var i = 0, len = occupancies.length; i < len; i++) {
    			occupancy = occupancies[i];
    			this.normalizeOccupancy(room_types, occupancy);
    		}
    	};

    	this.normalizeRooms = function(rooms, room_types) {
    		for(var i = 0, len = rooms.length; i < len; i++) {
    			rooms[i] = this.normalizeRoom(rooms[i], room_types);
    		}
    	};

    	this.normalizeRoom = function(room, room_types) {
    		var rt = _.findWhere(room_types, { id: room.room_type_id }); 

    		room.key 	   = _.uniqueId('rm-' + room[meta.room.id] + '-');	
			room.room_type = (rt ? rt.name : '');
 			
			if(!Object.prototype.hasOwnProperty.call(room, 'occupancy')) {
				Object.defineProperty(room, 'occupancy', {
					enumerable: true,
					configurable: true,
					writable: true,
					value: []
				});
			}	

			return room;		
    	};

    	this.normalizeMaintenanceInterval = function(time, base_interval) {
    		var t_a = time.slice(0, -3),
    			t_b = time.slice(-2),
    			intervals = parseInt(t_b, 10) / base_interval,
    			intervals_per_hr = 60 / base_interval;

    		return intervals_per_hr * t_a + parseInt(intervals);
    	};

    	this.normalizeTime = function(date, time) {
    		var std = (time.indexOf('am') > -1 || time.indexOf('pm') > -1),
    			t_a = time.slice(0, -3),
    			t_b = time.slice(-2);

    		return Date.parse(date + ' ' + (std ? t_a + ' ' + t_b : time));
    	};

    	this.linkRooms = function(rooms, occupancies) {
    		occupancies.forEach(function(occupancy, idx) {
    			var room = _.findWhere(rooms, { id: occupancy.room_id });

    			if(room){
    				if(!_.findWhere(room.occupancy, { reservation_id: occupancy.reservation_id })) {
    					room.occupancy.push(occupancy);
    					console.log(room.id + ' ' + occupancy);
    				}
    			}
    		});

    		return rooms;
    	};

    	this.init = function(start_date, end_date) {
			var self = this, 
				q=  $q.defer(), 
				slice = Array.prototype.slice,
				room_types,
				rooms,
				occupancy;

			start_date.setHours(0,0,0,0);

			this.fetchData(start_date, end_date, this.api_types.occupancy)
			.then(function(data) {
				
				room_types = copyArray(data.room_types, room_types);

				room_types.unshift({ id: 'All', name: 'All', description: 'All' });
			
				rooms = copyArray(data.rooms, rooms);

				self.normalizeRooms(rooms, room_types);		

				occupancy = copyArray(data.occupancy);

				self.normalizeOccupanices(room_types, occupancy);
		
				console.log(self.linkRooms(rooms, occupancy));

				q.resolve({
					start_date: start_date,
					rooms: 		rooms,
					occupancy: 	occupancy,
					room_types: room_types
				});
			}, function(err) {
				q.reject(err);
			});

    		return q.promise;
    	};

    	this.fetchOccupancy = function(start_date, end_date) {
    		var self = this, 
    			q=  $q.defer(),
    			occupancy;

			this.fetchData(start_date, end_date, this.api_types.occupancy)
			.then(function(data) {
				occupancy = deepCopy(data.occupancy);

				//self.createIndex(index.occupancy, occupancy);

				//self.normalizeTimeSlots(self.rooms, self.room_types, occupancy);

				q.resolve(occupancy);
			}, function(err) {
				q.reject(err);
			});

    		return q.promise;
    	};

    	this.injectAvailability = function(start_date, end_date, rate_id, room_type_id) {
    		var q = $q.defer();

    		this.fetchAvailability.apply(this, Array.prototype.slice.call(arguments))
    		.then(function(data) {
    			console.log('AVAILABILITY CONTENTS', data);
    		});
    	};

    	this.fetchAvailability = function(start_date, end_date, rate_id, room_type_id) {
    		var self = this, 
    			q = $q.defer(), 
    			availability = [],
    			gen_uid = _.uniqueId('available-');

			this.fetchData(start_date, end_date, self.api_types.availability, rate_id, room_type_id)
			.then(function(payload) {
		   		var data 	= payload.results[0].availability,
		   			st  	= start_date.toComponents().time,
		   			et  	= end_date.toComponents().time,
		   			sd      = start_date.toComponents().date,
		   			ed 		= end_date.toComponents().date,
		   			availability = [],
		   			slot, room;

		   		if(_.isArray(data)) {
			   		for(var i = 0, len = data.length; i < len; i++) {
						slot = deepCopy(data[i]);
			   			room = _.findWhere(self.rooms, { id: slot.room_id });
			   			
			   			if(room) {
				   			slot.temporary 				= true;
				   			slot.room_id 				= slot.room_id;
				   			slot.arrival_date 			= sd.toDateString();
				   			slot.arrival_time 			= st.toString();
				   			slot.departure_date 		= ed.toDateString();
				   			slot.departure_time 		= et.toString();
				   			slot.reservatopm_status 	= 'available';
				   			slot.room_service_status 	= '';
				   			slot.reservation_id 		= gen_uid;
				   			slot.key 					= _.uniqueId('post_') + '-' + slot.id + '-' + data[i].id;

				   			if(Object.prototype.hasOwnProperty.call(room, 'occupancy')) {
				   				room.occupancy = Array.prototype.slice.call(room.occupancy).concat([slot]);
				   			} else {
				   				room.occupancy = [];
				   				room.occupancy.concat([slot]);
				   			}

				   			self.normalizeOccupanices(self.room_types, room.occupancy);
				   		}
			   		}		   		
			   		//self.normalizeTimeSlots(self.rooms, self.room_types, availability);
			   		//console.log(self.linkRooms(self.rooms, Array.prototype.slice.call(availability)));
			   	}

			   	q.resolve({ row_data: self.rooms[0], row_item_data: self.rooms[0].occupancy[0] });
		   }, function(err) {
		   		q.reject(err);
		   });
			//});
			return q.promise;
    	};

    	this.fetchAvailabilityCount = function(start_date, end_date) {
    		var self = this, q = $q.defer();

			this.fetchData(start_date, end_date, this.api_types.availability_count)
		   	.then(function(data) {
		   		availability_count = copyArray(availability_count, data);
		   		
		   		q.resolve(availability_count);	   	
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
					end_time: 	end_time.hours + ':' + (end_time.minutes < 10 ? '0' + end_time.minutes : end_time.minutes),
					begin_date: begin.shift() + '-' + begin.reverse().join('-'),
					end_date: 	end.shift() + '-' + end.reverse().join('-'),
					type: 		type_config.type		
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

        this.set = function (field, value) {
    		if(!Object.prototype.hasOwnProperty.call(this, field)) {
    			this[field] = value;
    		}
    	};
}]);
