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
				row_children: 'reservations',
				start_date: 'start_date',
				end_date: 'end_date'
			},
			edit: {
				active: false,
				originalItem: undefined,
				originalRowItem: undefined
			},
			filter: {
		    	arrival_date: $scope.start_date,
		    	enable_resize: false,
		    	arrival_time: undefined,
		    	hours_days: 'h',
		    	range: 12,
		    	rate_type: 'Standard',
		    	rate_type_details: {},
		    	room_type: undefined,
		    	toggleHoursDays: function() {
		    		this.hours_days = (this.hours_days === 'h') ? 'd' : 'h';
		    	},
		    	toggleRange: function() {
		    		var hourFormat12 = ($scope.gridProps.viewport.hours === 12);

		    		$scope.gridProps.viewport = _.extend({}, $scope.gridProps.viewport);
		    		$scope.gridProps.display = _.extend({}, $scope.gridProps.display);

					$scope.gridProps.viewport.hours = (hourFormat12) ? 24 : 12;
					$scope.gridProps.display.row_height = (hourFormat12) ? 24 : 60;
					$scope.gridProps.display.row_height_margin = (hourFormat12) ? 0 : 5;

					$scope.gridProps.display.width 		= $scope.gridProps.display.hours / $scope.gridProps.viewport.hours * $scope.gridProps.viewport.width;
					$scope.gridProps.display.px_per_hr 	= $scope.gridProps.viewport.width / $scope.gridProps.viewport.hours;
					$scope.gridProps.display.px_per_int = $scope.gridProps.display.px_per_hr / $scope.gridProps.display.intervals_per_hour;
					$scope.gridProps.display.px_per_ms 	= $scope.gridProps.display.px_per_int / 900000;

					$scope.renderGrid(); 
				},
				toggleRates: function() {
					var rateMenu = $('.faux-select-options');

					if(rateMenu.length > 0) {
						if(rateMenu.hasClass('hidden')) {
							rateMenu.removeClass('hidden');
						}else {
							rateMenu.addClass('hidden');
						}
					}

					//this.rate_type = (this.rate_type === 'standard') ? 'corporate' : 'standard';
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

		    	console.log('Reservation room transfer initiated:  ', room, reservation);
		    };

		    $scope.onDragEnd = function(nextRoom, reservation) {
		    	var availability;

		    	availability = determineAvailability(nextRoom.reservations, reservation).shift();

				if(availability) {
			    	reservationRoomTransfer(nextRoom, prevRoom, reservation);//, $scope.gridProps.edit.active);
				    
			    	$scope.gridProps.currentResizeItemRow = nextRoom;

			    	$scope.renderGrid();
			    }
		    };
		})();

	    $scope.onResizeStart = function(row_data, row_item_data) {
			console.log('Resize start', room, reservation);	    	
	    };

	    $scope.onResizeEnd = function(row_data, row_item_data) {
	    	console.log('Resize end', room, reservation);	    	
	    };    

	    $scope.onScrollLoadTriggerRight = function(component, data, event) {

	    };

	    $scope.onScrollLoadTriggerLeft = function(component) {
			
	    };

	    $scope.onSelect = function(row_data, row_item_data, selected, command_message) {
	    	var copy;

	    	if(!$scope.isAvailable(undefined, row_item_data)) {
		    	switch(command_message) {
		    		case 'edit': 

		    		if(!$scope.gridProps.edit.active) {
			    		$scope.gridProps.edit 					= _.extend({}, $scope.gridProps.edit);
			    		$scope.gridProps.edit.active 			= true;
			    		$scope.gridProps.edit.originalItem 		= copyReservation(row_item_data);
			    		$scope.gridProps.edit.originalRowItem 	= copyRoom(row_data);
			    		$scope.gridProps.currentResizeItem 		= copyReservation(row_item_data);
			    		$scope.gridProps.currentResizeItemRow 	= copyRoom(row_data);

			    		$scope.renderGrid();
			    	}

		    		break;	 
		    	} 
		    } else {
		    	copy = copyReservation(row_item_data);

	    		copy.selected = selected;

	    		updateReservation(row_data, copy);

		    	$scope.renderGrid();

		    	if($scope.isSelected(row_data, copy)) {
		    		$scope.selectedReservations.push({ room: row_data, reservation: copy });
		    	} else {
		    		(function() {
		    			var i, len = $scope.selectedReservations.length;

		    			for(i = 0; i < len; i++) {
		    				if($scope.selectedReservations.reservation.id === copy.id) {
		    					$scope.selectedReservations.splice(i, 1);
		    					return;
		    				}
		    			}
		    		})();
		    	}
		    }
	    };
	    /*_________________________________________________________*/
		/*END PROTOTYPE EVENT HOOKS -- */
		/*_________________________________________________________*/

		$scope.renderGrid = function(params) {
			var args = params || {};

	 		React.renderComponent(
				DiaryContent(_.extend(args, $scope.gridProps)),
				document.getElementById('component-wrapper')
			);	
		};

	    $scope.isSelected = function(room, reservation) {
	    	return _.isBoolean(reservation.selected) && reservation.selected;
	    };

	    $scope.isAvailable = function(room, reservation) {
	    	return Object.prototype.hasOwnProperty.call(reservation, 'temporary') && reservation.temporary === true;
	    };

	    $scope.isDraggable = function(row_item_data) {
	    	return !$scope.isAvailable(undefined, row_item_data);
	    };

	    $scope.isResizable = function(row_item_data) {

	    };

	    $scope.toggleRows = function(state, current_scroll_pos) {
	    	var showAllRooms = (state === 'on');

	    	if(showAllRooms) {
	    		clearRowClasses();
	    	} else {
	    		updateRowClasses(current_scroll_pos);
			}

	    	$scope.renderGrid();
	    };

	    function clearRowClasses() {
	    	for(var i = 0, len = $scope.data.length; i < len; i++) {
	    		$scope.data[i] = copyRoom($scope.data[i]);
	    		$scope.data[i].status = '';
	    	}
	    }

	    function updateRowClasses(current_scroll_pos) {
	    	var reservations,
	    		reservation,
	    		maintenance_span = $scope.gridProps.display.maintenance_span_int * $scope.gridProps.display.px_per_int;

	    	current_scroll_pos = parseInt(current_scroll_pos, 10);

	    	for(var i = 0, len = $scope.data.length; i < len; i++) {
	    		reservations = $scope.data[i].reservations;

	    		for(var j =0, rlen = reservations.length; j < rlen; j++) {
	    			reservation = reservations[j];

	    			if(current_scroll_pos >= reservation.start_date && 
	    			   current_scroll_pos <= reservation.end_date) {

	    				$scope.data[i] = copyRoom($scope.data[i]);

	    				switch(angular.lowercase(reservation.status)) {
	    					case 'inhouse':
	    					case 'check-in':
	    					case 'check-out':
	    						$scope.data[i].status = 'occupied';
	    					break;	
	    				}
	    			} else if(current_scroll_pos > reservation.end_date && 
	    			   		  current_scroll_pos <= (reservation.end_date + maintenance_span)) {
	    				
	    				$scope.data[i] = copyRoom($scope.data[i]);
	    				$scope.data[i].status = 'dirty';
	    			} 
	    		}
	    	}
	    }

	    $scope.displayFilter = function(filter, room, reservation) {
	    	if($scope.isAvailable(room, reservation)) {
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

	    $scope.editSave = function() {
	    	var props = $scope.gridProps,
	    		row_data = copyRoom(props.currentResizeItemRow),
	    		row_item_data = copyReservation(props.currentResizeItem);

	    	row_item_data.start_time = new Date(row_item_data.left / props.display.px_per_ms + props.display.x_origin);
	    	row_item_data.end_time = new Date(row_item_data.right / props.display.px_per_ms + props.display.x_origin); 

	    	updateReservation(row_data, row_item_data);

	    	props.edit = _.extend({}, props.edit);
	    	props.edit.active = false;
	    	props.currentResizeItem = undefined;
	    	props.currentResizeItemRow = undefined;

	    	$scope.renderGrid();
	    };

	    $scope.editCancel = function() {
	    	var props = $scope.gridProps;
	    	
	    	reservationRoomTransfer(props.edit.originalRowItem, props.currentResizeItemRow, props.edit.originalItem);

	    	props.edit = _.extend({}, $scope.gridProps.edit);
	    	props.edit.active = false;
	    	props.edit.originalItem = undefined;
	    	props.edit.originalRowItem = undefined;
	    	props.currentResizeItem = undefined;
	    	props.currentResizeItemRow = undefined;

	    	$scope.renderGrid();
	    };
	})();

	/*WATCHERS*/
	$scope.$watch('selectedReservations.length', function(newValue, oldValue) {
		if(newValue > oldValue) {
			ngDialog.open({
				template: 'assets/partials/diary/rvDiaryConfirmation.html',
				controller: 'RVDiaryConfirmationCtrl',
				scope: $scope
			});
		}
	});

	$scope.$watch('gridProps.filter.arrival_date', function(newValue, oldValue) {
		if(newValue !== oldValue) {
			$scope.gridProps.display = _.extend({}, $scope.gridProps.display);

			$scope.gridProps.display.x_origin = $scope.gridProps.filter.arrival_date.getTime();
			$scope.gridProps.display.x_origin_start_time = Time($scope.gridProps.display.x_origin.toComponents().time);

			$scope.renderGrid();
		}
	});

	$scope.$watch('gridProps.filter.arrival_time', function(newValue, oldValue) {
		if(newValue !== oldValue) {
			updateFilter();
			$scope.renderGrid();
		}
	});

	$scope.$watch('gridProps.filter.room_type', function(newValue, oldValue) {
		if(newValue !== oldValue) {
			updateFilter();
			$scope.renderGrid();
		}
	});

	$scope.$watch('gridProps.filter.rate_type', function(newValue, oldValue) {
		if(newValue !== oldValue) {
			updateFilter();
			$scope.renderGrid();
		}
	});
	/*--------------------------------------------------*/
	/*END INITIALIZATION METHOD IN PROTECTED SCOPE*/
	/*--------------------------------------------------*/

	function updateFilter() {
		$scope.gridProps.filter = _.extend({}, $scope.gridProps.filter);

		clearRoomQuery($scope.gridProps.data);
		injectAvailableTimeSlots(Time({ 
								hours: $scope.gridProps.display.new_reservation_time_span 
							  }),
							  $scope.gridProps.filter,
							  $scope.gridProps.data);
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

	function reservationRoomTransfer(nextRoom, room, reservation) { //, commit) {
		var oldRoom, newRoom, idxOldRoom, idxNewRoom;

		oldRoom = copyRoom(room);

		if(nextRoom.id !== room.id) {
			newRoom = copyRoom(nextRoom);

			removeReservation(oldRoom, reservation);

			newRoom.reservations.push(copyReservation(reservation));
		} else {
			updateReservation(oldRoom, reservation);
		}

		idxOldRoom = roomIndex(oldRoom);
		idxNewRoom = roomIndex(newRoom);

		//if(commit) {
		if(idxOldRoom > -1 && idxOldRoom < $scope.data.length) {
			$scope.data[idxOldRoom] = oldRoom;
		}

		if(idxNewRoom > -1 && idxNewRoom < $scope.data.length) {
			$scope.data[idxNewRoom] = newRoom;
		}
		//}
	}

	function findRoom(room) {
		return _.findWhere($scope.data, { id: room.id });
	}

	function roomIndex(room) {
		var idx = -1;

		if(room) {
			for(var i = 0, len = $scope.data.length; i < len; i++){
				if($scope.data[i].id === room.id) {
					idx = i;
					return idx;
				}
			}
		}

		return idx;
	}

	function reservationIndex(room, reservation) {
		var idx = -1;

		for(var i = 0, len = room.reservations.length; i < len; i++) {
			if(room.reservations[i].id === reservation.id) {
				idx = i;
				return idx;
			}
		}

		return idx;		
	}

	function copyReservation(reservation) {
		//var newReservation = _.extend({}, reservation);

		//newReservation.start_date = new Date(newReservation.start_date);
		//newReservation.end_date = new Date(newReservation.end_date);

		return _.extend({}, reservation);
	}

	function copyRoom(room) {
		var newRoom = { reservations: [] },
			resLen = (_.isArray(room.reservations) ? room.reservations.length : 0);

		_.extend(newRoom, room);

		newRoom.reservations = [];

		for(var i = 0; i < resLen; i++) {
			newRoom.reservations.push(copyReservation(room.reservations[i]));
		}

		return newRoom;
	}

	function updateRoomStatus(room, status) {
		room.status = status;
	}

	function updateReservation(room, reservation) {
		var idx = reservationIndex(room, reservation);
	
		if(idx > -1) {
			room.reservations[idx] = reservation;
		}		
	}

	function removeReservation(room, reservation) {
		//var res = _.findWhere(room.reservations, { id: reservation.id });
		var idx = reservationIndex(room, reservation);
	
		if(idx > -1) {
			return room.reservations.splice(idx, 1);
		}

		return;	
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
			topOfStack,
			newData = [];

		data.forEach(function(item) {
			if(_.isArray(item.reservations)) {
				topOfStack = _.last(item.reservations);

				if(topOfStack && hop.call(topOfStack, 'temporary')) {
					item.reservations.pop();
				}
			}
		});

		for(var i = 0; i < data.length; i++) {
			newData[i] = copyRoom(data[i]);
		}
	}

	function determineAvailability(reservations, orig_reservation) {
		var range_validated = true, conflicting_reservation,
			maintenance_span = $scope.gridProps.display.maintenance_span_int * $scope.gridProps.display.px_per_int / $scope.gridProps.display.px_per_ms;

			reservations.forEach(function(reservation, idx) {
				var res_end_date = reservation.end_date + maintenance_span,
					new_end_date = orig_reservation.end_date + maintenance_span;

				if(reservation.id !== orig_reservation.id) {
					if((orig_reservation.start_date >= reservation.start_date && orig_reservation.start_date <= res_end_date) ||
					   (reservation.start_date >= orig_reservation.start_date && res_end_date <= new_end_date) ||
					   (orig_reservation.start_date >= reservation.start_date && new_end_date <= res_end_date) ||
					   (new_end_date >= reservation.start_date && new_end_date <= res_end_date)) {

					   	conflicting_reservation = reservation;
						range_validated = false;

						return;
					}
				}
			});
		

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
					start_date: start_date.getTime(),
					end_date: end_date.getTime(),
					room_type: room.type,
					rate: 'Not Defined',
					temporary: true
				};
			};

		data.forEach(function(item, idx) {
			var res = reservation(item, ++start_id, start, end),
				availability = determineAvailability(item.reservations, res);

			if(availability[0]) { 
				
				data[idx] = copyRoom(item);
				data[idx].reservations.push(res);

				updateRoomStatus(data[idx], ''); //set room to available
			} else {
				updateRoomStatus(item, availability[1].status);
			}
		});	
	} 
}]);