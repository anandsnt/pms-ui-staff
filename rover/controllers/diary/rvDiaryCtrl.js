sntRover
.controller('RVDiaryCtrl', [ '$scope','$window', function($scope, $window) {
	var currentDate = new Date();

	BaseCtrl.call(this, $scope);

	$scope.currentDate = Object.create(null, {
		day: {
			enumerable: true,
			writable: true,
			value: currentDate.getDate()
		},
		month: {
			enumerable: true,
			writable: true,
			value: currentDate.getMonth()
		},
		year: {
			enumerable: true,
			writable: true,
			value: currentDate.getFullYear()
		}
	});

	/*Current Mock Data for testing*/
	$scope.data = [
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
			type: 'Child',
			reservations: [
				{
					id: 4,
					key: 'guest-status-4',
					guest_name: 'Guest 4',
					status: 'arrival',
					start_date: new Date('09/30/2014 5:15:00 PM'),
					end_date: new Date('09/30/2014 7:00:00 PM')
				}
			]
		}
	];

	$scope.start_date = new Date('09/30/2014 12:00 PM');
	$scope.start_time = new Time($scope.start_date.toComponents().time);

	$scope.maintenance_span_int = 2;
}]);