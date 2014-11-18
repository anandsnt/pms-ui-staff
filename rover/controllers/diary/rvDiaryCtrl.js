sntRover
.controller('rvDiaryCtrl', 
	[ 	'$scope', 
		'$rootScope',
		'$state',
		'$stateParams', 
		'$filter', 
		'$window', 
		'ngDialog', 
		//'RVCompanyCardSrv', 
		'RMFilterOptionsSrv',
		'RVGuestCardSrv',
		'rvDiarySrv', 
		'rvDiaryMetadata',
		'rvDiaryUtil',
		'payload',
		'$vault',
	function($scope, 
			 $rootScope, 
			 $state,
			 $stateParams, 
			 $filter, 
			 $window, 
			 ngDialog, 
			 RMFilterOptionsSrv, 
			 RVGuestCardSrv,
			 rvDiarySrv, 
			 meta, 
			 util, 
			 payload,
			 $vault) {

	$scope.$emit('hideLoader');

	BaseCtrl.call(this, $scope);

	$scope = _.extend($scope, payload); //copy incoming data on load

	$scope.data 		 = $scope.room;
	$scope.stats 		 = $scope.availability_count;
	$scope.room_types 	 = $scope.room_type;
	$scope.room_types.unshift({ id: 'All', name: 'All', description: 'All' });

	$scope.selectedReservations = [];

	$scope.companySearchText = '';
	$scope.companyCardResults = [];

	/*--------------------------------------------------*/
	/* BEGIN UTILITY METHOD SECTION */
	/*--------------------------------------------------*/
	function responseError(err) {
		console.log(err);
	}
	/*--------------------------------------------------*/
	/*BEGIN CONFIGURATION 
	/*--------------------------------------------------*/
	/*DATE UI CONFIG*/
		$scope.dateOptions = {
	    	showOn: 'button',
	    	dateFormat: $rootScope.dateFormat,
	    	numberOfMonths: 1,
	    	minDate: new tzIndependentDate($rootScope.businessDate),
	    	yearRange: '-0:'
	    };

	/*Initial Values and Default Settings for React Grid*/
	/*Initialization of React/Angular hooks and callbacks*/
		$scope.gridProps = {
			viewport: {
				hours: 						12,
				width: 						angular.element($window).width() - 120,
				height: 					angular.element($window).height() - 230,
				row_header_right: 			120, 
				timeline_header_height: 	80,
				timeline_height: 			60,
				timeline_occupancy_height: 	20,
				timeline_header_bottom: 	230,
				element: function() {
					return $('.diary-grid .wrapper');
				}
			},
			display: {
				x_0: 						undefined,
				x_nL:                       $scope.past_date.getTime(),
				x_nL_time:                  $scope.past_date.toComponents().time.convertToReferenceInterval(15),
				x_nR: 	                    $scope.end_date.getTime(),
				x_nR_time:                  $scope.end_date.toComponents().time.convertToReferenceInterval(15),
				width: 						undefined,
				height: 					undefined,
				hours: 						50,
				row_height: 				60,
				row_height_margin: 			5,
				intervals_per_hour: 		4, 
				px_per_ms: 					undefined,
				px_per_int: 				undefined,
				px_per_hr: 					undefined,
				new_reservation_time_span: 	$scope.min_hours
			},
			meta: 							meta, 
			edit: {								
				active: 					false,
				passive:                    false, 
				group_id:    				undefined,
				resizing:                   { enabled: false },
				dragging:     				{ enabled: false, direction: ['h', 'v'] },
				originalItem: 				undefined,
				originalRowItem: 			undefined
			},
			filter: {						//top filter
		    	arrival_date: 				$scope.start_date,
		    	enable_resize: 				false,
		    	arrival_time: 				$scope.arrival_time,
		    	hours_days: 				'h',
		    	range: 						12,
		    	rate_type: 					'Standard',
		    	rate_type_details: 			[],
		    	rate:                        undefined,
		    	room_type: 					($scope.room_type_id) ? rvDiarySrv.data_Store.get('_room_type.values.id')[$scope.room_type_id] : undefined,
		    	show_all_rooms: 			'on',
		    	toggleHoursDays: function() {
		    		this.hours_days = (this.hours_days === 'h') ? 'd' : 'h';

		    		if(this.hours_days === 'd') {
		    			$state.go('rover.reservation.search', {
		    				fromState: 'DIARY'
		    			});
		    		}
		    	},
		    	toggleRange: function() {
		    		var hourFormat12 = ($scope.gridProps.viewport.hours === 12),
		    			props = $scope.gridProps;

		    		props.viewport = _.extend({}, props.viewport);
		    		props.display  = _.extend({}, props.display);

					props.viewport.hours 			= (hourFormat12) ? 24 : 12;
					props.display.row_height 		= (hourFormat12) ? 24 : 60;
					props.display.row_height_margin = (hourFormat12) ? 0 : 5;

					props.display.width 		= props.display.hours / props.viewport.hours * props.viewport.width;
					props.display.height        = props.display.row_height + props.display.row_height_margin;
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
		    data: $scope.data,
		    stats: $scope.stats
		};

		/*_________________________________________________________*/
		/*BEGIN GRID COMPONENT STANDARD EVENT HOOK INTERFACE -- */
		/*_________________________________________________________*/
		(function() {    /*React callbacks for grid events*/
			var prevRoom, prevTime;

		    $scope.onDragStart = function(room, reservation) {
		    	prevRoom = room;
		    	prevTime = reservation[meta.occupancy.start_date];

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
	    	rvDiarySrv.Availability.apply(this, $scope.getArrivalTimes()) 
	    	.then(function(data) {
	    		console.log(data);
	    		console.log(rvDiarySrv.data_Store.get('_room.values.id'));
	    	}, function(err) {
	    		console.log(err);
	    	});
	    };    

	    $scope.onScrollEnd = function(current_scroll_pos) {
	    	$scope.toggleRows($scope.gridProps.filter.show_all_rooms, current_scroll_pos);
	    };

	    /* FOR LATER USE
	    $scope.onScrollLoadTriggerRight = function(component, data, event) {

	    };
			FIR LATER USE
	    $scope.onScrollLoadTriggerLeft = function(component) {
			
	    };*/

	    $scope.onSelect = function(row_data, row_item_data, selected, command_message) {
	    	var copy,
	    		selection,
	    		props = $scope.gridProps,
	    		edit  = props.edit;

	    	if(!$scope.isAvailable(undefined, row_item_data)) {
		    	switch(command_message) {

		    		case 'edit': 
			    		if(!edit.active) {
				    		$scope.initActiveEditMode({ 
				    			row_data: row_data, 
				    			row_item_data: row_item_data 
				    		});

				    		$scope.renderGrid();
				    	}

		    		break;	 
		    	} 
		    } else {
		    	copy = util.shallowCopy({}, row_item_data);
	    		copy.selected = selected;

	    		util.updateReservation(row_data, copy);
		    	
		    	$scope.renderGrid();

		    	if($scope.isSelected(row_data, copy)) {
		    		$scope.selectedReservations.push({ room: row_data, occupancy: copy });
		    	} else {
		    		(function() {
		    			var i = 0, len = $scope.selectedReservations.length;

		    			for(; i < len; i++) {
		    				if($scope.selectedReservations[i].occupancy.key  === copy.key) {
		    					return $scope.selectedReservations.splice(i, 1);
		    				}
		    			}
		    		})();
		    	}
		    }
	    };

		$scope.confirmRateSelection = function(idx) {
			var details = $scope.gridProps.filter.rate_type_details;


		};

		$scope.discardRateSelection = function(idx) {
			var details = $scope.gridProps.filter.rate_type_details;


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
	    		util.clearRowClasses($scope.gridProps.data);
	    	} else {
	    		updateRowClasses(current_scroll_pos);
			}

	    	$scope.renderGrid();
	    };

		var displayFilteredResults = _.debounce(function () {
			var DS = rvDiarySrv.data_Store;

        	RMFilterOptionsSrv.fetchCompanyCard({ 
        		query: $scope.companySearchText.trim() 
        	})
            .then(function(data) {
            	var applicable_accounts = _.filter(data.accounts, function(account) {
            		var contract = account.current_contract,
            			hourly_rates;

            		if(_.isObject(contract) && _.has(contract, 'id')) {
            			hourly_rates = DS.get('__rates.groups.values.is_hourly_rate.true');

            			return _.findWhere(hourly_rates, { id: contract.id });
            		}
            	});

				$scope.gridProps.filter.rate_type_details = applicable_accounts;//companyCardResults = data.accounts;
            }, responseError);  
        }, 500);

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
	    	//return Object.prototype.hasOwnProperty.call(reservation, 'temporary') && reservation.temporary === true;
	    	return angular.lowercase(reservation[meta.occupancy.status]) === 'available';
	    };

	    $scope.isDraggable = function(row_item_data) {
	    	return !$scope.isAvailable(undefined, row_item_data);
	    };

	    $scope.isResizable = function(row_item_data) {
	    	var m_status = meta.status;

	    	if(row_item_data) {
	    		if(angular.lowercase(row_item_data[m_status]) === 'check-in') {
	    			return {
	    				resizable: true,
	    				arrival: false,
	    				departure: true
	    			};
	    		} else{
	    			return {
	    				resizable: true,
	    				arrival: true,
	    				departure: true
	    			};	    			
	    		}
	    	}
	    };

	    function updateRowClasses(current_scroll_pos) {
	    	var reservations,
	    		reservation,
	    		meta 				= $scope.gridProps.meta,
	    		data 				= $scope.data,
	    		display 			= $scope.gridProps.display,
	    		//maintenance_span 	= display.maintenance_span_int * display.px_per_int / display.px_per_ms,
	    		maintenance_end_date; 

	    	current_scroll_pos = parseInt(current_scroll_pos, 10);

	    	for(var i = 0, len = data.length; i < len; i++) {
	    		reservations = data[i][meta.room.row_children];

	    		for(var j = 0, rlen = reservations.length; j < rlen; j++) {
	    			reservation = reservations[j];
	    			maintenance_span = reservation[meta.occupancy.maintenance];
	    			maintenance_end_date = reservation[meta.occupancy.end_date] + maintenance_span;

	    			if(current_scroll_pos >= reservation[meta.occupancy.start_date] && 
	    			   current_scroll_pos <= reservation[meta.occupancy.end_date]) {

	    				data[i] = util.copyRoom(data[i]);

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
	    				
	    				data[i] = util.copyRoom(data[i]);
	    				data[i][meta.room.status] = 'dirty';

	    				break;
	    			} else {
	    				data[i] = util.copyRoom(data[i]);
	    				data[i][meta.room.status] = '';
	    			}
	    		}
	    	}

	    	//console.log('Room status refresh time', Date.now() - time_start);
	    }
		
		$scope.initActiveEditMode = (function(meta, util, data) {
			if(this.edit.passive) {
				throw Error('Active/Passive edit mode mutually exclusive.');
			}

			this.edit 					= util.deepCopy(this.edit);
			this.edit.active 			= true;
			this.edit.passive  			= false;
			this.edit.originalItem 		= util.copyReservation(data.row_item_data);
			this.edit.originalRowItem 	= util.copyRoom(data.row_data);
			this.currentResizeItem 		= util.copyReservation(data.row_item_data);
			this.currentResizeItemRow 	= util.copyRoom(data.row_data);
		}).bind($scope.gridProps, meta, util);

		$scope.initPassiveEditMode = (function (meta, util, data) {
			if(data.row_item_data) {
				if(this.edit.active) { 
					throw Error('Active/Passive edit mode mutually exclusive.');
				}

				this.edit 					= util.deepCopy(this.edit);
				this.edit.active 			= false;
				this.edit.passive 			= true;
				this.edit.mode 				= data.row_item_data[meta.occupancy.id];
				this.currentResizeItem 		= util.copyReservation(data.row_item_data);
				this.currentResizeItemRow 	= util.copyRoom(data.row_data);		
			}
		}).bind($scope.gridProps, meta, util);

	    $scope.editSave = function() {
	    	var props 			= $scope.gridProps,
	    		row_data 		= util.copyRoom(props.currentResizeItemRow),
	    		row_item_data 	= util.copyReservation(props.currentResizeItem),
	    		px_per_ms 		= props.display.px_per_ms,
	    		x_origin 		= props.display.x_origin;

	    	row_item_data[meta.occupancy.start_date] = row_item_data.left / px_per_ms + x_origin;
	    	row_item_data[meta.occupancy.end_date] 	 = row_item_data.right / px_per_ms + x_origin; 

	    	$scope.roomXfer = {
	    		current: {
		    		room: 		 edit.originalRowItem,
		    		reservation: edit.originalItem
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
	    	
	    	util.reservationRoomTransfer($scope.gridProps.data, props.edit.originalRowItem, props.currentResizeItemRow, props.edit.originalItem);

	    	$scop.resetEdit();
	    	$scope.renderGrid();
	    };

	    $scope.resetEdit = function() { 
			$scope.gridProps.edit = util.deepCopy($scope.gridProps.edit);

			$scope.gridProps.edit.active = false;
			$scope.gridProps.edit.passive = false;
			$scope.gridProps.mode = undefined;
			$scope.gridProps.currentResizeItem = undefined;
			$scope.gridProps.currentResizeItemRow = undefined;
			$scope.gridProps.edit.currentResizeItem = undefined;    //Planned to transfer the non-namespaced currentResizeItem/Row to here
			$scope.gridProps.edit.currentResizeItemRow = undefined; //Planned to transfer the non-namespaced currentResizeItem/Row to here
	    };

	   	$scope.clearAvailability = function() {
			var rooms = $scope.data,
				room,
                m_status = meta.occupancy.status,
				reject = function(child) {
					return $scope.isAvailable(undefined, child); //angular.lowercase(child[m_status]) === 'available'; 
				};

			for(var i = 0, len = rooms.length; i < len; i++) {
				room 			= rooms[i];
				room.occupancy 	= _.reject(room.occupancy, reject);	
				room 			= util.deepCopy(room);							 
			}
		};

	    $scope.Availability = function() {	
    		$scope.clearAvailability();
			$scope.resetEdit();
			$scope.renderGrid();
	
			rvDiarySrv.Availability.apply(this, $scope.getArrivalTimes()) 
			.then(function(data) {
				var row_item_data = data.length > 0 ? data[0]: undefined,
					start_date = new Date(row_item_data[meta.occupancy.start_date]),
					end_date = new Date(row_item_data[meta.occupancy.end_date]);

				if(row_item_data) { 
					$scope.initPassiveEditMode({
	                    start_date:     start_date,
	                    end_date:       end_date,
	                    stay_dates:     start_date.toComponents().date.toDateString(),
	                    row_data:       rvDiarySrv.data_Store.get('_room.values.id')[row_item_data.room_id],
	                    row_item_data:  row_item_data
	                });
				}

				$scope.renderGrid();
			}, responseError);
		};

	$scope.getArrivalTimes = function() {
		function parseArrivalTime(arrival_time, bNextDay) {
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

		var filter = _.extend({}, $scope.gridProps.filter),
			time_span = Time({ hours: $scope.min_hours }),
			start_date = filter.arrival_date,
			start_time = parseArrivalTime(filter.arrival_time),
			start = new Date(start_date.getFullYear(),
							 start_date.getMonth(),
							 start_date.getDate(),
							 start_time.hours,
							 start_time.minutes, 
							 0, 0),
			end = new Date(start.getFullYear(),
						   start.getMonth(),
						   start.getDate(),
						   start.getHours()  + time_span.hours,
						   start.getMinutes() + time_span.minutes,
						   0, 0),
			rt_filter = _.isEmpty(filter.room_type) ? undefined : filter.room_type.id;

		return [
			start,
			end,
			rt_filter
		];
	};

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
		var props = $scope.gridProps,
			filter 	= props.filter,
			arrival_ms = filter.arrival_date.getTime(),
			time_set; 

		if(newValue !== oldValue) {	
            time_set = util.gridTimeComponents(arrival_ms, 50, $scope.gridProps.display);

            $scope.gridProps.display = time_set.display;

			$scope.renderGrid();

			if($scope.gridProps.edit.active || $scope.gridProps.edit.passive) {
				$scope.Availability();
			}

			rvDiarySrv.Occupancy(new Date(time_set.x_nL.setHours(0,0,0)), 
								 new Date(time_set.x_nR.setHours(23,59,0)))
			.then(function(data) {
				console.log(data);
				$scope.renderGrid();
			}, responseError);	
		}
	});

	$scope.$watch('gridProps.filter.arrival_time', function(newValue, oldValue) {
		if(newValue !== oldValue) {
			if(!$scope.gridProps.edit.active) {
				$scope.Availability();
			}
		}
	});

	$scope.$watch('gridProps.filter.room_type', function(newValue, oldValue) {
		if(newValue !== oldValue) {
			if (!$scope.gridProps.edit.active) {
				$scope.Availability();
			}
		}
	});
	/*TODO - PASS COMPANY ID HERE*/
	$scope.$watch('gridProps.filter.rate_type', function(newValue, oldValue) {
		if(newValue !== oldValue) {
			if (!$scope.gridProps.edit.active) {
				$scope.Availability();
			}		
		}	
	});

	function determineAvailability(reservations, orig_reservation) {
		var range_validated = true, 
			conflicting_reservation,
			m_start = meta.occupancy.start_date,
			m_end = meta.occupancy.end_date,
			m_id = meta.occupancy.id,
			maintenance_span = $scope.gridProps.display.maintenance_span_int * $scope.gridProps.display.px_per_int / $scope.gridProps.display.px_per_ms;

			reservations.forEach(function(reservation, idx) {
				var res_end_date = reservation[m_end] + maintenance_span,
					new_end_date = orig_reservation[m_end] + maintenance_span;

				if(reservation[m_id] !== orig_reservation[m_id]) {
					if((orig_reservation[m_start] >= reservation[m_start] && orig_reservation[m_start] <= res_end_date) ||
					   (reservation[m_start] >= orig_reservation[m_start] && res_end_date <= new_end_date) ||
					   (orig_reservation[m_start] >= reservation[m_start] && new_end_date <= res_end_date) ||
					   (new_end_date >= reservation[m_start] && new_end_date <= res_end_date)) {

					   	conflicting_reservation = reservation;
						range_validated = false;

						return;
					}
				}
			});
		

		return [range_validated, conflicting_reservation];
	}
}]);
