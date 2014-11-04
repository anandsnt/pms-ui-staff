sntRover
.constant('rvDiaryConstants', { 
	TIME_SPAN_SEEK: 48 * 86400000, 
	SEEK_OFFSET: -7200,
	RESERVATION_API: 'api/hourly_availability' })
.service('rvDiarySrv', ['$q', 'RVBaseWebSrv', 'rvBaseWebSrvV2', 'rvDiaryConstants',
    function ($q, RVBaseWebSrv, rvBaseWebSrvV2, rvDiaryConstants) {

    	//this.model = new Model({ room_types: [], rooms: [], results: [] });
    	//this.models.room_types = [];
    	//this.models.rooms = [];
    	//this.models.rates = [];
    	//this.models.reservations = [];
    	
    	this.normalizeData = function(data, meta) {
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
    	};

    	this.merge = function(currentData, incomingData) {

    	};
    	
    	/*this.reservations = function(date, rate_id) { //, calendar_date, room_type_ids) {
    		//ASSUME in ms for now
    		var begin_date = calendar_date + rvDiaryConstants.SEEK_OFFSET,
    			end_date = calendar_date + rvDiaryConstants.TIME_SPAN_SEEK,
    			calendar_date = new Date(date).toLocaleDateString();

    		rvBaseWebSrvV2.getJSON();
    	};*/

        this.fetchInitialData = function (arrival_date, meta){
            var deferred = $q.defer (),
            	rooms;

            rooms = [
				{
					id: 0,
					key: 'room-0',
					number: '0',
					type: 'Single',
					reservations: [
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
			];

			deferred.resolve(this.normalizeData(rooms, meta));

            return deferred.promise;
        };
    }
]);
