sntRover.controller('RVDiaryCtrl', 
	[ 	'$scope', 
		'$rootScope', 
		'$filter', 
		'$window', 
		'ngDialog', 
		'rvDiarySrv', 
		'rvDiaryFilterSrv',
		'rvDiaryMetadata', 
		'rvDiaryUtilSrv',
		'payload',
	function($scope, 
			$rootScope, 
			$filter, 
			$window, 
			ngDialog, 
			rvDiarySrv, 
			rvDiaryFilterSrv,
			rvDiaryMetadata,
			rvDiaryUtilSrv,
			payload) {
	//'use strict';
	BaseCtrl.call(this, $scope);

	$scope.data 			= payload.rooms;
	$scope.stats 			= payload.stats;
	
	$scope.start_date 		= payload.start_date;
	$scope.start_time 		= payload.start_date.toComponents().time;
	$scope.arrival_times 	= payload.arrival_times;
	$scope.room_types 		= payload.room_types;

	$scope.selectedReservations = [];

	$scope.companySearchText = '';
	$scope.companyCardResults = [];

	/*DATE UI CONFIG*/
	$scope.dateOptions = {
    	showOn: 'button',
    	dateFormat: $rootScope.dateFormat,
    	numberOfMonths: 1,
    	minDate: new tzIndependentDate($rootScope.businessDate),
    	yearRange: '-0:'
    };

	/*--------------------------------------------------*/
	/*BEGIN INITIALIZATION METHOD IN PROTECTED SCOPE*/
	/*--------------------------------------------------*/

	/*Initial Values and Default Settings for React Grid*/
	/*Initialization of React/Angular hooks and callbacks*/
	/*Mock data currently in use*/
	(function() {	
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
				width: 						undefined,
				height: 					undefined,
				hours: 						48,
				row_height: 				60,
				row_height_margin: 			5,
				intervals_per_hour: 		4, 
				px_per_ms: 					undefined,
				px_per_int: 				undefined,
				px_per_hr: 					undefined,
				maintenance_span_int: 		2,    //OBSOLETE - REMOVE ALL OCCURRENCES OF THIS VALUE!!!!!!
				new_reservation_time_span: 	4 
			},
			meta: _.extend({}, rvDiaryMetadata), //Shallow copy metadata
			edit: {								 //Edit state and variables
				active: 					false,
				originalItem: 				undefined,
				originalRowItem: 			undefined
			},
			filter: {						//top filter
		    	arrival_date: 				$scope.start_date,
		    	enable_resize: 				false,
		    	arrival_time: 				$scope.start_time,
		    	hours_days: 				'h',
		    	range: 						12,
		    	rate_type: 					'Standard',
		    	rate_type_details: 			Object.create(null),
		    	room_type: 					undefined,
		    	show_all_rooms: 			'on',
		    	toggleHoursDays: function() {
		    		this.hours_days = (this.hours_days === 'h') ? 'd' : 'h';
		    	},
		    	toggleRange: function() {
		    		var hourFormat12 = ($scope.gridProps.viewport.hours === 12),
		    			props = $scope.gridProps;

		    		props.viewport = _.extend({}, props.viewport);
		    		props.display  = _.extend({}, props.display);

					props.viewport.hours = (hourFormat12) ? 24 : 12;
					props.display.row_height = (hourFormat12) ? 24 : 60;
					props.display.row_height_margin = (hourFormat12) ? 0 : 5;

					props.display.width 		= props.display.hours / props.viewport.hours * props.viewport.width;
					props.display.px_per_hr 	= props.viewport.width / props.viewport.hours;
					props.display.px_per_int 	= props.display.px_per_hr / props.display.intervals_per_hour;
					props.display.px_per_ms 	= props.display.px_per_int / 900000;

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
				}
		    },
		    data: $scope.data
		};

		/*_________________________________________________________*/
		/*BEGIN GIRD COMPONENT STANDARD EVENT HOOK INTERFACE -- */
		/*_________________________________________________________*/
		(function() {    /*React callbacks for grid events*/
			var prevRoom, prevTime;

		    $scope.onDragStart = function(room, reservation) {
		    	prevRoom = room;
		    	prevTime = reservation.start_time;

		    	if($scope.gridProps.edit.active) {
		    		console.log('Reservation room transfer initiated:  ', room, reservation);
		    	}
		    };

		    $scope.onDragEnd = function(nextRoom, reservation) {
		    	var availability;

		    	if($scope.gridProps.edit.active) {
			    	availability = determineAvailability(nextRoom.reservations, reservation).shift();

					if(availability) {
				    	reservationRoomTransfer(nextRoom, prevRoom, reservation);//, $scope.gridProps.edit.active);
					    
				    	$scope.gridProps.currentResizeItemRow = nextRoom;

				    	$scope.renderGrid();
				    }
				}
		    };
		})();

	    $scope.onResizeStart = function(row_data, row_item_data) {
			  	
	    };

	    $scope.onResizeEnd = function(row_data, row_item_data) {
	        	
	    };    

	    $scope.onScrollEnd = function(current_scroll_pos) {
	    	$scope.toggleRows($scope.gridProps.filter.show_all_rooms, current_scroll_pos);
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
			    		$scope.gridProps.edit.originalItem 		= rvDiaryUtilSrv.copyReservation(row_item_data);
			    		$scope.gridProps.edit.originalRowItem 	= rvDiaryUtilSrv.copyRoom(row_data);
			    		$scope.gridProps.currentResizeItem 		= rvDiaryUtilSrv.copyReservation(row_item_data);
			    		$scope.gridProps.currentResizeItemRow 	= rvDiaryUtilSrv.copyRoom(row_data);

			    		$scope.renderGrid();
			    	}

		    		break;	 
		    	} 
		    } else {
		    	copy = rvDiaryUtilSrv.copyReservation(row_item_data);

	    		copy.selected = selected;

	    		rvDiaryUtilSrv.updateReservation(row_data, copy);

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

	    $scope.editSave = function() {
	    	var props 			= $scope.gridProps,
	    		row_data 		= rvDiaryUtilSrv.copyRoom(props.currentResizeItemRow),
	    		row_item_data 	= rvDiaryUtilSrv.copyReservation(props.currentResizeItem);

	    	row_item_data.start_date 	= row_item_data.left / props.display.px_per_ms + props.display.x_origin;
	    	row_item_data.end_date 		= row_item_data.right / props.display.px_per_ms + props.display.x_origin; 

	    	$scope.roomXfer = {
	    		current: {
	    			room: 		 props.edit.originalRowItem,
	    			reservation: props.edit.originalItem
	    		},
	    		next: {
	    			room: 		 row_date,
	    			reservation: row_item_data
	    		}
	    	};

			ngDialog.open({
				template: 'assets/partials/diary/RVDiaryRoomTransferConfirmation.html',
				controller: 'RVDiaryRoomTransferConfirmationCtrl',
				scope: $scope
			});	    	
	    };

 		$scope.editCancel = function() {
	    	var props = $scope.gridProps;
	    	
	    	rvDiaryUtilSrv.reservationRoomTransfer(props.edit.originalRowItem, props.currentResizeItemRow, props.edit.originalItem);

	    	props.edit 					= _.extend({}, props.edit);
	    	props.edit.active 			= false;
	    	props.edit.originalItem 	= undefined;
	    	props.edit.originalRowItem 	= undefined;
	    	props.currentResizeItem 	= undefined;
	    	props.currentResizeItemRow 	= undefined;

	    	$scope.renderGrid();
	    };

        $scope.companySearchTextEntered = function() {
            if($scope.companySearchText.length === 1) {
                $scope.companySearchText = $scope.companySearchText.charAt(0).toUpperCase() + $scope.companySearchText.substr(1);
            } else if($scope.companySearchText.length > 2){
                displayFilteredResults();
            }
        };

	    $scope.toggleRows = function(state, current_scroll_pos) {
	    	$scope.gridProps.filter.show_all_rooms = state; //(state === 'on');

	    	if($scope.gridProps.filter.show_all_rooms === 'on') {
	    		rvDiaryUtilSrv.clearRowClasses();
	    	} else {
	    		updateRowClasses(current_scroll_pos);
			}

	    	$scope.renderGrid();
	    };

		var displayFilteredResults = _.debounce(function () {
             var paramDict = {
                    query: $scope.companySearchText.trim()
            	 };
          	
                $scope.invokeApi(rvDiaryFilterSrv.fetchCompanyCard, 
                				 paramDict, 
                				 function(data) {
                				 	$scope.$emit("hideLoader");
                    				$scope.companyCardResults = data.accounts;
                				 });
            
        }, 500);

		$scope.reserveRooms = function(row_data, row_item_data) {
			var props = $scope.gridProps;
			
			rvDiaryUtilSrv.updateReservation(row_data, row_item_data);

	    	props.edit 					= _.extend({}, props.edit);
	    	props.edit.active 			= false;
	    	props.currentResizeItem 	= undefined;
	    	props.currentResizeItemRow 	= undefined;

	    	$scope.renderGrid();
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

	    function updateRowClasses(current_scroll_pos) {
	    	var reservations,
	    		reservation,
	    		meta = $scope.gridProps.meta,
	    		data = $scope.data,
	    		display = $scope.gridProps.display,
	    		maintenance_span = display.maintenance_span_int * display.px_per_int / display.px_per_ms,
	    		maintenance_end_date; 

	    	current_scroll_pos = parseInt(current_scroll_pos, 10);

	    	for(var i = 0, len = data.length; i < len; i++) {
	    		reservations = data[i][meta.room.row_children];

	    		for(var j = 0, rlen = reservations.length; j < rlen; j++) {
	    			reservation = reservations[j];
	    			maintenance_end_date = reservation[meta.occupancy.end_date] + maintenance_span;

	    			if(current_scroll_pos >= reservation[meta.occupancy.start_date] && 
	    			   current_scroll_pos <= reservation[meta.occupancy.end_date]) {

	    				data[i] = rvDiaryUtilSrv.copyRoom(data[i]);

	    				switch(angular.lowercase(reservation[meta.occupancy.status])) {
	    					case 'inhouse':
	    					case 'check-in':
	    					case 'check-out':
	    						data[i][meta.room.status] = 'occupied';
	    					break;	
	    				}
	    				
	    				break;
	    			} else if(current_scroll_pos > reservation.end_date && 
	    			   		  current_scroll_pos <= maintenance_end_date) {
	    				
	    				data[i] = rvDiaryUtilSrv.copyRoom(data[i]);
	    				data[i][meta.room.status] = 'dirty';

	    				break;
	    			} else {
	    				data[i] = rvDiaryUtilSrv.copyRoom(data[i]);
	    				data[i][meta.room.status] = '';
	    			}
	    		}
	    	}

	    	//console.log('Room status refresh time', Date.now() - time_start);
	    }

	    $scope.displayFilter = function(filter, room, reservation) {
			var meta = $scope.gridProps.meta;

	    	if($scope.isAvailable(room, reservation)) {
	    		if(angular.lowercase(filter.room_type) === 'all' || 
	    		   filter.room_type === reservation[meta.occupancy.room_type]) {
	    			return true;
	    		} else {
	    			return false;
	    		}
	    	} else {
	    		return true;
	    	}
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
		var filter = $scope.gridProps.filter,
            x_0, 
            x_N; 

		if(newValue !== oldValue) {
			x_0 = new Date(filter.arrival_date.getTime() - 7200000);
			x_N = new Date(filter.arrival_date.getTime() + 86400000);

			$scope.gridProps.display = _.extend({}, $scope.gridProps.display);

			$scope.gridProps.display.x_origin 			 = x_0.getTime(); //filter.arrival_date.getTime();
			$scope.gridProps.display.x_origin_start_time = x_N.toComponents().time; //filter.arrival_date.toComponents().time;

			rvDiarySrv.fetchOccupancy(x_0, x_N).then(function() {
				return rvDiaryFilterSrv.fetchArrivalTimes(x_0.toComponents().time, 15);
			})
			.then(function(data) {
				 $scope.arrival_times = data;
				$scope.renderGrid();		
			});	
		}
	});

	$scope.$watch('gridProps.filter.arrival_time', function(newValue, oldValue) {
		if(newValue !== oldValue) {
			if(!$scope.gridProps.edit.active) {
				updateFilter();
			}
		}
	});

	$scope.$watch('gridProps.filter.room_type', function(newValue, oldValue) {
		if(newValue !== oldValue) {
			if (!$scope.gridProps.edit.active) {
				updateFilter();
			}
		}
	});

	$scope.$watch('gridProps.filter.rate_type', function(newValue, oldValue) {
		if(newValue !== oldValue) {
			if (!$scope.gridProps.edit.active) {
				updateFilter();
			}			
		}
	});
	/*--------------------------------------------------*/
	/*END INITIALIZATION METHOD IN PROTECTED SCOPE*/
	/*--------------------------------------------------*/

	function updateFilter(display, filter, data) {	
		filter = _.extend({}, filter);

		rvDiaryUtilSrv.clearRoomQuery(data);

		injectAvailableTimeSlots(Time({ 
									hours: display.new_reservation_time_span }),
							     filter,
							     data);
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
			rt_filter = filter.room_type,
			rt_keys = (_.isObject(rt_filter) ? (rt_filter.id !== 'All' ? [rt_filter.id] : Object.keys($scope.room_types)) : '');

		rvDiarySrv.fetchAvailability(start, end, 377, rt_keys)
		.then(function(data) {
			console.log(data);



			$scope.renderGrid();
		});
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

	/*function reservationRoomTransfer(nextRoom, room, reservation) { //, commit) {
		var oldRoom, 
			newRoom, 
			idxOldRoom, 
			idxNewRoom, 
			meta = $scope.gridProps.meta,
			rc_meta = meta.room.row_children;

		oldRoom = rvDiaryUtilSrv.copyRoom(room);

		if(nextRoom.id !== room.id) {
			newRoom = rvDiaryUtilSrv.copyRoom(nextRoom);

			rvDiaryUtilSrv.removeReservation(oldRoom, reservation);

			newRoom[rc_meta].push(rvDiaryUtilSrv.copyReservation(reservation));
		} else {
			rvDiaryUtilSrv.updateReservation(oldRoom, reservation);
		}

		idxOldRoom = rvDiaryUtilSrv.roomIndex(oldRoom);
		idxNewRoom = rvDiaryUtilSrv.roomIndex(newRoom);

		//if(commit) {
		if(idxOldRoom > -1 && idxOldRoom < $scope.data.length) {
			$scope.data[idxOldRoom] = oldRoom;
		}

		if(idxNewRoom > -1 && idxNewRoom < $scope.data.length) {
			$scope.data[idxNewRoom] = newRoom;
		}
	}*/

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

	/*function injectAvailableTimeSlots(time_span, filter, data) {
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
			//start_id = getMaxId(-1, $scope.data, 0),
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
	} */
}]);