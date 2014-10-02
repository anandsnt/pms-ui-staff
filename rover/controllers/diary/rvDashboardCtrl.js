SntRover
.controller('DRdashboardCtrl', ['$scope', function($scope) {
	console.log($scope);

	$scope.data = [
		{
			id: 0,
			key: 'room-0',
			number: '0',
			name: 'Single',
			reservations: [
				{
					id: 0,
					key: 'guest-status-0',
					status: 'housekeeping',
					start_date: new Date('09/30/2014 4:20:00 PM'),
					end_date: new Date('09/30/2014 8:20:00 PM')
				}
			]
		},
		{
			id: 1,
			key: 'room-1',
			number: '1',
			name: 'Double',
			reservations: [
				{
					id: 1,
					key: 'guest-status-1',
					status: 'checkin',
					start_date: new Date('09/30/2014 6:15:00 PM'),
					end_date: new Date('09/30/2014 11:45 PM')
				}
			]
		},
		{
			id: 2,
			key: 'room-2',
			number: '2',
			name: 'Queen',
			reservations: [
				{
					id: 2,
					key: 'guest-status-2',
					status: 'checkout',
					start_date: new Date('09/30/2014 1:00:00 PM'),
					end_date: new Date('09/30/2014 2:00:00 PM')
				}
			]
		},
		{
			id: 3,
			key: 'room-3',
			number: '3',
			name: 'King',
			reservations: [
				{
					id: 3,
					key: 'guest-status-3',
					status: 'housekeeping',
					start_date: new Date('09/30/2014 2:30:00 PM'),
					end_date: new Date('09/30/2014 2:45:00 PM')
				}
			]
		},
		{
			id: 4,
			key: 'room-4',
			number: '4',
			name: 'Child',
			reservations: [
				{
					id: 4,
					key: 'guest-status-4',
					status: 'arrival',
					start_date: new Date('09/30/2014 5:15:00 PM'),
					end_date: new Date('09/30/2014 7:00:00 PM')
				}
			]
		}
	];

	$scope.start_date = new Date('09/30/2014 12:00 PM');
}]);