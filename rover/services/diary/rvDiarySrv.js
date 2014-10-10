sntRover.service('rvDiarySrv', ['$q', 'rvBaseWebSrvV2', 'RVBaseWebSrv',
    function ($q, rvBaseWebSrvV2, RVBaseWebSrv) {
        this.fetchInitialData = function (arrival_date){
            var deferred = $q.defer (),
            	reservations;

            reservations = [
				{
					id: 0,
					key: 'room-0',
					number: '0',
					type: 'Single',
					reservations: [
						{
							id: 0,
							key: 'guest-status-0',
							guest_name: 'Guest 0',
							status: 'inhouse',
							start_date: new Date('09/30/2014 4:20:00 PM'),
							end_date: new Date('09/30/2014 8:20:00 PM')
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
							id: 1,
							key: 'guest-status-1',
							guest_name: 'Guest 1',
							status: 'check-in',
							start_date: new Date('09/30/2014 6:15:00 PM'),
							end_date: new Date('09/30/2014 11:45 PM')
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
							id: 2,
							key: 'guest-status-2',
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
							id: 3,
							key: 'guest-status-3',
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
							id: 4,
							key: 'guest-status-4',
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
							id: 5,
							key: 'guest-status-0',
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
							id: 6,
							key: 'guest-status-6',
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
							id: 2,
							key: 'guest-status-7',
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
							id: 3,
							key: 'guest-status-8',
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
							id: 4,
							key: 'guest-status-9',
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
							id: 10,
							key: 'guest-status-10',
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
							id: 11,
							key: 'guest-status-11',
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
							id: 12,
							key: 'guest-status-12',
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
							id: 13,
							key: 'guest-status-13',
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
							id: 14,
							key: 'guest-status-14',
							guest_name: 'Guest 14',
							status: 'check-out',
							start_date: new Date('09/30/2014 12:15:00 PM'),
							end_date: new Date('09/30/2014 3:00:00 PM')
						}
					]
				}
			];

			deferred.resolve(reservations);

            return deferred.promise;
        };
    }
]);
