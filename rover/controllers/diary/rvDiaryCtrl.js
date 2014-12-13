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
		'propertyTime',
		'$vault',
		'$stateParams',
		'RVReservationBaseSearchSrv',
		'$timeout',
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
			 propertyTime,
			 $vault, $stateParams, RVReservationBaseSearchSrv, $timeout) {

	$scope.$emit('showLoader');

	$scope.reservationData = {};
	$scope.initReservationDetails();
	BaseCtrl.call(this, $scope);

	//updating the left side menu
    $scope.$emit("updateRoverLeftMenu", "diaryReservation");

	// data for next state
	$rootScope.setNextState = {
		data: {
			'isFromDiary' : true,
			'useCache'    : true
		}
	}

	// set a back button
	if ( $rootScope.diaryState.useOriginal($rootScope.getPrevStateTitle()) ) {
		var goToThisPrev = $rootScope.diaryState.getOriginState();
		$rootScope.setPrevState = {
			title : goToThisPrev.title,
			name  : goToThisPrev.name,
			param : goToThisPrev.param
		}
	} else {
		$rootScope.setPrevState = {
			title: $rootScope.getPrevStateTitle()
		}
	};


	/*--------------------------------------------------*/
	/*BEGIN CONFIGURATION 
	/*--------------------------------------------------*/
	/*DATE UI CONFIG*/
		var minDate = new tzIndependentDate($rootScope.businessDate);
		minDate.setDate(minDate.getDate() - 1);
		$scope.dateOptions = {
	    	showOn: 'button',
	    	dateFormat: $rootScope.dateFormat,
	    	numberOfMonths: 1,
	    	minDate: minDate,
	    	yearRange: '-0:'
	    };

	    _.extend($scope, payload);

	    $scope.data 	= $scope.room;
	    $scope.stats 	= $scope.availability_count;
	    $scope.selectedReservations = [];

	    var isVaultDataSet = false;
     	var vaultData = rvDiarySrv.ArrivalFromCreateReservation();
     	var correctTimeDate = {};

     	if(vaultData) {           
            isVaultDataSet = true;
        } else {
        	// we will be creating our own data base on the current time.
        	correctTimeDate = correctTime(propertyTime);
        }

        function correctTime(propertyTime) {
            var hh   = parseInt(propertyTime.hotel_time.hh),
                mm   = parseInt(propertyTime.hotel_time.mm),
                ampm = '';

            // first decide AMP PM
            if ( hh > 12 ) {
                ampm = 'PM';
            } else {
                ampm = 'AM';
            }

            // the time must be rounded to next 15min position
            // if the guest came in at 3:10AM it should be rounded to 3:15AM
            if ( mm > 45 && hh + 1 < 12 ) {
                hh += 1;
                mm = 0;
            } else if ( mm > 45 && hh + 1 == 12 ) {
                if ( ampm == 'AM' ) {
                    hh  = 12;
                    mm = 0;
                    ampm    = 'PM';
                } else {
                    hh  = 12;
                    mm = 0;
                    ampm    = 'AM';
                }
            } else if ( mm == 15 || mm == 30 || mm == 45 ) {
                mm += 15;
            } else if ( Math.max(mm, 15) == 15 ) {
                mm = 15;
            } else if ( Math.max(mm, 30) == 30 ) {
                mm = 30;
            } else {
                mm = 45;
            };

            var date         = $rootScope.businessDate,
            	fromDate     = new tzIndependentDate(date).getTime(),
            	ms           = new tzIndependentDate(fromDate).setHours(0, 0, 0),
            	start_date   = (hh * 3600000) + (mm * 60000) + ms,
            	__start_date = new tzIndependentDate(date);

            __start_date.setHours(0, 0, 0);

            return {
        		'start_date'   : start_date,
        		'__start_date' : __start_date,
        		'arrival_time' : (hh < 10 ? '0' + hh : hh) + ':' + (mm == 0 ? '00' : mm)
        	}
        };


	    var number_of_items_resetted = 0;

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
		/*h
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
				x_offset: 				   isVaultDataSet ? (vaultData.start_date-7200000) : (correctTimeDate.start_date-7200000),
				x_0: 					   undefined,
				x_origin:                  isVaultDataSet ? vaultData.start_date : correctTimeDate.start_date,
				x_n:                       isVaultDataSet ? (vaultData.__start_date) : (correctTimeDate.__start_date),
				x_n_time:                  isVaultDataSet ? (vaultData.__start_date.toComponents().time.convertToReferenceInterval(15)) : (correctTimeDate.__start_date.toComponents().time.convertToReferenceInterval(15)),
				x_p: 	                   payload.display.x_p.getTime(),
				x_p_time:                  (!payload.display.x_p_time ? payload.display.x_p.toComponents().time.convertToReferenceInterval(15) : payload.display.x_p_time), //toComponents().time.convertToReferenceInterval(15),
				width: 						undefined,
				height: 					undefined,
				hours: 						48,
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

			availability: {
				resize: {
					current_arrival_time : null,
					current_departure_time: null,
					last_arrival_time : null,
					last_departure_time: null,
				}
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
	    	arrival_time: 				isVaultDataSet ? payload.filter.arrival_time : correctTimeDate.arrival_time,
	    	reservation_format: 		'h',
		    range: 						12,
	    	rate_type: 					payload.filter.rate_type,		    
		    rate:                        undefined,
	    	room_type: 					(payload.filter.room_type_id) ? rvDiarySrv.data_Store.get('_room_type.values.id')[payload.filter.room_type_id] : undefined,
	    	room_types:                 payload.filter.room_type,
		    show_all_rooms: 			'off',
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
	    		var hourFormat12 							= ($scope.gridProps.viewport.hours === 12);

	    		$scope.gridProps.viewport 					= _.extend({}, $scope.gridProps.viewport);
	    		$scope.gridProps.display  					= util.deepCopy($scope.gridProps.display);

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
		

        $scope.companySearchTextEntered = function() {
            if($scope.corporateSearchText.length === 1) {
                $scope.corporateSearchText = $scope.corporateSearchText.charAt(0).toUpperCase() + $scope.companySearchText.substr(1);
            } else if($scope.corporateSearchText.length > 2){
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
				    		resizeEndForExistingReservation (row_data, row_item_data);
				    		$scope.renderGrid();
				    	}

		    		break;	 
		    	} 
		    } else {	
			
		    	copy = util.shallowCopy({}, row_item_data);
	    		copy.selected = selected;

		    	if(props.availability.resize.current_arrival_time !== null && 
				props.availability.resize.current_departure_time !== null){
					copy[meta.occupancy.start_date] = new Date(props.availability.resize.current_arrival_time);
					copy[meta.occupancy.end_date] = new Date(props.availability.resize.current_departure_time);
				}

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
				    	util.reservationRoomTransfer($scope.gridProps.data, nextRoom, prevRoom, reservation);//, $scope.gridProps.edit.active);
						
						//removing the occupancy from Old Row, some times reservationRoomTransfer is not wroking fine
						if(nextRoom.id !== prevRoom.id){
							var roomIndex 		= _.indexOf(_.pluck($scope.gridProps.data, 'id'), prevRoom.id);
							if(roomIndex != -1) {
								var occupancyIndex 	= _.indexOf(_.pluck($scope.gridProps.data[roomIndex].occupancy, 'reservation_id'), reservation.reservation_id);
								if(occupancyIndex != -1){
									$scope.gridProps.data[roomIndex].occupancy.splice(occupancyIndex);
								}
							}							
						}

				    	$scope.gridProps.currentResizeItemRow = nextRoom;				    					    			    								    							
						
						
						
						var og_r_item = $scope.gridProps.edit.originalRowItem,
		    			og_item =  $scope.gridProps.edit.originalItem;

						$scope.resetEdit();
						$scope.renderGrid();
						$scope.$emit('showLoader');
						setTimeout(function(){
							$scope.onSelect(nextRoom, reservation, false, 'edit');							
							$scope.gridProps.currentResizeItemRow = nextRoom;
					    	$scope.gridProps.edit.originalRowItem = og_r_item;
					    	$scope.gridProps.edit.originalItem = og_item;
							$scope.$emit('hideLoader');
							prevRoom = '';
							prevTime = '';
						}, 350)
						
						
				    	
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

	    var resizeEndForNewReservation = function (row_data, row_item_data) {
	    	/*$scope.gridProps.filter = util.deepCopy($scope.gridProps.filter);
	    	$scope.gridProps.display = util.deepCopy($scope.gridProps.display);*/
	    	this.availability.resize.current_arrival_time = row_item_data[meta.occupancy.start_date];
	    	this.availability.resize.current_departure_time = row_item_data[meta.occupancy.end_date];
	    	this.display.min_hours = (row_item_data[meta.occupancy.end_date] - row_item_data[meta.occupancy.start_date]) / 3600000;			
	    	$scope.Availability();

	    }.bind($scope.gridProps); 

	    $scope.openStayCard = function() {
	    	var reservation 	= this.currentResizeItem,
	    		reservationID  	= reservation.reservation_id,
	    		confirmationID 	= reservation.confirmation_number;
	    		
			$state.go("rover.reservation.staycard.reservationcard.reservationdetails", {
				id: reservationID,
				confirmationId: confirmationID,
				isrefresh: true
			});
	    }.bind($scope.gridProps);

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
		    		room:  props.edit.originalRowItem,
		    		occupancy: props.edit.originalItem
		    	},
		    	next: {
		    		room:  row_data,
		    		occupancy: row_item_data,
	    		}
	    	};
	    	$scope.price = $scope.roomXfer.next.room.new_price - $scope.roomXfer.current.room.old_price;
	    	if($scope.price != 0) {
				ngDialog.open({
					template: 'assets/partials/diary/rvDiaryRoomTransferConfirmation.html',
					controller: 'RVDiaryRoomTransferConfirmationCtrl',
					scope: $scope
				});	    	
			}
			else{
				$scope.reserveRoom($scope.roomXfer.next.room, $scope.roomXfer.next.occupancy);
			}
	    };

		$scope.reserveRoom = function(nextRoom, occupancy){

			var dataToPassConfirmScreen = {},
			roomXfer = $scope.roomXfer,
			current = (roomXfer.current),
			next = (roomXfer.next);
			dataToPassConfirmScreen.arrival_date = nextRoom.arrivalDate;
			dataToPassConfirmScreen.arrival_time = nextRoom.arrivalTime;
			
			dataToPassConfirmScreen.departure_date = nextRoom.departureDate;
			dataToPassConfirmScreen.departure_time = nextRoom.departureTime;			
			var rooms = {
				room_id: next.room.id,
				rateId:  next.room.rate_id,
				amount: roomXfer.next.room.new_price,
				reservation_id: next.occupancy.reservation_id,
				confirmation_id: next.occupancy.confirmation_number,
				numAdults: next.occupancy.numAdults, 	
	    		numChildren : next.occupancy.numChildren,
	    		numInfants 	: next.occupancy.numChildren,
	    		guest_card_id: next.occupancy.guest_card_id,
	    		company_card_id: next.occupancy.company_card_id,
	    		travel_agent_id: next.occupancy.travel_agent_id,	    		
	    		payment: {
	    			payment_type: next.occupancy.payment_type,
	    			payment_method_used: next.occupancy.payment_method_used,
	    			payment_method_description: next.occupancy.payment_method_description
	    		}
			}
			dataToPassConfirmScreen.rooms = [];
			dataToPassConfirmScreen.rooms.push(rooms);
			$vault.set('temporaryReservationDataFromDiaryScreen', JSON.stringify(dataToPassConfirmScreen));
			$scope.closeDialog();
			$state.go('rover.reservation.staycard.mainCard.summaryAndConfirm', {
				reservation: 'HOURLY',
				mode:'EDIT_HOURLY'
			})
		};

	    var successCallBackOfResizeExistingReservation = function(data, successParams){
	    	var avData = data.availability;
	    	if(avData.new_rate_amount == null) {
	    		avData.new_rate_amount = avData.old_rate_amount;
	    	}	    	
	    	this.edit.originalRowItem.old_price = parseFloat(avData.old_rate_amount);
	    	this.currentResizeItemRow.new_price = parseFloat(avData.new_rate_amount);
	    	this.currentResizeItemRow.rate_id 		= avData.old_rate_id;
	    	this.currentResizeItemRow.departureTime = successParams.end_time;
	    	this.currentResizeItemRow.departureDate = successParams.end_date.toComponents().date.toDateString();
    		this.currentResizeItemRow.arrivalTime = successParams.begin_time;
	    	this.currentResizeItemRow.arrivalDate = successParams.begin_date.toComponents().date.toDateString(); 
	    	this.currentResizeItem.numAdults 	= 1; 	
	    	this.currentResizeItem.numChildren 	= 0;
	    	this.currentResizeItem.numInfants 	= 0;
	    }.bind($scope.gridProps);
	    
	    var failureCallBackOfResizeExistingReservation = function(errorMessage){
	    	$scope.errorMessage = errorMessage;
	    	$scope.resetEdit();
	    	$scope.renderGrid();
	    };

	    var resizeEndForExistingReservation = function (row_data, row_item_data) {
	    	var params = getEditReservationParams();
	    	var options = {
	    		params: 			params,
	    		successCallBack: 	successCallBackOfResizeExistingReservation,	 
	    		failureCallBack: 	failureCallBackOfResizeExistingReservation,  
	    		successCallBackParameters:  params 	
	    	}
	    	$scope.callAPI(rvDiarySrv.roomAvailabilityCheckAgainstReservation, options);
	    };  

	    $scope.onResizeEnd = function(row_data, row_item_data){	
			if($scope.gridProps.edit.active) {
				resizeEndForExistingReservation (row_data, row_item_data);
			}
			else{
				resizeEndForNewReservation (row_data, row_item_data);
			}	    	
	    }

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

	    	/*if($scope.gridProps.filter.show_all_rooms === 'on') {
	    		util.clearRowClasses($scope.gridProps.data);
	    	} else {
	    		updateRowClasses(current_scroll_pos);
			}*/

	    	$scope.renderGrid();
	    };

		var displayFilteredResults = _.debounce(function () {
			var DS = rvDiarySrv.data_Store, hourly_rates = [];

        	RMFilterOptionsSrv.fetchCompanyCard({ 
        		query: $scope.corporateSearchText.trim() 
        	})
            .then(function(data) {

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

			//$scope.debug();
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



 		$scope.editCancel = function() {
	    	var props = $scope.gridProps;	    	
	    	util.reservationRoomTransfer($scope.gridProps.data, props.edit.originalRowItem, props.currentResizeItemRow, props.edit.originalItem);
	    	$scope.errorMessage = '';
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
			//$scope.gridProps.edit.originalRowItem = undefined;
			//$scope.gridProps.edit.originalItem = undefined;
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
            id = meta.occupancy.id,
			reject = function(child) {		
				return angular.lowercase(child[m_status]) === 'available'; 
			};

		for(var i = 0, len = rooms.length; i < len; i++) {
			room 			= rooms[i];
		room.occupancy 	= _.reject(room.occupancy, reject);	//util.copyArray(_.reject(room.occupancy, reject), room.occupancy);	
			room 			= util.deepCopy(room);							 
		}
	};

	var successCallBackOfAvailabilityFetching = function(data, successParams){
		var row_item_data;		

		if(data.length) {
			row_item_data 	= data[0];					
			if(this.availability.resize.current_arrival_time !== null && 
				this.availability.resize.current_departure_time !== null){
				this.availability.resize.last_arrival_time =  this.availability.resize.current_arrival_time;
				this.availability.resize.last_departure_time = this.availability.resize.current_departure_time;
			}						
			
			$scope.initPassiveEditMode({
                start_date:     new Date(row_item_data[meta.occupancy.start_date]),
                end_date:       new Date(row_item_data[meta.occupancy.end_date]),
                //stay_dates:     start_date.toComponents().date.toDateString(),
                row_item_data:  row_item_data,
                row_data:       _.findWhere(rvDiarySrv.data_Store.get('room'), { id: row_item_data.room_id }) //rvDiarySrv.data_Store.get('/room.values.id')[row_item_data.room_id],   
            });
		}
		$scope.renderGrid();				
				
	}.bind($scope.gridProps);

	var failureCallBackOfAvailabilityFetching = function(errorMessage){
		$scope.errorMessage = errorMessage;		
	}

	var callAvailabilityAPI = function(){
		var params = getAvailabilityCallingParams();
		var options = {
    		params: 			params,
    		successCallBack: 	successCallBackOfAvailabilityFetching,	 
    		failureCallBack: 	failureCallBackOfAvailabilityFetching,    	
    		successCallBackParameters:  params 	
    	}
    	$scope.callAPI(rvDiarySrv.Availability, options);
	}

    $scope.Availability = function() {
    	$scope.errorMessage = '';
		$scope.clearAvailability();
		$scope.resetEdit();
		$scope.renderGrid();

		if($scope.gridProps.filter.arrival_time) {
			callAvailabilityAPI();
		}
	};

	var getEditReservationParams = function(){
			var filter 	= _.extend({}, this.filter),
			time_span 	= Time({ hours: this.min_hours }), 
			
			start_date 	= new Date(this.display.x_n), 
			start_time 	= new Date(filter.arrival_times.indexOf(filter.arrival_time) * 900000 + start_date.getTime()).toComponents().time,
			
			start 		= new Date(this.currentResizeItem.arrival),
			end 		= new Date(this.currentResizeItem.departure),
			
			rate_type 	= ( this.currentResizeItem.travel_agent_id == null || this.currentResizeItem.travel_agent_id == '') && 
						( this.currentResizeItem.company_card_id == null || this.currentResizeItem.company_card_id == '') ? 'Standard': 'Corporate',
			account_id  = rate_type == 'Corporate' ? (this.currentResizeItem.travel_agent_id ? this.currentResizeItem.travel_agent_id : this.currentResizeItem.company_card_id) : undefined,

			room_id 	= this.currentResizeItemRow.id,
			reservation_id = this.currentResizeItem.reservation_id,

			arrivalTime = new Date(this.currentResizeItem.arrival).toComponents().time;
			arrivalTime = arrivalTime.hours + ":" + arrivalTime.minutes + ":" + arrivalTime.seconds,

			depTime 	= new Date(this.currentResizeItem.departure).toComponents().time;				
			depTime 	= depTime.hours + ":" + depTime.minutes + ":" + depTime.seconds;
            var params = {
                room_id:            room_id,
                reservation_id:     reservation_id,
                begin_date:         start,
                begin_time:         arrivalTime,
                end_date:           end,
                end_time:           depTime,
                rate_type:          rate_type,
            };
            if(account_id) {            	
				params.account_id = account_id;
			}
			
		return params
	}.bind($scope.gridProps);

	var getAvailabilityCallingParams = function() {
		var filter 		= _.extend({}, this.filter),
			time_span 	= Time({ hours: this.display.min_hours }), 
			start_date 	= new Date(this.display.x_n),
			getIndex    = filter.arrival_times.indexOf(filter.arrival_time),
			// correction  = getIndex % 4 != 0 ? 900000 : 0,
			correction  = 0,
			start_time 	= new Date((getIndex * 900000) - correction + start_date.getTime()).toComponents().time,
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
			rt_filter = (_.isEmpty(filter.room_type) || (filter.room_type && angular.lowercase(filter.room_type.id) === 'all')  ? undefined : filter.room_type.id),
			rate_type = filter.rate_type,			
			account_id = filter.rate_type == 'Corporate' ? filter.rate.id : undefined, 
			GUID = "avl-101";//No need to manipulate this thing from service part, we are deciding
			if(this.availability.resize.current_arrival_time !== null && 
				this.availability.resize.current_departure_time !== null){
				start = new Date(this.availability.resize.current_arrival_time);
				end = new Date(this.availability.resize.current_departure_time);
			}			
		
		var paramsToReturn = {
			start_date: start,
			end_date: end,
			room_type_id: rt_filter,
			rate_type: rate_type,			
			GUID: GUID
		};
		if(account_id) {
			paramsToReturn.account_id = account_id;
		}
		return paramsToReturn
	}.bind($scope.gridProps);

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

	$scope.$watch('gridProps.filter.account_id', function(newValue, oldValue){
		if(newValue !== oldValue) {
			if(!$scope.gridProps.edit.active) {
				$scope.Availability();
			}
		}
	});

	var callDiaryAPIsAgainstNewDate = function(start_date, end_date){
		$scope.$emit('showLoader');
		$scope.errorMessage = '';
		rvDiarySrv.callOccupancyAndAvailabilityCount(start_date, end_date)
		.then(function(data){

			$scope.gridProps.data = data.room;

    		$scope.gridProps.stats = data.availability_count;

			$scope.gridProps.display.x_0 = $scope.gridProps.viewport.row_header_right;					
			
			//Resetting as per CICO-11314
			if ( !!_.size($_resetObj) ) {
				$_resetObj.callback();
			} else {
				$scope.gridProps.filter.rate_type = "Standard";
				$scope.gridProps.filter.arrival_time = "00:00";
				$scope.gridProps.filter.room_type = "";
				number_of_items_resetted = 0;
				$scope.clearAvailability();
				$scope.resetEdit();
				$scope.renderGrid();	
				$scope.$emit('hideLoader');	
			}
		});		
	};

	$scope.$watch('gridProps.filter.arrival_date', function(newValue, oldValue) {
		var props = $scope.gridProps,
			filter = props.filter,
			arrival_ms = filter.arrival_date.getTime(),
			time_set;
	
		if(newValue !== oldValue) {	
            time_set = util.gridTimeComponents(arrival_ms, 48, util.deepCopy($scope.gridProps.display));

            $scope.gridProps.display = util.deepCopy(time_set.display);

			if($scope.gridProps.edit.active || $scope.gridProps.edit.passive) {
				//$scope.Availability();
			}
	    	
			callDiaryAPIsAgainstNewDate(time_set.toStartDate(), time_set.toEndDate());
		}
	} );

	var $_resetObj = {};

    $scope.resetEverything = function() {
    	var _sucessCallback = function(propertyTime) {
	    	$_resetObj = correctTime(propertyTime);

			$_resetObj.callback = function() {
				$scope.gridProps.filter.arrival_time = '';
				$scope.gridProps.filter.rate_type = 'Standard';
				$scope.gridProps.filter.room_type = '';
				number_of_items_resetted = 0;
				$scope.renderGrid();	
				$scope.$emit('hideLoader');	

				$timeout(function() {
					$_resetObj = {};
				}, 100);
			};

			// change date to triggeer a change
			$scope.gridProps.filter.arrival_date = new Date($_resetObj.start_date);
    	};

    	$scope.clearAvailability();
		$scope.resetEdit();
		$scope.renderGrid();

    	$scope.invokeApi(RVReservationBaseSearchSrv.fetchCurrentTime, {}, _sucessCallback);
    };



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
	
	$scope.clickedOnArrivalTime = function(){
		$scope.gridProps.availability.resize.current_arrival_time = null;
		$scope.gridProps.availability.resize.current_departure_time = null;
		$scope.gridProps.availability.resize.last_arrival_time = null;
		$scope.gridProps.availability.resize.last_departure_time = null;
		if(!$scope.gridProps.edit.active) {
			$scope.Availability();
		}
	};

	$scope.clickedOnRoomType = function(){
		if ( !$scope.gridProps.edit.active && !!$scope.gridProps.filter.room_type ) {
			$scope.Availability();
		} else if ( $scope.gridProps.filter.room_type == null ) {
			$scope.clearAvailability();
		};
	};

	$scope.clickedOnRateType = function(){
		if($scope.gridProps.filter.rate_type === 'Standard') {
			$scope.gridProps.filter.rate = '';
		}
		if (!$scope.gridProps.edit.active && $scope.gridProps.filter.rate_type === 'Standard') {
			$scope.Availability();
			$scope.gridProps.filter.toggleRates();
		}
	};	




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

	var switchToEditModeIfPassed = function(){
		// we are checking for whether we need to find the reservation against ID passed from someother state
		// and change the diary to edit mode
		if($stateParams && 'reservation_id' in $stateParams && 
			$stateParams.reservation_id !== '') {
			var reservation_id 		= $stateParams.reservation_id,		
				rooms 				= payload['room'],
				row_data 			= null, 
				row_item_data 		= null, 
				occpancies 			= null, 
				reservation_details = null;
			
			_.each(rooms, function(room_detail) {
				occpancies 		= room_detail['occupancy'];	

				// we can use _.findWhere(occpancies, {'reservation_id': reservation_id});
				// but type checking in underscore creating problem
				_.each(occpancies,  function(occupancy) {
					if(_.has(occupancy, 'reservation_id')) {
						if(occupancy['reservation_id'] == reservation_id){
							row_item_data = occupancy;
						}
					}
				})				
				
				if(row_item_data) {					
					row_data = room_detail;
				}				
			});						   	
			if(row_data){	   		
	   			$scope.$apply(function(){	   			
	   				$scope.onSelect(row_data, row_item_data, false, 'edit');
	   			});
			}
			
		}						
	}



	var correctRoomType = function() {
		if ( !$scope.gridProps.filter.room_type ) {
			var data,
				room_type_id,
				matched;

			data = $vault.get('searchReservationData');
			
			if(data) {
			    data = JSON.parse(data);
			} else {
				return;
			}

			room_type_id = isNaN(parseInt(data.roomTypeID)) ? 'All' : data.roomTypeID;

			match = _.find($scope.gridProps.filter.room_types, function(item) {
				return room_type_id == item.id;
			});

			$scope.gridProps.filter.room_type = match;		
		};
		//CICO-11718
		// trigger call
		$scope.clickedOnRoomType();

		setTimeout(function() {
			$vault.remove('searchReservationData');
		}, 10);
	};

	$scope.eventAfterRendering = function() {
		$scope.$apply(function(){
			$scope.$emit('hideLoader');
			$scope.resetEdit();
		});

		setTimeout(correctRoomType, 100);

		setTimeout(function(){
			switchToEditModeIfPassed();
		}, 1000);
	};	


	$scope.compCardOrTravelAgSelected = function(){
		if (!$scope.gridProps.edit.active) {
			$scope.Availability();
			$scope.gridProps.filter.toggleRates();
		}
	};

	$scope.discardSelectedCompCardOrTravelAg = function(){
		$scope.gridProps.filter.rate = ''; 
		$scope.corporateSearchText = "";
	};

    // jquery autocomplete Souce handler
    // get two arguments - request object and response callback function
    var autoCompleteSourceHandler = function(request, response) {

        var companyCardResults = [],
            lastSearchText = '',
            eachItem = {},
            hasItem = false,
            img_url = '';

        // process the fetched data as per our liking
        // add make sure to call response callback function
        // so that jquery could show the suggestions on the UI
        var processDisplay = function(data) {
            $scope.$emit("hideLoader");

            angular.forEach(data.accounts, function(item) {
                eachItem = {};

                eachItem = {
                    label: item.account_name,
                    value: item.account_name,
                    image: item.company_logo,

                    // only for our understanding
                    // jq-ui autocomplete wont use it
                    type: item.account_type,
                    id: item.id,
                    corporateid: '',
                    iataNumber: ''
                };

                if(item.company_logo === '') {
                	img_url = item.account_type === 'COMPANY' ? '/assets/avatar-company.png' : '/assets/avatar-travel-agent.png';
                	eachItem.image = img_url;
                }

                // making sure that the newly created 'eachItem'
                // doesnt exist in 'companyCardResults' array
                // so as to avoid duplicate entry
                hasItem = _.find($scope.companyCardResults, function(item) {
                    return eachItem.id === item.id;
                });

                // yep we just witnessed an loop inside loop, its necessary
                // worst case senario - too many results and 'eachItem' is-a-new-item
                // will loop the entire 'companyCardResults'
                if (!hasItem) {
                    companyCardResults.push(eachItem);
                };
            });

            // call response callback function
            // with the processed results array
            response(companyCardResults);
        };

        // fetch data from server
        var fetchData = function() {
            if (request.term != '' && lastSearchText != request.term) {
                $scope.invokeApi(RMFilterOptionsSrv.fetchCompanyCard, {
                    'query': request.term
                }, processDisplay);
                lastSearchText = request.term;
            }
        };

        // quite simple to understand
        if (request.term.length === 0) {
            companyCardResults = [];
            lastSearchText = "";
        } else if (request.term.length > 2) {
            fetchData();
        }
    };

    var autoCompleteSelectHandler = function(event, ui) {	
    	$scope.gridProps.filter.rate = ui.item;    	
        $scope.$apply();      
    };

    $scope.autocompleteOptions = {
        delay: 0,
        position: {
             my : "right top", 
             at: "right bottom",
            collision: 'flip'
        },
        source: autoCompleteSourceHandler,
        select: autoCompleteSelectHandler
    };
}]);
