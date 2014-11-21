sntRover
.controller('rvDiaryCtrl', 
	[ 	'$scope', 
		'$rootScope',
		'$state',
		'$stateParams', 
		'$filter', 
		'$window', 
		'ngDialog',  
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

		$scope.gridProps = {
		/* Meta data object - allows us to use a single point of reference for various object properties.
	       If a property name expected changes, update it here so it will propagate throughout the application.
	    */
	    meta: meta,  
	    /*
	    	Rooms array <- single data structure maintained in Angular, processed by React
	      	NOTE: if the format/construction/etc of this data model becomes incorrect, React
	      	may display garbage.  When there is a display issue, look here 
	      	first - this is where 99.9999% of the problems arise. 
	    */        
	    data: $scope.data, 
	    /*
	    	Stats correspond to the occupancy counts found at the bottom of the timeline.
	    */
	    stats: $scope.stats,
	    /*
			Viewport - frames viewable portion of grid.  Constains offsets necessary
						for correct display and obtaining current window size.

	    */ 
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
		/*
			Display is a configuration/state object that holds 
			background grid temporal and spatial parameters.  
			Such as:
				left most negative x on axis
				right most postivie x on axis
				origin - the focus point on the grid(grid scrolls from -x to this position on load)
				offset - basically origin minus two hours

			The rest are conversion factors for px to ms, etc used mainly within the React Grid
			Also includes somewhat misc properties such as currency symbol and base new reservation
			time span.
		*/
			display: {
			x_offset: 				   payload.display.x_offset.getTime(),
				x_0: 					   undefined,
			x_origin:                  payload.display.x_origin.getTime(),
			x_n:                       payload.display.x_n.getTime(),
			x_n_time:                  (!payload.display.x_n_time ? payload.display.x_n.toComponents().time.convertToReferenceInterval(15) : payload.display.x_n_time),
			x_p: 	                   payload.display.x_p.getTime(),
			x_p_time:                  (!payload.display.x_p_time ? payload.display.x_p.toComponents().time.convertToReferenceInterval(15) : payload.display.x_p_time), //toComponents().time.convertToReferenceInterval(15),
				width: 						undefined,
				height: 					undefined,
			hours: 						24,
				row_height: 				60,
				row_height_margin: 			5,
				intervals_per_hour: 		4, 
			ms_15:                      900000,
				px_per_ms: 					undefined,
				px_per_int: 				undefined,
				px_per_hr: 					undefined,
			currency_symbol:            $rootScope.currencySymbol,
			min_hours: 					payload.display.min_hours
			},
		/* 
		   Edit command object.  When we need to edit an existing reservation, this is how we setup the
		   edit command object:

		   Edit Reservation:
		   		edit = shallowCopy({}, edit)
		   		edit.active = true;
		   		edit.passive = false;
		   		mode = undefined;
		   		resizing = false;
		   		dragging = false;
		   		originalItem = target reservation on grid to edit;
		   		originalRowItem = row(room in our case) that contains the target reservation;
		   		currentResizeItem = deepCopy(originalItem);
		   		currentResizeItemRow = deepCopy(originalRowItem);

		   	Edit Available Slots:
		   		edit = shallowCopy({}, edit)
		   		edit.active = false;
		   		edit.passive = true;
		   		mode = unique guid automatically set in rvDiarySrv.Availability GET request, however,
		   		       a guid can be passed instead which is necessary for the case in which we update rates
		   		       of the existing available slots;
		   		resizing = false;
		   		dragging = false;
		   		originalItem = undefined;
		   		originalRowItem = undefinded;
		   		currentResizeItem = deepCopy(first item returned in availability data array from API call);
		   		currentResizeItemRow = undefined || guid

		   	Take special note that to make resizing an array of available slots simple, the aforementioned GUID
		   	is assigned to the "reservation_id" of each available slot.  Within the React grid, resizing is enabled
		   	when the incoming resize model property id matches the existing prop id.
		*/			   	
			edit: {								
				active: 					false,
				passive:                    false, 
			mode:    					undefined,
				resizing:                   { enabled: false },
			dragging:     				{ enabled: false, direction: 0x01 },
				originalItem: 				undefined,
			originalRowItem: 			undefined,
			currentResizeItem:          undefined,
			currentResizeItemRow:       undefined
			},
		/*
			Filter options found above the React grid.   This section is mainly Angular controlled, however,
		  	the filter values are passed down the React component hierarchy for display purposes.  SO, changes
		  	here will reflect in both Angular and the grid.  

			  4 distinct watches are set for the following filter properties:
			  	1) Arrival Date
			  	2) Arrival Time
			  	3) Rate
	            4) Grid size display hours 
		*/
		filter: {						
	    	arrival_date: 				payload.display.x_n,
	    	arrival_times:              Array.prototype.slice.call(payload.filter.arrival_times),
	    	arrival_time: 				payload.filter.arrival_time,
	    	reservation_format: 		'h',
		    	range: 						12,
	    	rate_type: 					payload.filter.rate_type,
		    	rate_type_details: 			[],
		    	rate:                        undefined,
	    	room_type: 					(payload.filter.room_type_id) ? rvDiarySrv.data_Store.get('_room_type.values.id')[payload.room_type_id] : undefined,
	    	room_types:                 payload.filter.room_type,
		    	show_all_rooms: 			'on',
		    	toggleHoursDays: function() {
	    		this.reservation_format = (this.reservation_format === 'h') ? 'd' : 'h';

	    		if(this.reservation_format === 'd') {
		    			$state.go('rover.reservation.search', {
		    				fromState: 'DIARY'
		    			});
		    		}
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
			},
			toggleRange: function() {
	    		var hourFormat12 = ($scope.gridProps.viewport.hours === 12);

	    		$scope.gridProps.viewport = util.deepCopy($scope.gridProps.viewport);
	    		$scope.gridProps.display  = util.deepCopy($scope.gridProps.display);

				$scope.gridProps.viewport.hours 			= (hourFormat12) ? 24 : 12;
				$scope.gridProps.display.row_height 		= (hourFormat12) ? 24 : 60;
				$scope.gridProps.display.row_height_margin 	= (hourFormat12) ? 0 : 5;

				$scope.gridProps.display.width 				= $scope.gridProps.display.hours / $scope.gridProps.viewport.hours * $scope.gridProps.viewport.width;
				$scope.gridProps.display.height      		= $scope.gridProps.display.row_height + $scope.gridProps.display.row_height_margin;
				$scope.gridProps.display.px_per_hr 			= $scope.gridProps.viewport.width / $scope.gridProps.viewport.hours;
				$scope.gridProps.display.px_per_int 	    = $scope.gridProps.display.px_per_hr / $scope.gridProps.display.intervals_per_hour;
				$scope.gridProps.display.px_per_ms 			= $scope.gridProps.display.px_per_int / $scope.gridProps.display.ms_15;

				    	$scope.renderGrid();
				    }
				}
		    };

	$scope.gridProps.filter.room_types.unshift({ id: 'All', name: 'All', description: 'All' });
			  	
		/*--------------------------------------------------*/
		/* BEGIN UTILITY METHOD SECTION */
		/*--------------------------------------------------*/
		function responseError(err) {
			console.log(err);
		}
		/*--------------------------------------------------*/
		/* END UTILITY METHOD SECTION */
		/*--------------------------------------------------*/

		/*_________________________________________________________
			END SECTION -> Angular Grid Filter callbacks 
		  ________________________________________________________
		*/

		/*_________________________________________________________
			END SECTION -> Angular Grid Filter callbacks 
		  ________________________________________________________
		*/

	   	/*_________________________________________________________
		    BEGIN CORPORATE RATE METHODS 
		  ________________________________________________________
		*/
		$scope.confirmRateSelection = function(idx) {
			var details = $scope.gridProps.filter.rate_type_details;

			$scope.gridProps.filter.rate = $scope.gridProps.filter.rate_type_details[idx];
	    };    

		$scope.discardRateSelection = function(idx) {
			//var details = $scope.gridProps.filter.rate_type_details;
			$scope.gridProps.filter.rate_type_details = [];
			$scope.gridProps.filter.rate = undefined;
	    };

        $scope.companySearchTextEntered = function() {
            if($scope.companySearchText.length === 1) {
                $scope.companySearchText = $scope.companySearchText.charAt(0).toUpperCase() + $scope.companySearchText.substr(1);
            } else if($scope.companySearchText.length > 2){
                displayFilteredResults();
            }
	    };
	   	/*_________________________________________________________
		    END CORPORATE RATE METHODS 
		  ________________________________________________________
		*/
			
	    /*_________________________________________________________
		    BEGIN EVENT HOOKS 
		  ________________________________________________________
		*/

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
			    	availability = determineAvailability(nextRoom[meta.room.row_children], reservation).shift();

					if(availability) {
				    	util.reservationRoomTransfer($scope.data, nextRoom, prevRoom, reservation);//, $scope.gridProps.edit.active);
					    
				    	$scope.gridProps.currentResizeItemRow = nextRoom;

				    	$scope.renderGrid();
				    }
				}
		};
		})();

	 	$scope.onResizeStart = function(row_data, row_item_data) {
			  	
	    };

	    $scope.debug = function() {
	    	for(var  i = 0, len = $scope.data.length; i < len ; i++) {
	    		if($scope.data[i].occupancy.length > 0) {
	    			console.log($scope.data[i].room_no, $scope.data[i].occupancy);
            }
	    	}
	    }

	    $scope.onResizeEnd = function(row_data, row_item_data) {
	    	$scope.gridProps.filter = util.deepCopy($scope.gridProps.filter);
	    	$scope.gridProps.display = util.deepCopy($scope.gridProps.display);

	    	$scope.gridProps.display.min_hours = (row_item_data[meta.occupancy.end_date] - row_item_data[meta.occupancy.start_date]) / 3600000;

	    	rvDiarySrv.Availability.apply(this, $scope.getArrivalTimes()) 
	    	.then(function(data) {
	    		console.log(data);
	    		console.log(rvDiarySrv.data_Store.get('room'));

	    		$scope.renderGrid();
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
			var DS = rvDiarySrv.data_Store, hourly_rates = [];

        	RMFilterOptionsSrv.fetchCompanyCard({ 
        		query: $scope.companySearchText.trim() 
        	})
            .then(function(data) {
            	var applicable_accounts = _.filter(data.accounts, function(account) {
            		var contract = account.current_contract,
            			hourly_rates;

            		if(_.isObject(contract) && _.has(contract, 'id')) {
            			hourly_rates.push(contact);

            			return _.findWhere(hourly_rates, { id: contract.id });
            		}
            	});

				$scope.gridProps.filter.rate_type_details = applicable_accounts;//companyCardResults = data.accounts;
            }, responseError);  
        }, 500);

	    /*_________________________________________________________
		    END  EVENT HOOKS 
		  ________________________________________________________
		*/

		$scope.renderGrid = function(params) {
			var args = params || {};

	 		React.renderComponent(
				DiaryContent(_.extend(args, $scope.gridProps)),
				document.getElementById('component-wrapper')
			);	

			$scope.debug();
		};

	    $scope.isSelected = function(room, reservation) {
	    	return _.isBoolean(reservation.selected) && reservation.selected;
	    };

	    $scope.isAvailable = function(room, reservation) {
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
		

		/*
			----------------------------------------------------------------
			BEGIN EDIT METHODS
			----------------------------------------------------------------
		*/
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
	    		row_data 		= props.currentResizeItemRow, //util.copyRoom(props.currentResizeItemRow),
	    		row_item_data 	= props.currentResizeItem, //util.copyReservation(props.currentResizeItem),
	    		px_per_ms 		= props.display.px_per_ms,
	    		x_origin 		= props.display.x_n;

	    	//row_item_data[meta.occupancy.start_date] = row_item_data.left / px_per_ms + x_origin;
	    	//row_item_data[meta.occupancy.end_date] 	 = row_item_data.right / px_per_ms + x_origin; 

	    	$scope.roomXfer = {
	    		current: {
		    		room: 		 props.edit.originalRowItem,
		    		occupancy: props.edit.originalItem
		    	},
		    	next: {
		    		room: 		 row_data,
		    		occupancy: row_item_data
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

	    	$scope.resetEdit();
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

	/*
		----------------------------------------------------------------
		END EDIT METHODS
		----------------------------------------------------------------
	*/

	/*
		----------------------------------------------------------------
		BEGIN AVAILABILITY METHODS
		----------------------------------------------------------------
	*/

	   	$scope.clearAvailability = function() {
			var rooms = $scope.data,
				room,
                m_status = meta.occupancy.status,
				reject = function(child) {
					return angular.lowercase(child[m_status]) === 'available'; 
				};

			for(var i = 0, len = rooms.length; i < len; i++) {
				room 			= rooms[i];
			room.occupancy 	= _.reject(room.occupancy, reject);	//util.copyArray(_.reject(room.occupancy, reject), room.occupancy);	
				room 			= util.deepCopy(room);							 
			}
		};

    $scope.Availability = function() {	
		$scope.clearAvailability();
		$scope.resetEdit();
		$scope.renderGrid();

		if($scope.gridProps.filter.arrival_time) {
			rvDiarySrv.Availability.apply(this, $scope.getArrivalTimes()) 
			.then(function(data) {
				var row_item_data;

				if(data.length) {
					row_item_data 	= data[0];
				
					$scope.initPassiveEditMode({
	                    start_date:     new Date(row_item_data[meta.occupancy.start_date]),
	                    end_date:       new Date(row_item_data[meta.occupancy.end_date]),
	                    //stay_dates:     start_date.toComponents().date.toDateString(),
	                    row_item_data:  row_item_data,
	                    row_data:       _.findWhere(rvDiarySrv.data_Store.get('room'), { id: row_item_data.room_id }) //rvDiarySrv.data_Store.get('/room.values.id')[row_item_data.room_id],   
	                });
				}

				$scope.renderGrid();

			}, 
			responseError);
		}
	};

	$scope.getArrivalTimes = function() {
		var filter 		= _.extend({}, $scope.gridProps.filter),
			time_span 	= Time({ hours: $scope.gridProps.display.min_hours }), 
			start_date 	= new Date($scope.gridProps.display.x_n), 
			start_time 	= new Date(filter.arrival_times.indexOf(filter.arrival_time) * 900000 + start_date.getTime()).toComponents().time,
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
			rt_filter = (_.isEmpty(filter.room_type) || (filter.room_type && angular.lowercase(filter.room_type.id) === 'all')  ? undefined : filter.room_type.id);

		return [
			start,
			end,
			rt_filter,
			filter.rate_type
		];
	};

	/*
		----------------------------------------------------------------
		END AVAILABILITY METHODS
		----------------------------------------------------------------
	*/

	/*
		----------------------------------------------------------------
		BEGIN WATCHERS
		----------------------------------------------------------------
	*/
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
            time_set = util.gridTimeComponents(arrival_ms, 48, util.deepCopy($scope.gridProps.display));

            $scope.gridProps.display = util.deepCopy(time_set.display);

			$scope.renderGrid();

			if($scope.gridProps.edit.active || $scope.gridProps.edit.passive) {
				//$scope.Availability();
			}

			rvDiarySrv.Occupancy(time_set.toStartDate(), time_set.toEndDate())					
			.then(function(data) {
				$scope.renderGrid();
			}, responseError);	
		}
	});

	$scope.dateTransfer = function() {
		var props = $scope.gridProps,
			filter 	= props.filter,
			arrival_ms = filter.arrival_date.getTime(),
			time_set; 

		if(newValue !== oldValue) {	
            time_set = util.gridTimeComponents(arrival_ms, 48, util.deepCopy($scope.gridProps.display));

            $scope.gridProps.display = util.deepCopy(time_set.display);

			$scope.renderGrid();

			if($scope.gridProps.edit.active || $scope.gridProps.edit.passive) {
				$scope.Availability();
			}

			rvDiarySrv.Occupancy(time_set.toStartDate(), time_set.toEndDate())				
			.then(function(data) {

				//$scope.gridProps.filter = _.extend({}, $scope.gridProps.filter);
				//$scope.gridProps.filter.arrival_time = $scope.gridProps.filter.arrival_times[0];
				
				$scope.renderGrid();
			}, responseError);	
		}
	};
	

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
	/*
		----------------------------------------------------------------
		END WATCHERS
		----------------------------------------------------------------
	*/


	/*
		ORIGINAL PROTOTYPE METHOD FOR Determining availability after drag/drop
		to a certain location.  Check to see if occupancy is there, etc.
	*/
	function determineAvailability(reservations, orig_reservation) {
		var range_validated = true, 
			current_room_type = $scope.gridProps.filter.room_type,
			conflicting_reservation,
			m_start = meta.occupancy.start_date,
			m_maintenance = meta.occupancy.maintenance,
			m_end = meta.occupancy.end_date,
			m_id = meta.occupancy.id;

			if(reservations) {
			reservations.forEach(function(reservation, idx) {
					var res_end_date = reservation[m_end] + reservation[m_maintenance],
						new_end_date = orig_reservation[m_end] + orig_reservation[m_maintenance];

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
			}

		return [range_validated, conflicting_reservation];
	}
}]);
