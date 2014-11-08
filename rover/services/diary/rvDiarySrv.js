sntRover
.service('rvDiarySrv', ['$q', 
						'RVBaseWebSrv', 
						'rvBaseWebSrvV2',  
						'rvDiaryMetadata', 
						'rvDiaryUtilSrv',
    function ($q, 
    		  RVBaseWebSrv, 
    		  rvBaseWebSrvV2,  
    		  rvDiaryMetadata, 
    		  rvDiaryUtilSrv) {
    	var meta 	= rvDiaryMetadata,
    		hops 	= Object.prototype.hasOwnProperty,
    		slice 	= Array.prototype.slice,
    		define 	= Object.defineProperty,
    		util 	= rvDiaryUtilSrv;

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

		this.normalizeOccupancy = function(room_types, occupancy) {
    		var m = meta.occupancy, 
				room_type = _.findWhere(room_types, { id: occupancy.room_type_id }); 

			occupancy.key 				= _.uniqueId('oc-' + occupancy[meta.occupancy.id] + '-');

			occupancy[m.start_date] 	= this.normalizeTime(occupancy.arrival_date, 
															 occupancy.arrival_time);
		    occupancy[m.end_date] 	    = this.normalizeTime(occupancy.departure_date, 
		    											     occupancy.departure_time);
		    occupancy[m.maintenance] 	= this.normalizeMaintenanceInterval(room_type.departure_cleanning_time, 15);

		    occupancy[m.room_type] 		= room_type.name;
    	};

    	this.normalizeOccupanices = function(room_types, occupancies) {
    		for(var i = 0, len = occupancies.length; i < len; i++) {
    			this.normalizeOccupancy(room_types, occupancies[i]);
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
 			
			if(!hops.call(room, 'occupancy')) {
				define(room, 'occupancy', {
					enumerable: true,
					configurable: true,
					writable: true,
					value: []
				});
			}	

			return room;		
    	};

    	this.normalizeMaintenanceInterval = function(time, base_interval) {
    		var t_a = +time.slice(0, -3),
    			t_b = +time.slice(-2),
    			intervals = t_b / base_interval,
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
				
				room_types = util.copyArray(data.room_types, room_types);

				room_types.unshift({ id: 'All', name: 'All', description: 'All' });
			
				rooms = util.copyArray(data.rooms, rooms);

				self.normalizeRooms(rooms, room_types);		

				occupancy = util.copyArray(data.occupancy);

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
    			q=  $q.defer();

			this.fetchData(start_date, end_date, this.api_types.occupancy)
			.then(function(data) {
				q.resolve(util.deepCopy(data.occupancy));
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
		   		var data 	= payload.results[0].availability;
		   			

		   		if(_.isArray(data)) {
			   		for(var i = 0, len = data.length; i < len; i++) {
						self.normalizeAvailableOccupancy(gen_uid, self.rooms, self.room_types, util.deepCopy(data[i]), start_date, end_date, rate_id);
			   		}		
			   	}

			   	q.resolve({ row_data: self.rooms[0], row_item_data: self.rooms[0].occupancy[0] });
		   }, function(err) {
		   		q.reject(err);
		   });

			return q.promise;
    	};

    	this.formatIncomingTimeData = function(obj, date, prefix) {
    		var comp    = date.toComponents(),
    			s_date  = comp.date,
		   		s_time  = comp.time;

		   	obj[prefix + '_date'] = s_date.toDateString();
		   	obj[prefix + '_time'] = s_time.toString();
    	};

    	this.normalizeAvailableOccupancy = function(gen_uid, rooms, room_types, slot, start_date, end_date, rate_id) {
   			room = _.findWhere(rooms, { id: slot.id });
   			
   			if(room) {
	   			slot.temporary 				= true;
	   			slot.room_id 				= slot.id;
	   			slot.reservatopm_status 	= 'available';
	   			slot.room_service_status 	= '';
	   			slot.reservation_id 		= gen_uid;
	   			this.formatIncomingTimeData(slot, start_date, 'arrival');
	   			this.formatIncomingTimeData(slot, end_date, 'departure');
	   			slot.rate_id = rate_id;
	   			
	   			if(Object.prototype.hasOwnProperty.call(room, 'occupancy')) {
	   				room.occupancy = Array.prototype.slice.call(room.occupancy).concat([slot]);
	   			} else {
	   				room.occupancy = [];
	   				room.occupancy.concat([slot]);
	   			}

	   			this.normalizeOccupanices(room_types, room.occupancy);
	   		}
    	};

    	this.fetchAvailabilityCount = function(start_date, end_date) {
    		var self = this, 
    			q = $q.defer();

			this.fetchData(start_date, end_date, this.api_types.availability_count)
		   	.then(function(data) {		   		
		   		q.resolve(copyArray(availability_count, data));	   	
		   	}, function(err) {
		   		q.reject(err);
		   	});
    		
			return q.promise;
    	};

        this.fetchData = function (start_date, end_date, type_config, rate_id, room_type_id) {
            var deferred 	= $q.defer (),
            	s_comp  	= start_date.toComponents(),
            	e_comp 	    = end_date.toComponents(),
            	//begin 		= s_comp.date.toDateString(), //start_date.toLocaleDateString().replace(/\//g, '-').split('-').reverse(),
            	//end 		= e_comp.date.toDateString(), //end_date.toLocaleDateString().replace(/\//g, '-').split('-').reverse(),
            	dto = { 
            		begin_time: s_comp.time.toString(), //start_time.hours + ':' + (start_time.minutes < 10 ? '0' + start_time.minutes : start_time.minutes),
					end_time: 	e_comp.time.toString(), //end_time.hours + ':' + (end_time.minutes < 10 ? '0' + end_time.minutes : end_time.minutes),
					begin_date: s_comp.date.toDateString(), //begin.shift() + '-' + begin.reverse().join('-'),
					end_date: 	e_comp.date.toDateString(), //end.shift() + '-' + end.reverse().join('-'),
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
