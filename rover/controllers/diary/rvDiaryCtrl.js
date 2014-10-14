sntRover.controller('RVDiaryCtrl', [ '$scope', '$rootScope', '$filter', '$window', 'ngDialog', 'rvDiarySrv', '$state', '$stateParams', 'loadInitialData', 
	function($scope, $rootScope, $filter, $window, ngDialog, rvDiarySrv, $state, $stateParams, loadInitialData) {
	//'use strict';
	BaseCtrl.call(this, $scope);

	/*--------------------------------------------------*/
	/*BEGIN INITIALIZATION METHOD IN PROTECTED SCOPE*/
	/*--------------------------------------------------*/

	/*Initial Values and Default Settings for React Grid*/
	/*Initialization of React/Angular hooks and callbacks*/
	/*Mock data currently in use*/
	(function() {
		$scope.data = loadInitialData;

		$scope.start_date = new Date('09/30/2014 12:00 AM');
		$scope.start_time = new Time($scope.start_date.toComponents().time);
		$scope.selectedReservations = [];

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
			meta: {

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
		    		var hourFormat12 = ($scope.gridProps.viewport.hours === 12);

					$scope.gridProps.viewport.hours = (hourFormat12) ? 24 : 12;
					$scope.gridProps.display.row_height = (hourFormat12) ? 24 : 60;
					$scope.gridProps.display.row_height_margin = (hourFormat12) ? 0 : 5;

					//viewport.width = $(window).width() - 120;
					//viewport.height = $(window).height() - 230;

					$scope.gridProps.display.width 		= $scope.gridProps.display.hours / $scope.gridProps.viewport.hours * $scope.gridProps.viewport.width;
					$scope.gridProps.display.px_per_hr 	= $scope.gridProps.viewport.width / $scope.gridProps.viewport.hours;
					$scope.gridProps.display.px_per_int = $scope.gridProps.display.px_per_hr / $scope.gridProps.display.intervals_per_hour;
					$scope.gridProps.display.px_per_ms 	= $scope.gridProps.display.px_per_int / 900000;

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
			var prevRoom, prevTime;

		    $scope.onDragStart = function(room, reservation) {
		    	prevRoom = room;
		    	prevTime = reservation.start_time;

		    	console.log('Reservation room transfer initiated:  ', room.id, reservation.status, prevTime);
		    };

		    $scope.onDragEnd = function(nextRoom, reservation) {
		    	var availability;

		    	availability = determineAvailability(nextRoom.reservations, reservation).shift();

				if(availability) {
			    	if(nextRoom.id !== prevRoom.id) {
			    		reservationRoomTransfer(nextRoom, prevRoom, reservation);
				    }

			    	renderGrid();
			    }
		    };
		})();

	    $scope.onResizeLeftStart = function(room, reservation) {
	    	console.log('Resize left start', room, reservation);
	    };

	    $scope.onResizeLeftEnd = function(room, reservation) {
	    	console.log('Resize left end', room, reservation);    	
	    };

	    $scope.onResizeRightStart = function(room, reservation) {
	    	console.log('Resize right start', room, reservation);
	    };

	    $scope.onResizeRightEnd = function(room, reservation) {
	    	console.log('Resize right end', room, reservation);	    	
	    };

	    $scope.onScrollLoadTriggerRight = function(component, data, event) {

	    };

	    $scope.onScrollLoadTriggerLeft = function(component) {
			
	    };

	    $scope.onSelect = function(row_data, row_item_data, selected, command_message) {
	    	var copy = {};

	    	row_item_data.selected = selected;

	    	if($scope.isSelected(row_item_data)) {
	    		$scope.selectedReservations.push(reservation);
	    	}

	    	switch(command_message) {
	    		case 'resize': 
	    		copy = _.extend({}, row_item_data);

	    		copy.start_date = new Date(row_item_data.start_date.getTime());
	    		copy.end_date = new Date(row_item_data.end_date.getTime());
	    		copy.left = (copy.start_date.getTime() - $scope.gridProps.display.x_origin) * $scope.gridProps.display.px_per_ms;
	    		copy.right = (copy.end_date.getTime() - $scope.gridProps.display.x_origin) * $scope.gridProps.display.px_per_ms;

	    		renderGrid({ currentResizeItem: copy });

	    		break;	 
	    	}   
	    };
	    /*_________________________________________________________*/
		/*END PROTOTYPE EVENT HOOKS -- */
		/*_________________________________________________________*/

	    $scope.isSelected = function(data) {
	    	return _.isBoolean(data.selected) && data.selected;
	    };

	    $scope.displayFilter = function(filter, reservation, room, data) {
	    	if(Object.prototype.hasOwnProperty.call(reservation, 'temporary')) {
	    		if(angular.lowercase(filter.room_type) === 'all' || filter.room_type === reservation.room_type) {
	    			return true;
	    		} else {
	    			return false;
	    		}
	    	} else {
	    		return true;
	    	}
	    };

	    $scope.calculateOccupancy = function(rooms) {
	    	var len = rooms.length,
	    		vals = _.range(1, $scope.gridProps.display.hours, 1);

	    	return _.map(vals, function(val) {
	    		return _.random(0, len) * val;
	    	});
	    };
	})();

	/*WATCHERS*/
	$scope.$watch('selectedReservations.length', function(newValue, oldValue) {
		if(newValue > oldValue) {
			ngDialog.open({
				template: 'assets/partials/diary/rvDiaryConfirmation.html',
				controller: 'RVDiaryConfirmation',
				scope: $scope
			});
		} 
	});

	$scope.$watch('gridProps.filter.arrival_date', function(newValue, oldValue) {
		var props = $scope.gridProps,
			display = props.display;

		if(newValue !== oldValue) {
			display.x_origin = props.filter.arrival_date;
			display.x_origin_start_time = Time(display.x_origin.toComponents().time);

			renderGrid();
		}
	});

	$scope.$watch('gridProps.filter.arrival_time', function(newValue, oldValue) {
		if(newValue !== oldValue) {
			clearRoomQuery($scope.gridProps.data);
			injectAvailableTimeSlots(Time({ 
									hours: $scope.gridProps.display.new_reservation_time_span 
								  }),
								  $scope.gridProps.filter,
								  $scope.gridProps.data);

			renderGrid();
		}
	});

	$scope.$watch('gridProps.filter.room_type', function(newValue, oldValue) {
		if(newValue !== oldValue) {
			clearRoomQuery($scope.gridProps.data);
			injectAvailableTimeSlots(Time({ 
									hours: $scope.gridProps.display.new_reservation_time_span 
								  }),
								  $scope.gridProps.filter,
								  $scope.gridProps.data);

			renderGrid();
		}
	});

	$scope.$watch('gridProps.filter.rate_type', function(newValue, oldValue) {
		if(newValue !== oldValue) {
			clearRoomQuery($scope.gridProps.data);
			injectAvailableTimeSlots(Time({ 
									hours: $scope.gridProps.display.new_reservation_time_span 
								  }),
								  $scope.gridProps.filter,
								  $scope.gridProps.data);

			renderGrid();
		}
	});
	/*--------------------------------------------------*/
	/*END INITIALIZATION METHOD IN PROTECTED SCOPE*/
	/*--------------------------------------------------*/

	function renderGrid(params) {
		var args = params || {};

 		React.renderComponent(
			DiaryContent(_.extend(args, $scope.gridProps)),
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

	function clearRoomQuery(data) {
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

	function determineAvailability(reservations, orig_reservation) {
		var range_validated = true, conflicting_reservation,
			maintenance_span = $scope.gridProps.display.maintenance_span_int * $scope.gridProps.display.px_per_int / $scope.gridProps.display.px_per_ms;

		if(_.isArray(reservations) && _.isObject(orig_reservation) || _.isUndefined(orig_reservation)) {
			reservations.forEach(function(reservation, idx) {
				var res_end_date = new Date(reservation.end_date.getTime() + maintenance_span),
					new_end_date = new Date(orig_reservation.end_date.getTime() + maintenance_span);

					if((orig_reservation.start_date > reservation.start_date && orig_reservation.start_date < res_end_date) ||
					   (reservation.start_date > orig_reservation.start_date && res_end_date < new_end_date) ||
					   (orig_reservation.start_date > reservation.start_date && new_end_date < res_end_date) ||
					   (new_end_date > reservation.start_date && new_end_date < res_end_date)) {

					   	conflicting_reservation = reservation;
						range_validated = false;

						return;
					}
				});
		}

		return [range_validated, conflicting_reservation];
	}

	function injectAvailableTimeSlots(time_span, filter, data) {
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
					start_date: new Date(start_date.getTime()),
					end_date: new Date(end_date.getTime()),
					room_type: room.type,
					rate: 'Not Defined',
					temporary: true
				};
			};

		data.forEach(function(item, idx) {
			var res = reservation(item, ++start_id, start, end),
				availability = determineAvailability(item.reservations, res).shift();

			if(availability[0]) { 
				item.reservations.push(res);
				updateRoomStatus(item, ''); //set room to available
			} else {
				updateRoomStatus(item, availability[1].status);
			}
		});	
	} 

	function updateRoomStatus(room, status) {
		room.status = status;
	}
}]);