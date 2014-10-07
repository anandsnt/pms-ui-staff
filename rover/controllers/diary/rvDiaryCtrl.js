sntRover
.controller('RVDiaryCtrl', [ '$scope', '$rootScope', '$filter', '$window', function($scope, $rootScope, $filter, $window) {
	BaseCtrl.call(this, $scope);

    $scope.initReservationData = function() {
            // intialize reservation object
            $scope.reservationData = {
                arrivalDate: '',
                departureDate: '',
                midStay: false, // Flag to check in edit mode if in the middle of stay
                stayDays: [],
                checkinTime: {
                    hh: '',
                    mm: '00',
                    ampm: 'AM'
                },
                checkoutTime: {
                    hh: '',
                    mm: '00',
                    ampm: 'AM'
                },
                taxDetails: {},
                numNights: 1, // computed value, ensure to keep it updated
                roomCount: 1, // Hard coded for now,
                rooms: [{
                    numAdults: 1,
                    numChildren: 0,
                    numInfants: 0,
                    roomTypeId: '',
                    roomTypeName: '',
                    rateId: '',
                    rateName: '',
                    rateAvg: 0,
                    rateTotal: 0,
                    addons: [],
                    varyingOccupancy: false,
                    stayDates: {},
                    isOccupancyCheckAlerted: false
                }],
                totalTaxAmount: 0,
                totalStayCost: 0,
                guest: {
                    id: null, // if new guest, then it is null, other wise his id
                    firstName: '',
                    lastName: '',
                    email: '',
                    city: '',
                    loyaltyNumber: '',
                    sendConfirmMailTo: ''
                },
                company: {
                    id: null, // if new company, then it is null, other wise his id
                    name: '',
                    corporateid: '', // Add different fields for company as in story
                },
                travelAgent: {
                    id: null, // if new , then it is null, other wise his id
                    name: '',
                    iataNumber: '', // Add different fields for travelAgent as in story
                },
                paymentType: {
                    type: {},
                    ccDetails: { //optional - only if credit card selected
                        number: '',
                        expMonth: '',
                        expYear: '',
                        nameOnCard: ''
                    }
                },
                demographics: {
                    market: '',
                    source: '',
                    reservationType: '',
                    origin: ''
                },
                promotion: {
                    promotionCode: '',
                    promotionType: ''
                },
                status: '', //reservation status
                reservationId: '',
                confirmNum: '',
                isSameCard: false, // Set flag to retain the card details,
                rateDetails: [], // This array would hold the configuration information of rates selected for each room
                isRoomRateSuppressed: false // This variable will hold flag to check whether any of the room rates is suppressed?
            };
	};

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

	$scope.start_date = new Date('09/30/2014 12:00 AM');
	$scope.start_time = new Time($scope.start_date.toComponents().time);

	/*SPECIFY GRID SIZE TO RENDER CONTROL*/
	$scope.grid_dimensions = {
		width: angular.element($window).width() - 120,
		height: angular.element($window).height() - 230
	};

	/*DEFAULT RESERVATION GRID ITEM WIDTH IN HOURS*/
	$scope.new_reservation_time_span = 4;

	/*MAINTENANCE CONFIG*/
	$scope.maintenance_span_int = 2;

	/*ARRIVAL TIMES CONFIG*/
	$scope.arrival_times = [];

	(function() {
		for(var i = 0; i < 24; i++) {
			$scope.arrival_times.push(i + ':00');
		}
	})();
	/*DATE UI CONFIG*/
	$scope.dateOptions = {
    	showOn: 'button',
    	dateFormat: $rootScope.dateFormat,
    	numberOfMonths: 1,
    	minDate: new tzIndependentDate($rootScope.businessDate),
    	yearRange: '-0:' /*,
        beforeShow: function(input, inst) {
			$('#ui-datepicker-div').addClass('reservation arriving');
			$('<div id="ui-datepicker-overlay" class="transparent" />').insertAfter('#ui-datepicker-div');
        },
        onClose: function(dateText, inst) {
			$('#ui-datepicker-div').removeClass('reservation arriving');
			$('#ui-datepicker-overlay').remove();
	    }*/
    };

	/*FILTER CONFIG*/
    $scope.filter = {
    	arrival_date: $scope.start_date,
    	arrival_time: '1:00',
    	hours_days: 'h',
    	range: 12,
    	rate_type: 'All',
    	room_type: 'All',
    	toggleHoursDays: function() {
    		this.hours_days = (this.hours_days === 'h') ? 'd' : 'h';
    	},
    	toggleRange: function() {
			this.range = (this.range === 12) ? 24 : 12;
		}
    };

    /*React callbacks for grid events*/
    $scope.onDragStart = function(component, data, event) {

    	$scope.apply();
    };

    $scope.onDragEnd = function(component, data, event) {

		$scope.apply();
    };

    $scope.onResizeStart = function(component, data, event) {

    	$scope.apply();
    };

    $scope.onResizeEnd = function(component, data, event) {

    	$scope.apply();
    };

    $scope.onScrollLoadTriggerRight = function(component, data, event) {

    	$scope.apply();
    };

    $scope.onScrollLoadTriggerLeft = function(component) {

		$scope.apply();
    };
       
	$scope.onUpdate = function() {
		clearNewReservations($scope.data);
		injectNewReservations(Time({ hours: $scope.new_reservation_time_span }),
							  $scope.filter,
							  $scope.data);
		React.renderComponent(
			DiaryContent({
				scope: $scope
			}),
			document.getElementById('component-wrapper')
		);
	};

	function getMaxId(max, data, idx) {
		if(idx < data.length) {
			if(max < data[idx].id) {
				return getMaxId(data[idx].id, data, ++idx);
			} else if(idx < data.length) {
				return getMaxId(max, data, ++idx);
			}
		} else {
			return max;
		}
	}

	function clearNewReservations(data) {
		var hop = Object.prototype.hasOwnProperty;

		data.forEach(function(item) {
			if(_.isArray(item.reservations)) {
				if(hop.call(_.last(item.reservations), 'temporary')) {
					item.reservations.pop();
				}
			}
		});
	}

	function injectNewReservations(time_span, filter, data) {
		var start_date = filter.arrival_date,
			start_time = filter.arrival_time,
			start = new Date(start_date.getFullYear(),
							 start_date.getMonth(),
							 start_date.getDate(),
							 start_time.charAt(0),
							 0, 0, 0),
			end = new Date(start.getFullYear(),
						   start.getMonth(),
						   start.getDate(),
						   start.getHours() + time_span.hours,
						   start.getMinutes() + time_span.minutes,
						   0, 0),
			start_id = getMaxId(-1, $scope.data, 0),
			reservation = function(room, id, start_date, end_date) {
				return {
					id: id,
					key: 'guest-status-' + id,
					guest_name: 'Guest ' + id,
					status: 'reservation',
					start_date: start_date,
					end_date: end_date,
					room_type: room.type,
					rate: 'Not Defined',
					temporary: true
				};
			},
			check_reservation_ranges = function(reservations, start_date, end_date) {
				var range_validated = true;

				reservations.forEach(function(reservation, idx) {
					if(start_date >= reservation.start_date && start_date <= reservation.end_date ||
					   reservation.start_date >= start_date && reservation.end_date <= end_date ||
					   end_date >= reservation.start_date && end_date <= reservation.end_date) {
						range_validated = false;
						return;
					}
				});

				return range_validated;
			};

		data.forEach(function(item, idx) {
			if(check_reservation_ranges(item.reservations, start, end)) { 
				item.reservations.push(reservation(item, ++start_id, start, end));
			}
		});	
	} 
}]);