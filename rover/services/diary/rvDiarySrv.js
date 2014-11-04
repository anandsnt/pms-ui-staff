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
		row_children: 'occupancies'
	},
	occupancy: {
		id: 'reservation_id',
		room_id: 'rppm_id',
		room_type: 'room_type',
		status: 'reservatopm_status',
		guest: 'reservation_primary_guest_full_name',
		start_date: 'arrival',
		end_date: 'departure'
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
    			writable:true,
    			value: Object.create(null)
    		},
    		occupancies: {
    			enumerable: true,
    			writable:true,
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

    	this.createIndex = function(payload, prop_name, index_prop_name) {
    		var collection = payload[prop_name],
    			i = 0,
    			len = collection.length,
    			idx = this.store[index_prop_name] = Object.create(null);

    		for(; i < len; ++i) {
    			idx[collection[i].id] = collection[i];
    		}
    	};

    	this.normalize = function() {
    		var rooms = this.rooms,
    			room_types = this.room_types,
    			occupancy = this.occupancy,
    			cur_room,
    			cur_occupancy,
    			index = this.store;

    		if(occupancy.length > 0) {
	    		for(var i = 0, len = occupancy.length; i < len; i++) {
	    			cur_occupancy = occupancy[i];
	    			cur_room = index.rooms[cur_occupancy.room_id];

	    			if(cur_room) {
	    				cur_room.room_type = index.room_types[cur_room.room_type_id].name;

	    				if(!cur_room.occupancy) {
	    					cur_room.occupancy = [];
	    				}

	    				occupancy.arrival = this.normalizeTime(occupancy.arrival_date, occupancy.arrival_time);
	    				occupancy.departure = this.normalizeTime(occupancy.departure_date, occupancy.departure_time);
	    				occupancy.maintenance = this.normalizeMaintenanceInterval(cur_room.departure_cleaning_time);

	    				cur_room.occupancy.push(cur_occupancy);
	    			}
	    		}
	    	} else {
	    		for(var i = 0, len = rooms.length; i < len; i++) {			
		    		cur_room = rooms[i];

	    			if(cur_room) {
	    				cur_room.room_type = index.room_types[cur_room.room_type_id].name;

	    				if(!cur_room.occupancy) {
	    					cur_room.occupancy = [];
	    				}
	    			}
	    		}
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

    	this.merge = function(currentData, incomingData) {

    	};
    	
    	this.fetchOccupancy = function(start_date, end_date) {
    		var self = this, q=  $q.defer();

    		this.start_date = start_date;

			this.fetchData(start_date, end_date, self.api_types.occupancy)
			.then(function(data) {
				self.room_types = data.room_types;
				self.room_types.unshift({ id: 'All', name: 'All', description: 'All' });
				self.createIndex(data, 'room_types', 'room_types');
				self.rooms = data.rooms;
				self.createIndex(data, 'rooms', 'rooms');
				self.occupancy = data.occupancy;
				self.createIndex(data, 'occupancy', 'occupancy');

				q.resolve({
					rooms: self.rooms,
					room_types: self.room_types,
					occupancy: self.occupancy
				});
			}, function(err) {
				q.reject(err);
			});

    		return q.promise;
    	};

    	this.fetchAvailability = function(start_date, end_date, rate_id, room_type_id) {
    		var self = this, q = $q.defer();

			this.fetchData(start_date, end_date, rate_id, room_type_id, self.api_types.availability)
			.then(function(payload) {
		   		var rooms = payload.rooms,
		   			cur_room,
		   			cur_room_type,
		   			room_types = payload.room_types,
		   			data = payload.results,
		   			t_a, t_b, t_c;

		   		for(var i = 0, len = data.length; i < len; i++) {
		   			cur_room = _.findWhere(rooms, { id: data[i].room_id });

		   			if(cur_room) {
		   				cur_room_type = _.findWhere(room_types, { id: cur_room.room_type_id });

		   				if(cur_room_type) {
		   					t_a = start_date.toComponents().time;
		   					t_b = end_date.toComponents().time;

		   					data[i].temporary = true;
							data[i].arrival = this.normalizeTime(tzIndependentDate(start_date), t_a.toString());
							data[i].departure = this.normalizeTime(tzIndependentDate(end_date), t_b.toString());
							data[i].maintenance = this.normalizeMaintenanceInterval(cur_room_type.departure_cleaning_time);	   					
		   				}
		   			}
		   		}

		   		self.availability = data;

		   		q.resolve(self.availability);
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
            	dto = { 
            		begin_time: start_time.hours + ':' + (start_time.minutes < 10 ? '0' + start_time.minutes : start_time.minutes),
					end_time: end_time.hours + ':' + (end_time.minutes < 10 ? '0' + end_time.minutes : end_time.minutes),
					begin_date: start_date.toLocaleDateString().replace('/', '-'),
					end_date: end_date.toLocaleDateString().replace('/', '-'),
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
    /*this.normalizeData = function(data, meta) {
    		var room, 
    			reservations, 
    			reservation,
    			arrival_date_meta = meta.arrival_date,
    			departure_date_meta = meta.departure_date;

    		if(!_.isArray(data)) {
    			throw new Error("Unexpected parameter");
    		}

    		for(var i = 0, len = data.length; i < len; i++) {
    			room = data[i];
    			reservations = room.reservations;

    			if(_.isArray(reservations)) {
    				for(var j = 0, rlen = reservations.length; j < rlen; j++) {
    					reservation = reservations[j];

    					reservation[arrival_date_meta] = reservation[arrival_date_meta].getTime();
    					reservation[departure_date_meta] = reservation[departure_date_meta].getTime();
    				}
	    		}
    		}

    		return data;
    	};*/

    	/*rooms = [
				{
					id: 0,
					key: 'room-0',
					number: '0',
					type: 'Single',
					occupancy: [
						{
							id: 1000,
							key: 'guest-status-0000',
							guest_name: 'Guest 0000',
							status: 'inhouse',
							start_date: new Date('09/30/2014 0:00:00 AM'),
							end_date: new Date('09/30/2014 2:30:00 AM')
						},
						{
							id: 1001,
							key: 'guest-status-0001',
							guest_name: 'Guest 0001',
							status: 'check-in',
							start_date: new Date('09/30/2014 3:00:00 AM'),
							end_date: new Date('09/30/2014 5:15:00 AM')
						},
												{
							id: 1002,
							key: 'guest-status-0002',
							guest_name: 'Guest 0002',
							status: 'check-in',
							start_date: new Date('09/30/2014 5:45:00 AM'),
							end_date: new Date('09/30/2014 7:30:00 AM')
						},
												{
							id: 1003,
							key: 'guest-status-0003',
							guest_name: 'Guest 0003',
							status: 'check-in',
							start_date: new Date('09/30/2014 9:30:00 AM'),
							end_date: new Date('09/30/2014 11:30:00 AM')
						},
												{
							id: 1004,
							key: 'guest-status-0004',
							guest_name: 'Guest 0004',
							status: 'check-in',
							start_date: new Date('09/30/2014 12:00:00 PM'),
							end_date: new Date('09/30/2014 2:45:00 PM')
						},
												{
							id: 1005,
							key: 'guest-status-0005',
							guest_name: 'Guest 0005',
							status: 'check-in',
							start_date: new Date('09/30/2014 3:45:00 PM'),
							end_date: new Date('09/30/2014 6:00:00 PM')
						},
												{
							id: 1006,
							key: 'guest-status-0006',
							guest_name: 'Guest 0006',
							status: 'check-in',
							start_date: new Date('09/30/2014 7:45:00 PM'),
							end_date: new Date('09/30/2014 8:30:00 PM')
						},
												{
							id: 1007,
							key: 'guest-status-0007',
							guest_name: 'Guest 0007',
							status: 'check-in',
							start_date: new Date('09/30/2014 10:00:00 PM'),
							end_date: new Date('09/31/2014 12:45:00 AM')
						}
					]
				},
				{
					id: 1,
					key: 'room-1',
					number: '1',
					type: 'Double',
					reservations: [
						{
							id: 10010,
							key: 'guest-status-10010',
							guest_name: 'Guest 10010',
							status: 'check-in',
							start_date: new Date('09/30/2014 1:15:00 AM'),
							end_date: new Date('09/30/2014 6:45 AM')
						},
						{
							id: 10011,
							key: 'guest-status-10011',
							guest_name: 'Guest 10011',
							status: 'check-in',
							start_date: new Date('09/30/2014 8:15:00 AM'),
							end_date: new Date('09/30/2014 11:45 AM')
						},
						{
							id: 10012,
							key: 'guest-status-10012',
							guest_name: 'Guest 10013',
							status: 'check-in',
							start_date: new Date('09/30/2014 12:15:00 PM'),
							end_date: new Date('09/30/2014 7:45 PM')
						},
						{
							id: 10013,
							key: 'guest-status-10013',
							guest_name: 'Guest 10013',
							status: 'check-in',
							start_date: new Date('09/30/2014 9:15:00 PM'),
							end_date: new Date('09/30/2014 10:45 PM')
						},
						{
							id: 10014,
							key: 'guest-status-10014',
							guest_name: 'Guest 10014',
							status: 'check-in',
							start_date: new Date('09/30/2014 11:30:00 PM'),
							end_date: new Date('09/31/2014 1:45 AM')
						},
						{
							id: 10015,
							key: 'guest-status-10015',
							guest_name: 'Guest 10015',
							status: 'check-in',
							start_date: new Date('09/31/2014 3:15:00 AM'),
							end_date: new Date('09/31/2014 6:45 AM')
						},
						{
							id: 10016,
							key: 'guest-status-10016',
							guest_name: 'Guest 10016',
							status: 'check-in',
							start_date: new Date('09/31/2014 7:15:00 AM'),
							end_date: new Date('09/31/2014 7:45 AM')
						},
						{
							id: 10017,
							key: 'guest-status-10017',
							guest_name: 'Guest 10017',
							status: 'check-in',
							start_date: new Date('09/31/2014 8:15:00 AM'),
							end_date: new Date('09/31/2014 10:45 AM')
						},
						{
							id: 10018,
							key: 'guest-status-10018',
							guest_name: 'Guest 10018',
							status: 'check-in',
							start_date: new Date('09/31/2014 11:15:00 AM'),
							end_date: new Date('09/31/2014 11:30 AM')
						}
					]
				},
				{
					id: 2,
					key: 'room-2',
					number: '2',
					type: 'Queen',
					reservations: [
						{
							id: 2000,
							key: 'guest-status-2000',
							guest_name: 'Guest 2',
							status: 'check-out',
							start_date: new Date('09/30/2014 1:00:00 PM'),
							end_date: new Date('09/30/2014 2:00:00 PM')
						}
					]
				},
				{
					id: 3,
					key: 'room-3',
					number: '3',
					type: 'King',
					reservations: [
						{
							id: 3000,
							key: 'guest-status-3000',
							guest_name: 'Guest 3',
							status: 'check-out',
							start_date: new Date('09/30/2014 2:30:00 PM'),
							end_date: new Date('09/30/2014 2:45:00 PM')
						}
					]
				},
				{
					id: 4,
					key: 'room-4',
					number: '4',
					type: 'Child',
					reservations: [
						{
							id: 4000,
							key: 'guest-status-4000',
							guest_name: 'Guest 4',
							status: 'inhouse',
							start_date: new Date('09/30/2014 5:15:00 PM'),
							end_date: new Date('09/30/2014 7:00:00 PM')
						}
					]
				},
				{
					id: 5,
					key: 'room-5',
					number: '5',
					type: 'Single',
					reservations: [
						{
							id: 5000,
							key: 'guest-status-5000',
							guest_name: 'Guest 0',
							status: 'inhouse',
							start_date: new Date('09/30/2014 2:30:00 PM'),
							end_date: new Date('09/30/2014 10:30:00 PM')
						}
					]
				},
				{
					id: 6,
					key: 'room-6',
					number: '6',
					type: 'Double',
					reservations: [
						{
							id: 6000,
							key: 'guest-status-6000',
							guest_name: 'Guest 6',
							status: 'check-in',
							start_date: new Date('09/30/2014 1:15:00 PM'),
							end_date: new Date('09/30/2014 5:45 PM')
						}
					]
				},
				{
					id: 7,
					key: 'room-7',
					number: '7',
					type: 'Queen',
					reservations: [
						{
							id: 7000,
							key: 'guest-status-7000',
							guest_name: 'Guest 7',
							status: 'check-in',
							start_date: new Date('09/30/2014 1:00:00 AM'),
							end_date: new Date('09/30/2014 2:45:00 AM')
						}
					]
				},
				{
					id: 8,
					key: 'room-8',
					number: '8',
					type: 'King',
					reservations: [
						{
							id: 8000,
							key: 'guest-status-8000',
							guest_name: 'Guest 8',
							status: 'check-in',
							start_date: new Date('09/30/2014 2:30:00 AM'),
							end_date: new Date('09/30/2014 7:45:00 AM')
						}
					]
				},
				{
					id: 9,
					key: 'room-9',
					number: '9',
					type: 'Child',
					reservations: [
						{
							id: 9000,
							key: 'guest-status-9000',
							guest_name: 'Guest 9',
							status: 'check-out',
							start_date: new Date('09/30/2014 12:15:00 PM'),
							end_date: new Date('09/30/2014 3:00:00 PM')
						}
					]
				},
						{
					id: 10,
					key: 'room-10',
					number: '10',
					type: 'Single',
					reservations: [
						{
							id: 10000,
							key: 'guest-status-10000',
							guest_name: 'Guest 10',
							status: 'inhouse',
							start_date: new Date('09/30/2014 2:30:00 PM'),
							end_date: new Date('09/30/2014 10:30:00 PM')
						}
					]
				},
				{
					id: 11,
					key: 'room-11',
					number: '11',
					type: 'Double',
					reservations: [
						{
							id: 11000,
							key: 'guest-status-11000',
							guest_name: 'Guest 11',
							status: 'check-in',
							start_date: new Date('09/30/2014 1:15:00 PM'),
							end_date: new Date('09/30/2014 5:45 PM')
						}
					]
				},
				{
					id: 12,
					key: 'room-12',
					number: '12',
					type: 'Queen',
					reservations: [
						{
							id: 12000,
							key: 'guest-status-12000',
							guest_name: 'Guest 12',
							status: 'check-in',
							start_date: new Date('09/30/2014 1:00:00 AM'),
							end_date: new Date('09/30/2014 2:45:00 AM')
						}
					]
				},
				{
					id: 13,
					key: 'room-13',
					number: '13',
					type: 'King',
					reservations: [
						{
							id: 13000,
							key: 'guest-status-13000',
							guest_name: 'Guest 13',
							status: 'check-in',
							start_date: new Date('09/30/2014 2:30:00 AM'),
							end_date: new Date('09/30/2014 7:45:00 AM')
						}
					]
				},
				{
					id: 14,
					key: 'room-14',
					number: '14',
					type: 'Child',
					reservations: [
						{
							id: 14000,
							key: 'guest-status-14000',
							guest_name: 'Guest 14000',
							status: 'check-out',
							start_date: new Date('09/30/2014 12:15:00 PM'),
							end_date: new Date('09/30/2014 3:00:00 PM')
						}
					]
				},
				{
					id: 20,
					key: 'room-20',
					number: '20',
					type: 'Single',
					reservations: [
						{
							id: 20000,
							key: 'guest-status-0000',
							guest_name: 'Guest 20',
							status: 'inhouse',
							start_date: new Date('09/30/2014 0:30:00 AM'),
							end_date: new Date('09/30/2014 1:30:00 AM')
						}
					]
				},
				{
					id: 21,
					key: 'room-21',
					number: '21',
					type: 'Double',
					reservations: [
						{
							id: 21001,
							key: 'guest-status-1000',
							guest_name: 'Guest 21',
							status: 'check-in',
							start_date: new Date('09/30/2014 1:15:00 AM'),
							end_date: new Date('09/30/2014 4:45 AM')
						}
					]
				},
				{
					id: 22,
					key: 'room-22',
					number: '22',
					type: 'Queen',
					reservations: [
						{
							id: 22000,
							key: 'guest-status-22000',
							guest_name: 'Guest 22',
							status: 'check-out',
							start_date: new Date('09/30/2014 1:00:00 AM'),
							end_date: new Date('09/30/2014 2:30:00 AM')
						}
					]
				},
				{
					id: 23,
					key: 'room-23',
					number: '23',
					type: 'King',
					reservations: [
						{
							id: 23000,
							key: 'guest-status-23000',
							guest_name: 'Guest 23',
							status: 'check-out',
							start_date: new Date('09/30/2014 2:30:00 AM'),
							end_date: new Date('09/30/2014 3:45:00 AM')
						}
					]
				},
				{
					id: 24,
					key: 'room-24',
					number: '24',
					type: 'Child',
					reservations: [
						{
							id: 24000,
							key: 'guest-status-24000',
							guest_name: 'Guest 24',
							status: 'inhouse',
							start_date: new Date('09/30/2014 5:15:00 PM'),
							end_date: new Date('09/30/2014 7:00:00 PM')
						}
					]
				},
				{
					id: 25,
					key: 'room-25',
					number: '25',
					type: 'Single',
					reservations: [
						{
							id: 25000,
							key: 'guest-status-25000',
							guest_name: 'Guest 25',
							status: 'inhouse',
							start_date: new Date('09/30/2014 2:30:00 PM'),
							end_date: new Date('09/30/2014 8:15:00 PM')
						}
					]
				},
				{
					id: 26,
					key: 'room-26',
					number: '26',
					type: 'Double',
					reservations: [
						{
							id: 26000,
							key: 'guest-status-26000',
							guest_name: 'Guest 26',
							status: 'check-in',
							start_date: new Date('09/30/2014 1:15:00 PM'),
							end_date: new Date('09/30/2014 2:45 PM')
						}
					]
				},
				{
					id:27,
					key: 'room-27',
					number: '27',
					type: 'Queen',
					reservations: [
						{
							id: 27000,
							key: 'guest-status-27000',
							guest_name: 'Guest 27',
							status: 'check-in',
							start_date: new Date('09/30/2014 1:30:00 AM'),
							end_date: new Date('09/30/2014 2:45:00 AM')
						}
					]
				},
				{
					id: 28,
					key: 'room-28',
					number: '28',
					type: 'King',
					reservations: [
						{
							id: 28000,
							key: 'guest-status-28000',
							guest_name: 'Guest 28',
							status: 'check-in',
							start_date: new Date('09/30/2014 5:30:00 AM'),
							end_date: new Date('09/30/2014 7:45:00 AM')
						}
					]
				},
				{
					id: 29,
					key: 'room-29',
					number: '29',
					type: 'Child',
					reservations: [
						{
							id: 29000,
							key: 'guest-status-29000',
							guest_name: 'Guest 29',
							status: 'check-out',
							start_date: new Date('09/30/2014 2:15:00 PM'),
							end_date: new Date('09/30/2014 3:00:00 PM')
						}
					]
				},
						{
					id: 30,
					key: 'room-30',
					number: '30',
					type: 'Single',
					reservations: [
						{
							id: 30000,
							key: 'guest-status-30000',
							guest_name: 'Guest 30',
							status: 'inhouse',
							start_date: new Date('09/30/2014 2:30:00 PM'),
							end_date: new Date('09/30/2014 4:30:00 PM')
						}
					]
				},
				{
					id: 31,
					key: 'room-31',
					number: '31',
					type: 'Double',
					reservations: [
						{
							id: 31000,
							key: 'guest-status-31000',
							guest_name: 'Guest 31',
							status: 'check-in',
							start_date: new Date('09/30/2014 4:15:00 PM'),
							end_date: new Date('09/30/2014 5:45 PM')
						}
					]
				},
				{
					id: 32,
					key: 'room-32',
					number: '32',
					type: 'Queen',
					reservations: [
						{
							id: 32000,
							key: 'guest-status-32000',
							guest_name: 'Guest 32',
							status: 'check-in',
							start_date: new Date('09/30/2014 1:45:00 AM'),
							end_date: new Date('09/30/2014 2:45:00 AM')
						}
					]
				},
				{
					id: 33,
					key: 'room-33',
					number: '33',
					type: 'King',
					reservations: [
						{
							id: 33000,
							key: 'guest-status-33000',
							guest_name: 'Guest 33',
							status: 'check-in',
							start_date: new Date('09/30/2014 2:30:00 AM'),
							end_date: new Date('09/30/2014 7:45:00 AM')
						}
					]
				},
				{
					id: 34,
					key: 'room-34',
					number: '34',
					type: 'Child',
					reservations: [
						{
							id: 14000,
							key: 'guest-status-14000',
							guest_name: 'Guest 14000',
							status: 'check-out',
							start_date: new Date('09/30/2014 12:15:00 PM'),
							end_date: new Date('09/30/2014 3:00:00 PM')
						}
					]
				}
			];*/

			/*this.createIndicies = function(payload, prop_name) {
    		var rooms = payload.rooms,
    			roomTypes = payload.room_types,
    			occupancies = payload.results.occupancy,
    			roomIndex = this.index.rooms,
    			roomTypeIndex = this.index.roomTypes,
    			occIndex = this.index.occupancies;

    		for(var i = 0, len = rooms.length; i < len; i++) {
    			roomIndex[rooms[i].id] = rooms[i];
    		}

    		for(var i = 0, len = roomTypes.length; i < len; i++) {
    			roomTypeIndex[roomTypes[i].id] = roomTypes[i];
    		}

    		for(var i = 0, len = occupancies.length; i < len; i++) {
    			occIndex[occupancies[i].reservation_id] = occupancies[i];
    		}
    	};*/
}]);
