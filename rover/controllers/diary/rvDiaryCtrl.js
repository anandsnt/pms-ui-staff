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

	/*Initial Values and Default Settings for React Grid*/
	/*Initialization of React/Angular hooks and callbacks*/
	/*Mock data currently in use*/
	(function() {
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

		$scope.gridProps = {
			viewport: {
				hours: 12,
				width: angular.element($window).width() - 120,
				height: angular.element($window).height() - 230,
				row_header_right: 120, 
				timeline_header_height: 80,
				timeline_height: 60,
				timeline_occupancy_height: 20,
				timeline_header_bottom: 230,
				element: function() {
					return $('.diary-grid .wrapper');
				}
			},
			display: {
				width: undefined,
				height: undefined,
				hours: 48,
				row_height: 60,
				row_height_margin: 5,
				intervals_per_hour: 4, 
				px_per_ms: undefined,
				px_per_int: undefined,
				px_per_hr: undefined,
				maintenance_span_int: 2, //In sub-intervals(ie. 15min interval count)
				new_reservation_time_span: 4 //In hours - let's change this later to intervals as well
			},
			filter: {
		    	arrival_date: $scope.start_date,
		    	enable_resize: false,
		    	arrival_time: '1:00',
		    	hours_days: 'h',
		    	range: 12,
		    	rate_type: 'All',
		    	room_type: 'All',
		    	toggleHoursDays: function() {
		    		this.hours_days = (this.hours_days === 'h') ? 'd' : 'h';
		    	},
		    	toggleRange: function() {
		    		var hourFormat12 = this.range === 12;

					$scope.gridProps.viewport.hours = this.range = (hourFormat12) ? 24 : 12;
					$scope.gridProps.display.row_height = (hourFormat12) ? 60 : 24;
					$scope.gridProps.display.row_height_margin = (hourFormat12) ? 5 : 0;

					renderGrid(); 
				}
		    },
		    data: $scope.data
		};

		/*_________________________________________________________*/
		/*BEGIN PROTOTYPE UI CONFIGURATION -- NOT MEANT TO BE FINAL*/
		/*_________________________________________________________*/
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
	    	yearRange: '-0:'
	    };

		/*FILTER CONFIG*/
		$scope.room_types = _.uniq(_.pluck($scope.data, 'type'));
		$scope.room_types.unshift('All');

		/*_________________________________________________________*/
		/*END PROTOTYPE UI CONFIGURATION -- NOT MEANT TO BE FINAL*/
		/*_________________________________________________________*/

		/*_________________________________________________________*/
		/*BEGIN PROTOTYPE EVENT HOOKS -- */
		/*_________________________________________________________*/
		(function() {    /*React callbacks for grid events*/
			var prevRoom;

		    $scope.onDragStart = function(room, reservation, start_time) {
		    	prevRoom = room;

		    	console.log('Reservation room transfer initiated:  ', room, reservation);
		    };

		    $scope.onDragEnd = function(nextRoom, reservation, start_time) {
		    	console.log('New Room for reservation confirmed:  ', nextRoom, reservation);

		    	reservationRoomTransfer(nextRoom, prevRoom, reservation);

		    	renderGrid();
		    };
		})();

		/*Left must be passed in milliseconds for accurate time adjustment*/
		(function() { 
			var w0;

		    $scope.onResizeLeftStart = function(room, reservation, start_time_ms) {
		    	w0 = start_time_ms;
		    };

		    $scope.onResizeLeftEnd = function(room, reservation, start_time_ms) {
		    	var delta = start_time_ms - w0,
		    		arrival_time = new Date(start_time_ms);
		    	
		    	 updateStartTimeOffsetNewReservations(delta);
		    };
	    })();

		(function() {
			var w0;

		    $scope.onResizeRightStart = function(room, reservation, end_time_ms) {
		    	w0 = end_time_ms;
		    };

		    $scope.onResizeRightEnd = function(room, reservation, end_time_ms) {
		    	var delta = end_time_ms - w0;

		    	updateEndTimeOffsetNewReservations(delta);
		    };
		})();

	    $scope.onScrollLoadTriggerRight = function(component, data, event) {

	    };

	    $scope.onScrollLoadTriggerLeft = function(component) {
			
	    };

	    $scope.onSelect = function(data, selected) {
	    	data.selected = selected;
	    };
	    /*_________________________________________________________*/
		/*END PROTOTYPE EVENT HOOKS -- */
		/*_________________________________________________________*/

	    $scope.isSelected = function(data) {
	    	return data.selected;
	    };

	    $scope.displayFilter = function(filter, reservation, room, data) {
	    	if(Object.prototype.hasOwnProperty.call(reservation, 'temporary')) {
	    		if(angular.lowercase(filter.room_type) === 'all' || filter.room_type === data.room_type) {
	    			return true;
	    		} else {
	    			return false;
	    		}
	    	} else {
	    		return true;
	    	}
	    };

		$scope.onUpdate = function() {
			$scope.filter.enable_resize = true;

			clearNewReservations($scope.data);
			injectNewReservations(Time({ hours: $scope.display.new_reservation_time_span }),
								  $scope.filter,
								  $scope.data);

			renderGrid();
		};
	})();

	function updateStartTimeOffsetNewReservations(newArrivalTimeDelta) {
		var hop = Object.prototype.hasOwnProperty;

		$scope.data.forEach(function(item) {
			item.reservations.forEach(function(res) {
				if(hop.call(res, 'temporary')) {
					res.start_date = new Date(res.start_date.getTime() + newArrivalTimeDelta);
				}
			});
		});
	}

	function updateEndTimeOffsetNewReservations(newDepartureTimeDelta) {
		var hop = Object.prototype.hasOwnProperty;

		$scope.data.forEach(function(item) {
			item.reservations.forEach(function(res) {
				if(hop.call(res, 'temporary')) {
					res.end_date = new Date(res.end_date.getTime() + newDepartureTimeDelta);
				}
			});
		});
	}

	function renderGrid() {
 		React.renderComponent(
			DiaryContent($scope.gridProps),
			document.getElementById('component-wrapper')
		);	
	}

	function parseArrivalTime(arrival_time) {
		var pos = arrival_time.indexOf(':'),
			hours, minutes;

		if(pos > -1) {
			hours = arrival_time.substr(0, pos);

			if(pos < arrival_time.length) {
				minutes = arrival_time.substr(pos + 1);
			}
		}

		if(hours && minutes) {
			return Time({hours: hours, minutes: minutes});
		}
	}

	function reservationRoomTransfer(nextRoom, room, reservation) {
		nextRoom.reservations = nextRoom.reservations || [];
		nextRoom.reservations.push(removeReservation(room, reservation));
	}

	function findRoom(room) {
		return _.findWhere($scope.data, { id: room.id });
	}

	function removeReservation(room, reservation) {
		var res = _.findWhere(room.reservations, { id: reservation.id });
		
		room.reservations.splice(_.indexOf(room.reservations, res), 1);

		return res;
	}

	function getMaxId(max, data, idx) {
		if(idx < data.length) {
			return getMaxId((max < data[idx].id) ? data[idx].id : max, data, ++idx);
		} else {
			return max;
		}
	}

	function clearNewReservations(data) {
		var hop = Object.prototype.hasOwnProperty,
			topOfStack;

		data.forEach(function(item) {
			if(_.isArray(item.reservations)) {
				topOfStack = _.last(item.reservations);

				if(topOfStack && hop.call(topOfStack, 'temporary')) {
					item.reservations.pop();
				}
			}
		});
	}

	function check_reservation_ranges(reservations, start_date, end_date) {
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
	}

	function injectNewReservations(time_span, filter, data) {
		var start_date = filter.arrival_date,
			start_time = parseArrivalTime(filter.arrival_time),
			start = new Date(start_date.getFullYear(),
							 start_date.getMonth(),
							 start_date.getDate(),
							 start_time.hours, //parseInt(start_time.charAt(0)),
							 start_time.minutes, 
							 0, 0),
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
					status: 'available',
					start_date: start_date,
					end_date: end_date,
					room_type: room.type,
					rate: 'Not Defined',
					temporary: true
				};
			};

		data.forEach(function(item, idx) {
			if(check_reservation_ranges(item.reservations, start, end)) { 
				item.reservations.push(reservation(item, ++start_id, start, end));
			}
		});	
	} 
}]);