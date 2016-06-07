angular.module('sntRover')
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
		'RVReservationBaseSearchSrv',
		'$timeout',
		'RVReservationSummarySrv',
		'baseSearchData',
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
			 $vault,
			 RVReservationBaseSearchSrv,
			 $timeout,
			 RVReservationSummarySrv, baseSearchData) {

		$scope.$emit('showLoader');

		BaseCtrl.call(this, $scope);

		//changing the header
	  	//chnaging the heading of the page
	    $scope.heading = $filter( 'translate')('DIARY_RESERVATIONS');

		//updating the left side menu
	    $scope.$emit("updateRoverLeftMenu", "diaryReservation");

	    //updating the title
	    $scope.setTitle($filter( 'translate')('DIARY'));

		// data for next state
		$rootScope.setNextState = {
			data: {
				'isFromDiary' : true,
				'useCache'    : true
			}
		};








		/**
		 * decide what the behaviour and title of back button on diary
		 * @param {Object} $r  shorthand ref to $rootScoop
		 * @param {Object} $ds shorthand ref to $rootScoop.diaryState
		 */
		var decideBackBtn = function ($r, $ds) {

			/**
			 * @type {Boolean} should we return to a particular back state, not just the previous state
			 * @type {Oject}   this particular state object with title, name & param
			 */
			var shouldUseOriginal = $ds.useOriginal( $r.getPrevStateTitle() ),
				goToThisPrev      = $ds.getOriginState();

			/**
			 * @type {String} the previous state title
			 * @type {String} the previous state name
			 */
			var prevTitle = $r.getPrevStateTitle(),
				prevName  = $r.getPrevStateName();

			/** @type {Array} states that are part of any particular flow */
			var flowStates = [
				'rover.reservation.search',
				'rover.reservation.staycard.reservationcard.reservationdetails'
			];

			/** @type {Array} states to which we should be allowed to go back */
			var allowedStates = [
				'rover.search',
				'rover.financials.journal',
				'rover.ratemanager',
				'rover.companycardsearch',
				'rover.housekeeping.roomStatus'
			];

			/**
			 * @type {Object} the default state which should be used if all checks fails
			 * @constant
			 */
			var DEFAULT_STATE = {
				title : 'DASHBOARD',
				name  : 'rover.dashboard',
				param : {}
			};

			if ( shouldUseOriginal ) {

				// if we should go back to a particular state
				// defined in the diaryState
				$r.setPrevState = {
					title : goToThisPrev.title,
					name  : goToThisPrev.name,
					param : goToThisPrev.param
				};
			} else if ( isFlowState() ) {

				// if the back state is part of the flow, just specify the title
				// back state 'name' and 'param' will be added by internal values in rvApp.js
				$r.setPrevState = {
					title : prevTitle
				};
			} else if ( isAllowedState()  ) {

				// if back state is a state that can be loaded without any params
				// the 'params' is set to empty object so that the prevParam object
				// in rvApp.js is discarded
				$r.setPrevState = {
					title : prevTitle,
					name  : prevName,
					param : {}
				};
			} else {
				$r.setPrevState = angular.copy( DEFAULT_STATE );
			};

			/**
			 * check if the prev state is a flow state
			 * @returns {Boolean} is it flow state or not
			 */
			function isFlowState() {
				var found = _.find(flowStates, function (name) {
					return name === prevName;
				});

				return !!found;
			};

			/**
			 * check if the prev state is an allowed state
			 * @returns {Boolean} is it allowed state or not
			 */
			function isAllowedState() {
				var found = !!_.find(allowedStates, function (name) {
					return name === prevName;
				});

				return !!found;
			};
		};
		decideBackBtn($rootScope, $rootScope.diaryState);



		

	//adjuested property date time (rounded to next 15min slot time)
	$scope.adj_property_date_time 	= util.correctTime(propertyTime.hotel_time.date, propertyTime);

	/**
	 * two check whether two dates are same
	 * @param  {Date}  date1 [description]
	 * @param  {Date}  date2 [description]
	 * @return {Boolean}       [description]
	 */
	var isTwoDatesAreDifferent = function (date1, date2) {
		if (!(date1 instanceof Object)) {
			date1 = new Date(date1);
		}
		if (!(date2 instanceof Object)) {
			date2 = new Date(date2);
		}

		return (date1.getFullYear() !== date2.getFullYear() ||
			date1.getMonth() !== date2.getMonth() ||
			date1.getDate() !== date2.getDate());
	};

	/*--------------------------------------------------*/
	/*BEGIN CONFIGURATION
	/*--------------------------------------------------*/
	/*DATE UI CONFIG*/

		/**
		* function to execute on date selection
		* if it is on edit mode will change the reservation to another date after calling the API
		* other wise just switches the date
		* https://stayntouch.atlassian.net/browse/CICO-12418
		*/
		var onDateSelectionFromDatepicker = function(date_string, date_picker_obj) {
			var isOnEditMode = $scope.gridProps.edit.active,
				going_date = new Date (date_string);
			if (!isOnEditMode) {
				$scope.gridProps.filter.arrival_date = going_date;
				if(!$scope.$$phase) {
					$scope.$apply();
				}
				return true;
			}

			else if (isOnEditMode) {
				var choosedReservation = util.copyReservation ($scope.gridProps.currentResizeItem);

				//we are only allowing the RESERVED/CHECKING-IN reservations date transfer
				if (choosedReservation.reservation_status === 'reserved' || choosedReservation.reservation_status === 'check-in' ) {
					dateSelectedInEditMode (choosedReservation, going_date);
				}
				else {
					$scope.message = ['ONLY FUTURE/CHECKING-IN RESERVATION IS ALLOWED TO MOVE'];
					openMessageShowingPopup();
					return;
				}

			}
		};

		/**
		* while reservation is moving from one date to another we have to store in some services
		* this method is for that
		*/
		var storeDataForReservationMoveFromOneDateToAnother  = function (cur_reservation, orig_reservation, room_to, room_orig) {
			// setting the service variables for reservation transfrer
			rvDiarySrv.isReservationMovingFromOneDateToAnother = true;
			rvDiarySrv.movingReservationData.reservation = cur_reservation;
			rvDiarySrv.movingReservationData.room_to = room_to;
			rvDiarySrv.movingReservationData.originalRoom = room_orig;
			rvDiarySrv.movingReservationData.originalReservation = orig_reservation;
		};

		/**
		* while reservation is moving from one date to another we have to store in some services
		* this method is to reset the data that set during trnasfer
		*/
		var resetTheDataForReservationMoveFromOneDateToAnother  = function () {
			// setting the service variables for reservation transfrer
			rvDiarySrv.isReservationMovingFromOneDateToAnother = false;
			rvDiarySrv.movingReservationData.reservation = undefined;
			rvDiarySrv.movingReservationData.room_to = undefined;
			rvDiarySrv.movingReservationData.originalRoom = undefined;
			rvDiarySrv.movingReservationData.originalReservation = undefined;
		};


		//first we are resetting the reservation data if ther was already there
		resetTheDataForReservationMoveFromOneDateToAnother();

		/*DATE UI CONFIG*/
		var minDate = new tzIndependentDate($rootScope.businessDate);
		minDate.setDate(minDate.getDate() - 1);
		$scope.dateOptions = {
	    	showOn: 'button',

	    	numberOfMonths: 1,
	    	onSelect: onDateSelectionFromDatepicker
	    };

	    _.extend($scope, payload);
	    console.log( payload );

	    $scope.data 	= $scope.room;
	    $scope.stats 	= $scope.availability_count;
	    $scope.selectedReservations = [];
	    $scope.callBackAfterClosingMessagePopUp = undefined;

	    var isVaultDataSet = false;
     	var vaultData = rvDiarySrv.ArrivalFromCreateReservation();
     	var correctTimeDate = {};

     	if(vaultData) {
            isVaultDataSet = true;
        } else {
        	// we will be creating our own data base on the current time.
        	var coming_date = payload.display.x_n instanceof Date ? payload.display.x_n.toComponents().date.toDateString().replace(/-/g, '/') : payload.display.x_n;
        	correctTimeDate = util.correctTime(coming_date, propertyTime);
        }


        /*--------------------------------------------------*/
		/*BEGIN CONFIGURATION
		/*--------------------------------------------------*/

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
				hours: 						24,
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
				x_p_time:                  (!payload.display.x_p_time ? payload.display.x_p.toComponents().time.convertToReferenceInterval(15) : payload.display.x_p_time),
				width: 						undefined,
				height: 					undefined,
				hours: 						48,
				row_height: 				24, //please set to 60 when default changeed to 12 hour mode
				row_height_margin: 			0,
				intervals_per_hour: 		4,
				ms_15:                      900000,
				ms_hr: 						3600000,
				px_per_ms: 					undefined,
				px_per_int: 				undefined,
				px_per_hr: 					undefined,
				currency_symbol:            $rootScope.currencySymbol,
				min_hours: 					isVaultDataSet ? vaultData.minHours : payload.display.min_hours,
				property_date_time:  		$scope.adj_property_date_time
			},

			availability: {
				resize: {
					current_arrival_time : null,
					current_departure_time: null,
					last_arrival_time : null,
					last_departure_time: null
				},
				drag: {
					lastRoom: null
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
				currentResizeItemRow:       undefined,
				reset_scroll:               undefined
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
				$scope.openRateTypeChoosingBox = !$scope.openRateTypeChoosingBox;
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
		},

		unassignedRoomList: {
			open: false,
			data: [],
			fetchList: function() {
				var _sucess = function(data) {
					this.data = data;
					this.open = true;
					$scope.renderGrid();

					$scope.$emit('hideLoader');
				}.bind(this);

				var _failed = function(error) {
					this.data = [];
					$scope.errorMessage = error;
					$scope.renderGrid();

					$scope.$emit('hideLoader');
				}.bind(this);

				if ( this.open ) {
					this.data = [];
					this.open = false;
				} else {
					this.data = [];
					$scope.invokeApi(rvDiarySrv.fetchUnassignedRoomList, {}, _sucess, _failed);
				}
			},
			selectAnUnassigned: function(arrivalTime, arrivalDate, roomTypeId) {
				var params = getCustomAvailabilityCallingParams(arrivalTime, arrivalDate, roomTypeId);

				var options = {
					params: 			params,
					successCallBack: 	successCallBackOfAvailabilityFetching,
					failureCallBack: 	failureCallBackOfAvailabilityFetching,
					successCallBackParameters:  params
				};

				$scope.callAPI(rvDiarySrv.Availability, options);
			},
			dropReservation: function() {
				var _sucess = function(data) {
					$scope.$emit('hideLoader');
					this.fetchList();
				}.bind(this);

				var _failed = function() {
					$scope.$emit('hideLoader');
				}.bind(this);

				$scope.invokeApi(rvDiarySrv.dwad, {}, _sucess, _failed);
			}
		}
	};

	$scope.gridProps.filter.room_types.unshift({ id: 'All', name: 'All', description: 'All' });

	//initially we dont want to set focus on CorporateSearch Text box
	$scope.focusOnCorporateSearchText = false;

	//whether we want the opened rate type choosing box
	$scope.openRateTypeChoosingBox = false;

		/*--------------------------------------------------*/
		/* BEGIN UTILITY METHOD SECTION */
		/*--------------------------------------------------*/
		function responseError(err) {
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


		/**
		* to clear the query in corporate finding text box
		* will focus to the textbox again
		*/
		$scope.clearCorporateSearchText = function () {
			$scope.corporateSearchText = '';
			setFocusOnCorporateSearchText ();
		};

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
				    		//setting scroll posiions when in edit mode
				    		var x_n = props.display.x_n instanceof Date ? props.display.x_n : new Date(props.display.x_n);
				    		x_n.setHours(0, 0, 0);
				    		var x_origin = row_item_data.arrival;
				    		$scope.gridProps.edit.reset_scroll = {
	    						'x_n'      : x_n.getTime(),
	    						'x_origin' : x_origin
	    					};

	    					//setting arrival_time as selected one reservation
	    					var new_arrival_time = new Date (row_item_data.arrival);
	    					new_arrival_time = new_arrival_time.toComponents().time.toHourAndMinute(":", 24);
	    					$scope.gridProps.filter.arrival_time = new_arrival_time;

	    					//if guest name is not found, we have to show account name
				    		if(!row_item_data.reservation_primary_guest_full_name) {
				    			$scope.gridProps.edit.originalItem.account_name = row_item_data.company_card_name ? row_item_data.company_card_name : row_item_data.travel_agent_name;
				    		}
				    		//restricing from choosing the date less than busines date
				    		var minDate = new tzIndependentDate($rootScope.businessDate);
							$scope.dateOptions.minDate = minDate;

				    		$scope.gridProps.availability.resize.last_arrival_time = null;
	    					$scope.gridProps.availability.resize.last_departure_time = null;


				    		$scope.renderGrid();
				    		if(!$scope.$$phase) {
				    			$scope.$apply();
				    		}
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
		    	$scope.$apply();
		    }
	    };


	 	$scope.onResizeStart = function(row_data, row_item_data) {
		};


	    var resizeEndForNewReservation = function (row_data, row_item_data) {
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

	    $scope.unassignRoom = function() {
			var params = {
				id: this.currentResizeItem.reservation_id
			};

			var success = function() {
				$scope.$emit('hideLoader');
				$scope.resetEverything();
			};

			var error = function(msg) {
				$scope.$emit('hideLoader');
				$scope.errorMessage = msg;
			};

			$scope.invokeApi(rvDiarySrv.unassignRoom, params, success, error);
	    }.bind($scope.gridProps);

	    var openMessageShowingPopup = function(){
			ngDialog.open({
				template: '/assets/partials/diary/rvDiaryMessages.html',
				scope: $scope,
				controller: 'RVDiaryMessageShowingCtrl'
			});
	    };

	   	/**
	    * method used to set focus on corporate account choosing textbox
	    */
	    var setFocusOnCorporateSearchText = function(){
	    	//turning on focusing directive's model value
	    	$scope.focusOnCorporateSearchText = true;

	    	//if it is coming from 'Outside of Angular world'
	    	if(!$scope.$$phase) {
				$scope.$apply();
			}
 	    };


	    var openEditConfirmationPopup = function() {
			ngDialog.open({
				template: '/assets/partials/diary/rvDiaryRoomTransferConfirmation.html',
				controller: 'RVDiaryRoomTransferConfirmationCtrl',
				scope: $scope
			});
	    };


	    $scope.editSave = function() {
	    	var props 			= $scope.gridProps,
	    		row_data 		= props.currentResizeItemRow,
	    		row_item_data 	= props.currentResizeItem,
	    		px_per_ms 		= props.display.px_per_ms,
	    		x_origin 		= props.display.x_n,
	    		originalRow     = props.edit.originalRowItem,
	    		originalOccupancy = props.edit.originalItem;

	    	$scope.roomXfer = {
	    		current: {
		    		room:  originalRow,
		    		occupancy: originalOccupancy
		    	},
		    	next: {
		    		room:  row_data,
		    		occupancy: row_item_data
	    		}
	    	};

	    	//https://stayntouch.atlassian.net/browse/CICO-12418
			if (rvDiarySrv.isReservationMovingFromOneDateToAnother) {
				var resData = rvDiarySrv.movingReservationData;
				$scope.roomXfer.current.room = originalRow = resData.originalRoom;
				$scope.roomXfer.current.occupancy = originalOccupancy = resData.originalReservation;
			}


	    	$scope.price = $scope.roomXfer.next.room.new_price ? ($scope.roomXfer.next.room.new_price - $scope.roomXfer.current.room.old_price) : 0;
	    	if($scope.price !== 0) {
				openEditConfirmationPopup();
			}
			else{


				// please refer this (CICO-11782)
				// https://stayntouch.atlassian.net/secure/attachment/19602/From%20Edit%20Mode%20To.pdf
				if(originalRow.room_type_id === row_data.room_type_id) {
					if ((originalOccupancy.arrival !== row_item_data.arrival) ||
						(originalOccupancy.departure !== row_item_data.departure)) {

						$scope.reserveRoom($scope.roomXfer.next.room, $scope.roomXfer.next.occupancy);
						//resetting the reservation data, that set during transfrer
						resetTheDataForReservationMoveFromOneDateToAnother ();
					}
					else{
						//reseting to min date
						$scope.dateOptions.minDate = null;

						if(originalRow.id !== row_data.id) {
							$scope.saveReservation(row_item_data, row_data);
						}
						else {
							$scope.resetEdit();
							$scope.renderGrid();

						}
						//resetting the reservation data, that set during transfrer
						resetTheDataForReservationMoveFromOneDateToAnother ();
					}
				}
				else{
					$scope.reserveRoom($scope.roomXfer.next.room, $scope.roomXfer.next.occupancy);
					//resetting the reservation data, that set during transfrer
					resetTheDataForReservationMoveFromOneDateToAnother ();
				}


			}
	    };

		$scope.reserveRoom = function(nextRoom, occupancy){

			// clearing the data bf

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
				numAdults: next.occupancy.adults,
	    		numChildren : next.occupancy.children,
	    		numInfants 	: next.occupancy.infants,
	    		guest_card_id: next.occupancy.guest_card_id,
	    		company_card_id: next.occupancy.company_card_id,
	    		travel_agent_id: next.occupancy.travel_agent_id,
	    		payment: {
	    			payment_type: next.occupancy.payment_type,
	    			payment_method_used: next.occupancy.payment_method_used,
	    			payment_method_description: next.occupancy.payment_method_description,
	    			payment_details: next.occupancy.payment_details
	    		},
	    		demographics: next.occupancy.demographics
			};
			dataToPassConfirmScreen.rooms = [];
			dataToPassConfirmScreen.rooms.push(rooms);
			$vault.set('temporaryReservationDataFromDiaryScreen', JSON.stringify(dataToPassConfirmScreen));

			$scope.closeDialog();
			$state.go('rover.reservation.staycard.mainCard.summaryAndConfirm', {
				reservation: 'HOURLY',
				mode:'EDIT_HOURLY'
			});
		};

		(function() {    /*React callbacks for grid events*/
			var prevRoom, prevTime;

		    $scope.onDragStart = function(room, reservation) {
		    	$scope.errorMessage = '';
		    	this.availability.drag.lastRoom = util.copyRoom(room);
		    	prevRoom = room;
		    	prevTime = reservation[meta.occupancy.start_date];
		    	if($scope.gridProps.edit.active) {
		    	}
			}.bind($scope.gridProps);

		    $scope.onDragEnd = function(nextRoom, reservation) {
		    	var availability;

		    	if($scope.gridProps.edit.active) {
			    	availability = determineAvailability(nextRoom[meta.room.row_children], reservation).shift();
		    		if(prevRoom.id !== nextRoom.id){
			    		util.reservationRoomTransfer($scope.gridProps.data, nextRoom, prevRoom, reservation);
						$scope.renderGrid();
					}
					$scope.gridProps.currentResizeItemRow = util.copyRoom(nextRoom);


					resizeEndForExistingReservation (nextRoom, reservation);
					prevRoom = '';
					prevTime = '';
				}
			};
		})();


	    var successCallBackOfResizeExistingReservation = function(data, successParams){
	    	var avData 		= data.availability,
	    		props  		= $scope.gridProps,
	    		oItem 		= props.edit.originalItem,
	    		oRowItem 	= props.edit.originalRowItem,
	    		lastArrTime = this.availability.resize.last_arrival_time,
	    		lastDepTime = this.availability.resize.last_departure_time;

			//if API returns that move is not allowed then we have to revert back
	    	if(!avData.is_available){
	    		if(!lastArrTime && !lastDepTime) {
	    			//removing the occupancy from Old Row, some times reservationRoomTransfer is not wroking fine
					if(props.currentResizeItemRow.id !== oRowItem.id){
						util.reservationRoomTransfer(this.data, oRowItem, props.currentResizeItemRow, oItem);

						var roomIndex 		= _.indexOf(_.pluck($scope.gridProps.data, 'id'), props.currentResizeItemRow.id);
						if(roomIndex !== -1) {
							var occupancyIndex 	= _.indexOf(_.pluck($scope.gridProps.data[roomIndex].occupancy, 'reservation_id'), oItem.reservation_id);
							if(occupancyIndex !== -1){
								$scope.gridProps.data[roomIndex].occupancy.splice(occupancyIndex);
							}
						}
					}
					var roomIndex 		= _.indexOf(_.pluck($scope.gridProps.data, 'id'), oRowItem.id);
					if(roomIndex !== -1) {
						var occupancyIndex 	= _.indexOf(_.pluck($scope.gridProps.data[roomIndex].occupancy, 'reservation_id'), oItem.reservation_id);
						if(occupancyIndex !== -1){
							$scope.gridProps.data[roomIndex].occupancy[occupancyIndex] = util.copyReservation( this.currentResizeItem);
						}
					}
					this.currentResizeItemRow = util.copyRoom(oRowItem);
					this.currentResizeItem.arrival = oItem.arrival;
	    			this.currentResizeItem.departure = oItem.departure;
	    		}
	    		else{
	    			//removing the occupancy from Old Row, some times reservationRoomTransfer is not wroking fine
					if(props.currentResizeItemRow.id !== this.availability.drag.lastRoom.id){
						util.reservationRoomTransfer(this.data, this.availability.drag.lastRoom, props.currentResizeItemRow, props.currentResizeItem);

						var roomIndex 		= _.indexOf(_.pluck($scope.gridProps.data, 'id'), props.currentResizeItemRow.id);
						if(roomIndex !== -1) {
							var occupancyIndex 	= _.indexOf(_.pluck($scope.gridProps.data[roomIndex].occupancy, 'reservation_id'), props.currentResizeItem.reservation_id);
							if(occupancyIndex !== -1){
								$scope.gridProps.data[roomIndex].occupancy.splice(occupancyIndex);
							}
						}

					}
					var roomIndex 		= _.indexOf(_.pluck($scope.gridProps.data, 'id'), this.availability.drag.lastRoom.id);
					if(roomIndex !== -1) {
						var occupancyIndex 	= _.indexOf(_.pluck($scope.gridProps.data[roomIndex].occupancy, 'reservation_id'), props.currentResizeItem.reservation_id);
						if(occupancyIndex !== -1){
							$scope.gridProps.data[roomIndex].occupancy[occupancyIndex] = this.currentResizeItem;
						}
					}
					this.currentResizeItemRow = this.availability.drag.lastRoom;
					this.currentResizeItem.arrival = lastArrTime;
	    			this.currentResizeItem.departure = lastDepTime;
	    		}
	    		$scope.message = avData.message;
				openMessageShowingPopup();
	    		$scope.renderGrid();
	    		return;

	    	}
	    	if(avData.new_rate_amount === null) {
	    		avData.new_rate_amount = avData.old_rate_amount;
	    	}

	    	this.edit.originalRowItem.old_price = parseFloat(avData.old_rate_amount);
	    	this.currentResizeItemRow.new_price = parseFloat(avData.new_rate_amount);
	    	this.currentResizeItemRow.rate_id 		= avData.old_rate_id;
	    	this.currentResizeItemRow.departureTime = successParams.params.end_time;
	    	this.currentResizeItemRow.departureDate = new Date(successParams.params.end_date).toComponents().date.toDateString().replace(/-/g, '/');
    		this.currentResizeItemRow.arrivalTime = successParams.params.begin_time;
	    	this.currentResizeItemRow.arrivalDate = new Date(successParams.params.begin_date).toComponents().date.toDateString().replace(/-/g, '/');
	    	this.availability.resize.last_arrival_time = this.currentResizeItem[meta.occupancy.start_date];
	    	this.availability.resize.last_departure_time = this.currentResizeItem[meta.occupancy.end_date];
	    	if(this.availability.drag.lastRoom && (this.availability.drag.lastRoom.id !== this.currentResizeItemRow.id)){
		    	var roomIndex 		= _.indexOf(_.pluck($scope.gridProps.data, 'id'), this.availability.drag.lastRoom.id);
				if(roomIndex !== -1) {
					var occupancyIndex 	= _.indexOf(_.pluck($scope.gridProps.data[roomIndex].occupancy, 'reservation_id'), this.currentResizeItem.reservation_id);
					if(occupancyIndex !== -1){
						$scope.gridProps.data[roomIndex].occupancy.splice(occupancyIndex);
					}
					$scope.gridProps.currentResizeItem.room_id = this.currentResizeItemRow.id;
				}
			}
	    	this.availability.drag.lastRoom = util.copyRoom(this.currentResizeItemRow);
	    	$scope.renderGrid();
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
	    		successCallBackParameters:  {
					params : params,
					row_data: row_data,
					row_item_data: row_item_data
	    		}
	    	};
	    	$scope.callAPI(rvDiarySrv.roomAvailabilityCheckAgainstReservation, options);
	    };

	    $scope.onResizeEnd = function(row_data, row_item_data){
			if($scope.gridProps.edit.active) {
				resizeEndForExistingReservation (row_data, row_item_data);
			}
			else{
				resizeEndForNewReservation (row_data, row_item_data);
			}
	    };

	    $scope.onScrollEnd = function(current_scroll_pos) {
	    	$scope.toggleRows($scope.gridProps.filter.show_all_rooms, current_scroll_pos);
	    	$scope.gridProps.edit.reset_scroll = undefined;
	    };

	    $scope.toggleRows = function(state, current_scroll_pos) {
	    	$scope.gridProps.filter.show_all_rooms = state;
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
	 		ReactDOM.render(
				React.createElement(DiaryContent, _.extend(args, $scope.gridProps)),
				document.getElementById('component-wrapper')
			);
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

	    	roomIndex 		= _.indexOf(_.pluck($scope.gridProps.data, 'id'), props.edit.originalRowItem.id);
	    	data = $scope.gridProps.data;
	    	util.reservationRoomTransfer($scope.gridProps.data, props.edit.originalRowItem, props.currentResizeItemRow, props.currentResizeItem);
	    	//whether it is in another date with reservation transfer
			if (rvDiarySrv.isReservationMovingFromOneDateToAnother) {
				//finding the reservation date to move back
				var reservation = rvDiarySrv.movingReservationData.originalReservation;
				var goBackDate = new tzIndependentDate (reservation.arrival);
				goBackDate.setHours (0, 0, 0);

				if(!isTwoDatesAreDifferent ($scope.gridProps.filter.arrival_date, goBackDate)) {
					$timeout(function(){
			            var arrival_ms = props.filter.arrival_date.getTime(),
			            	time_set = util.gridTimeComponents(arrival_ms, 48, util.deepCopy($scope.gridProps.display));

			            $scope.gridProps.display = util.deepCopy(time_set.display);
						callDiaryAPIsAgainstNewDate(time_set.toStartDate(), time_set.toEndDate());
					}, 0);
				}

				//we are loading the diary with reservation date
				$scope.gridProps.filter.arrival_date = goBackDate;
				//changing the display date in calendar also
				changeCalendarDate (goBackDate);

				//resetting the reservation data, that set during transfrer
				resetTheDataForReservationMoveFromOneDateToAnother ();
			}

	    	//reseting to min date
    		$scope.dateOptions.minDate = null;

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
			$scope.gridProps.edit.currentResizeItem = undefined;    //Planned to transfer the non-namespaced currentResizeItem/Row to here
			$scope.gridProps.edit.currentResizeItemRow = undefined; //Planned to transfer the non-namespaced currentResizeItem/Row to here

			//resetting the reservation data, that set during transfrer
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
		var rooms = $scope.gridProps.data,
			room,
            m_status = meta.occupancy.status,
            id = meta.occupancy.id,
			reject = function(child) {
				return angular.lowercase(child[m_status]) === 'available' || angular.lowercase(child[m_status]) === 'blocked';
			};

		for(var i = 0, len = rooms.length; i < len; i++) {
			room 			= rooms[i];
		room.occupancy 	= _.reject(room.occupancy, reject);
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

                row_item_data:  row_item_data,
                row_data:       _.findWhere(rvDiarySrv.data_Store.get('room'), { id: row_item_data.room_id })
            });
		}
		else {
			//opening the popup with messages
			$scope.callBackAfterClosingMessagePopUp = undefined;
			$scope.message	= ['Sorry, No Availability found. Please change the parameter and continue'];
			openMessageShowingPopup();
			return;
		}
		$scope.renderGrid();

	}.bind($scope.gridProps);

	var failureCallBackOfAvailabilityFetching = function(errorMessage){
		$scope.errorMessage = errorMessage;
	};

	var openRateTypeSelectBox = function() {
		$scope.openRateTypeChoosingBox = true;
	};

	var callAvailabilityAPI = function(){
		var params = getAvailabilityCallingParams(),
			filter = $scope.gridProps.filter;

		if(filter.rate_type === 'Corporate' && !filter.rate) {
			//if Rate type select box is not open, we have to
			openRateTypeSelectBox();

			//opening the popup with messages
			$scope.callBackAfterClosingMessagePopUp = setFocusOnCorporateSearchText;
			$scope.message	= ['Please choose a Company Card or Travel Agent to proceed'];
			openMessageShowingPopup();

			//we are not calling the API
			return;
		}
		var options = {
    		params: 			params,
    		successCallBack: 	successCallBackOfAvailabilityFetching,
    		failureCallBack: 	failureCallBackOfAvailabilityFetching,
    		successCallBackParameters:  params
    	};
    	$scope.callAPI(rvDiarySrv.Availability, options);
	};

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

		start 		= new Date(this.currentResizeItem.arrival).toComponents().date.toDateString().replace(/-/g, '/'),
		end 		= new Date(this.currentResizeItem.departure).toComponents().date.toDateString().replace(/-/g, '/'),
		rate_type 	= getRateType (this.currentResizeItem),
		account_id  = getAccountID (this.currentResizeItem),

		room_id 	= this.currentResizeItemRow.id,
		reservation_id = this.currentResizeItem.reservation_id,

		arrivalTime = new Date(this.currentResizeItem.arrival).toComponents().time;
		arrivalTime = arrivalTime.hours + ":" + arrivalTime.minutes + ":" + arrivalTime.seconds;

		depTime 	= new Date(this.currentResizeItem.departure).toComponents().time;
		depTime 	= depTime.hours + ":" + depTime.minutes + ":" + depTime.seconds;
        var params = {
            room_id:            room_id,
            reservation_id:     reservation_id,
            begin_date:         start,
            begin_time:         arrivalTime,
            end_date:           end,
            end_time:           depTime,
            rate_type:          rate_type
        };
        if(account_id) {
			params.account_id = account_id;
		}

		return params;
	}.bind($scope.gridProps);

	var getAvailabilityCallingParams = function() {
		var filter 		= _.extend({}, this.filter),
			time_span 	= Time({ hours: this.display.min_hours }),
			start_date 	= new Date(this.display.x_n);
			start_date.setHours(0, 0, 0);

		var	getIndex    = filter.arrival_times.indexOf(filter.arrival_time),
			start_time 	= new Date((getIndex * 900000) + start_date.getTime()).toComponents().time,

			start = new Date(start_date.getFullYear(),
							 start_date.getMonth(),
							 start_date.getDate(),
							 start_time.hours,
							 start_time.minutes,
							 0, 0);
			var selected_hour_min = $scope.gridProps.filter.arrival_time.split(":"),
					hour = selected_hour_min[0],
					min  = selected_hour_min[1];
			start.setHours(hour, min);
		var end = new Date(start.getFullYear(),
						   start.getMonth(),
						   start.getDate(),
						   start.getHours()  + time_span.hours,
						   start.getMinutes() + time_span.minutes,
						   0, 0),
			rt_filter = (_.isEmpty(filter.room_type) || (filter.room_type && angular.lowercase(filter.room_type.id) === 'all')  ? undefined : filter.room_type.id),
			rate_type = filter.rate_type,
			account_id = (filter.rate_type === 'Corporate' && filter.rate && filter.rate !== '' ) ? filter.rate.id : undefined,
			GUID = "avl-101";//No need to manipulate this thing from service part, we are deciding


			if(start.isOnDST()){
			}
			if(end.isOnDST()){
			}

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
		return paramsToReturn;
	}.bind($scope.gridProps);

	var getCustomAvailabilityCallingParams = function(arrivalTime, arrivalDate, roomTypeId) {
		function processTime(time) {
			var time = time || '00:00';
			var at = time.split(':');
			var hh = parseInt( at[0] );
			var mm = parseInt( at[1] );
			var hhs = '00';
			var mms = '00';
			/**/
			hh = isNaN(hh) ? 0 : hh;
			mm = isNaN(mm) ? 0 : mm;
			/**/
			if ( mm > 0 && mm <= 15 ) {
				mm = 15;
			} else if ( mm > 15 && mm <= 30 ) {
				mm = 30;
			} else if ( mm > 30 && mm <= 45 ) {
				mm = 45;
			} else {
				mm = 0;
				hh += hh;
				// TODO: if this is gonna move the arrival date, update the provide arrival date
			}
			/**/
			if ( hh < 10 ) {
				hhs = '0' + hh;
			} else {
				hhs = hh.toString();
			}
			if ( mm < 10 ) {
				mms = '0' + hh;
			} else {
				mms = mm.toString();
			}

			return {
				hh: hh,
				mm: mm,
				hhmm: hhs + ':' + mms
			};
		}

		function processDate(date) {
			var ad = date.split('-');
			var mm = parseInt( ad[1] );
			var dd = parseInt( ad[2] );
			/**/
			mm = isNaN(mm) ? 1 : mm;
			dd = isNaN(dd) ? 0 : dd;

			return {
				mm: mm - 1,
				dd: dd
			};
		}

		var processedAt = processTime(arrivalTime);
		var processedAd = processDate(arrivalDate);

		var filter = _.extend({}, this.filter);
		var time_span = Time({ hours: this.display.min_hours });

		var start_date = new Date(this.display.x_n);
		start_date.setHours(0, 0, 0);

		var	getIndex = filter.arrival_times.indexOf( processedAt.hhmm );
		var start_time = new Date((getIndex * 900000) + start_date.getTime()).toComponents().time;
		/**/
		var start = new Date(
			start_date.getFullYear(),
			start_date.getMonth(),
			start_date.getDate(),
			start_time.hours,
			start_time.minutes,
			0,
			0
		);
		start.setHours(
			processedAt.hh,
			processedAt.mm
		);
		/**/
		var end = new Date(
			start.getFullYear(),
			start.getMonth(),
			start.getDate(),
			start.getHours()  + time_span.hours,
			start.getMinutes() + time_span.minutes,
			0,
			0
		);

		var GUID = "avl-101";

	    return{
	        start_date: start,
			end_date: end,
			room_type_id: roomTypeId,
			GUID: GUID
		};
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
				template: '/assets/partials/diary/rvDiaryConfirmation.html',
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

	var callDiaryAPIsAgainstNewDate = function(start_date, end_date, rate_type, arrival_time, room_type){
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
			}
			else {
				$scope.clearAvailability();
				$scope.resetEdit();
				$scope.renderGrid();
				//reservation trnsfr from one date to another started
				if (rvDiarySrv.isReservationMovingFromOneDateToAnother) {

					var resData = rvDiarySrv.movingReservationData;
					var reservation_id = resData.reservation.reservation_id;
					switchToEditMode (reservation_id);
					$scope.gridProps.edit.originalItem = resData.originalReservation;
					$scope.gridProps.edit.originalRowItem = resData.originalRoom;
					resizeEndForExistingReservation ($scope.gridProps.currentResizeItemRow, $scope.gridProps.currentResizeItem);
				}
				else {
					$scope.gridProps.filter.rate_type = rate_type ? rate_type : "Standard";
					$scope.gridProps.filter.arrival_time = arrival_time ? arrival_time: "00:00";
					$scope.gridProps.filter.room_type = room_type ? room_type : "";
				}

				$scope.$emit('hideLoader');
			}
		});
	};

	/**
	* function to return Rate type.
	* @param {object} reservation
    * @return {String} Rate type
	*/
	var getRateType = function (reservation) {
		return ( reservation.travel_agent_id === null || reservation.travel_agent_id === '') &&
				( reservation.company_card_id === null || reservation.company_card_id === '') ?
				'Standard': 'Corporate';
	};

	/**
	* function to return the accound id against a reservation
	* @param {object} reservation
    * @return {String} account id
	*/
	var getAccountID = function (reservation) {
		return getRateType (reservation) === 'Corporate' ?
				(reservation.travel_agent_id ? reservation.travel_agent_id : reservation.company_card_id) : undefined;
	};

	/**
	* function to build the params required for the API to check whether
	* the reservation transfer from one date to another is allowed or valid
	* (NOTE: it is specifically using for dates which which is greater than displaying hours)
	* @param {object} reservation
	* @param {date} date to which reservation is trying to move
    * @return {object} contains necessary params
	*/
	var getReservationTransferParams = function (reservation, transferring_date){
		var filter 	= _.extend({}, $scope.gridProps.filter),

		start_date 	= transferring_date,
		start_time 	= new Date (filter.arrival_times.indexOf(filter.arrival_time) * 900000 + start_date.getTime()),
		start_date 	= start_date.toComponents().date.toDateString(),

		// finding the difference of actual arrival & departure,
		// will use this to calculate departure
		// from newly formed arrival time
		res_arrival_time 	= new Date (reservation.arrival),
		res_dep_time 		= new Date (reservation.departure),
		diff = 	res_dep_time.getTime() - res_arrival_time.getTime(),

		end_date 	= new Date (start_time.getTime() + diff),
		end_time 	= end_date.toComponents().time,
		end_date 	= end_date.toComponents().date.toDateString(),

		start_time 	= start_time.toComponents().time,
		start_time 	= start_time.hours + ":" + start_time.minutes + ":" + start_time.seconds,
		end_time 	= end_time.hours + ":" + end_time.minutes + ":" + end_time.seconds,

		rate_type 	= getRateType (reservation),
		account_id  = getAccountID (reservation),

		room_id 	= $scope.gridProps.edit.originalRowItem.id,
		reservation_id = reservation.reservation_id;

		//forming the returning params
        var params = {
            room_id:            room_id,
            reservation_id:     reservation_id,
            begin_date:         start_date,
            begin_time:         start_time,
            end_date:           end_date,
            end_time:           end_time,
            rate_type:          rate_type
        };
        if(account_id) {
			params.account_id = account_id;
		}

		return params;
	};

	/**
	* success callback of API in edit mode date change
	* will decide whether the move is allowed or not
	* if it is a valid move we will change the arrival date to the chosen date
	* otherwise we will keep the arrival date as old
	*/
	var failureCallBackOfSelectDateInEditMode = function (response) {
	};

	/**
	* function to change the date of the calendar
	* it is only for displaying purpose
	* it is not actual date model
	* actual data model is $scope.gridProps.filter.arrival_date
	* we are keeping both inorder to perform some operation on select and if it  is okey
	* after selection we will assign duplicate model to original model
	*/
	var changeCalendarDate = function (date) {
		$scope.duplicte_arrival_date = date;
	};

	/**
	* success callback of API in edit mode date change
	* will decide whether the move is allowed or not
	* if it is a valid move we will change the arrival date to the chosen date
	* otherwise we will keep the arrival date as old
	*/
	var successCallBackOfDateSelectedInEditMode = function (response, successParams) {
		response = response.availability;
		var response_code = response.response_code,
			old_props = successParams.oldGridProps;

		switch (response_code) {
			case "ROOM_ROOM_TYPE_AVAILABLE":
				doOperationIfValidMove (old_props, response, successParams);
				break;
			case "ROOM_DIFF_ROOM_TYPE_AVAILABLE":
				$scope.message = [response.response_message];
				//defining callback for Ok button in msg box
				$scope.callBackAfterClosingMessagePopUp = function() {
					doOperationIfValidMove (old_props, response, successParams);
					$scope.callBackAfterClosingMessagePopUp = undefined;
				};
				openMessageShowingPopup();
				break;
			case "ROOM_ROOM_TYPE_DIFF_AVAILABLE":
				$scope.message = [response.response_message];
				//defining callback for Ok button in msg box
				$scope.callBackAfterClosingMessagePopUp = function() {
					doOperationIfValidMove (old_props, response, successParams);
					$scope.callBackAfterClosingMessagePopUp = undefined;
				};
				openMessageShowingPopup();
				break;
			case "NOT_AVAILABLE":
				$scope.message = [response.response_message];
				openMessageShowingPopup();

				//changing the display date in calendar also
				changeCalendarDate (old_props.filter.arrival_date);
				break;
			case "OOO":
				$scope.message = [response.response_message];
				//defining callback for Ok button in msg box
				$scope.callBackAfterClosingMessagePopUp = function() {
					doOperationIfValidMove (old_props, response, successParams);
					$scope.callBackAfterClosingMessagePopUp = undefined;
				};
				openMessageShowingPopup();
				break;
			case "BLOCKED":
				$scope.message = [response.response_message];
				//defining callback for Ok button in msg box
				$scope.callBackAfterClosingMessagePopUp = function() {
					doOperationIfValidMove (old_props, response, successParams);
					$scope.callBackAfterClosingMessagePopUp = undefined;
				};
				openMessageShowingPopup();
				break;
			default:
				break;
		};
	};

	/**
	* if the reservation date move is valid, we have to do some operations
	* @param {object} API response
	* @param {object} success params
	*/
	var doOperationIfValidMove = function (old_props, api_response, successParams) {
		//stroing the data in service
		var props = old_props,
			filter = props.filter,
			choosedReservation = util.copyReservation (props.currentResizeItem),
			originalReservation = util.copyReservation (props.edit.originalItem),
			originalRoom = util.copyRoom (props.edit.originalRowItem),
			room_to = util.copyRoom (_.findWhere(props.data, {id: api_response.available_room_id})),
			hour = filter.arrival_time.split(":")[0],
			minutes = filter.arrival_time.split(":")[1];

		//changing the arrival & departure time of chosen reservation
		var start_time 	= new Date (choosedReservation.arrival);
		start_time.setHours (hour, minutes);


		// finding the difference of actual arrival & departure,
		// will use this to calculate departure
		// from newly formed arrival time
		var res_arrival_time 	= new Date (choosedReservation.arrival),
			res_dep_time 		= new Date (choosedReservation.departure),
			diff = 	res_dep_time.getTime() - res_arrival_time.getTime(),
			end_time 	= new Date (start_time.getTime() + diff);

		// changing the arrival/dep as choosed in filter area
		choosedReservation.arrival = start_time.getTime();
		choosedReservation.departure = end_time.getTime();

		//changing room the id to the id from API
		choosedReservation.room_id = room_to.id;
		storeDataForReservationMoveFromOneDateToAnother (choosedReservation, originalReservation, room_to, originalRoom);

		// we always wanted to keep the hours & minute as zero as
		// display started like that
		successParams.chosenDate.setHours (0, 0, 0);

		// so we can change the arrival date inorder to show diary against new date
		$scope.gridProps.filter.arrival_date = successParams.chosenDate;
		if(!$scope.$$phase) {
			$scope.$apply();
		}
	};


	/**
	* if a date is chosen in edit mode (active)
	* it is for one reservation transfer from one date to another
	* we have to call the API and decide whether the move is allowed or not
	* @param {date} date to which reservation is trying to move
	*/
	var dateSelectedInEditMode = function (reservation, newValue) {
		if (this.filter.arrival_time === '') {
			$scope.message = ['Please choose arrival time and retry'];
			openMessageShowingPopup();
			return;
		}
		var current_date = new Date ($scope.gridProps.filter.arrival_date);

		// we will allow only if there is any change in date
		if(newValue.getFullYear() !== current_date.getFullYear() ||
			newValue.getMonth() !== current_date.getMonth() ||
			newValue.getDate() !== current_date.getDate()) {
			var params = getReservationTransferParams (reservation, newValue);
			var options = {
	    		params: 			params,
	    		successCallBack: 	successCallBackOfDateSelectedInEditMode,
	    		failureCallBack: 	failureCallBackOfSelectDateInEditMode,
	    		successCallBackParameters:{
					chosenDate : newValue,
					oldGridProps: util.deepCopy ($scope.gridProps)
		    	}
		    };
		    $scope.callAPI(rvDiarySrv.checkAvailabilityForReservationToA_Date, options);
		}
	}.bind($scope.gridProps);

	/**
	* function to watch arrival date change,
	* will call the necessary APIs and chnage the display according to new date
	*/
	var arrival_date_watcher = function(newValue, oldValue) {
		var props = $scope.gridProps,
			filter = props.filter,
			arrival_ms = filter.arrival_date.getTime(),
			time_set;
		$scope.$emit('hideLoader');

		if(isTwoDatesAreDifferent (newValue, oldValue)) {
            time_set = util.gridTimeComponents(arrival_ms, 48, util.deepCopy($scope.gridProps.display));
            $scope.gridProps.display = util.deepCopy(time_set.display);
			callDiaryAPIsAgainstNewDate(time_set.toStartDate(), time_set.toEndDate());
		}
	};

	//registering watcher against arrival date change
	$scope.$watch('gridProps.filter.arrival_date',  arrival_date_watcher);

	var $_resetObj = {};

    $scope.resetEverything = function() {
    	var _sucessCallback = function(propertyTime) {

	    	var propertyDate = new tzIndependentDate( propertyTime.hotel_time.date );
			propertyDate.setHours(0, 0, 0);

	    	$_resetObj = util.correctTime(propertyDate.toComponents().date.toDateString().replace(/-/g, '/'), propertyTime);

			$_resetObj.callback = function() {
				$scope.gridProps.filter.arrival_time = $_resetObj.arrival_time;
				$scope.gridProps.filter.rate_type = 'Standard';
				$scope.gridProps.filter.room_type = '';

				var display_offset = new tzIndependentDate($_resetObj.start_date);

		    	$scope.gridProps.edit.reset_scroll = {
		    		'x_n'      : propertyDate,
		    		'x_origin' : $_resetObj.start_date
		    	};
	    		$scope.renderGrid();
	    		$scope.$emit('hideLoader');
				$timeout(function() {
					$_resetObj = {};
				}, 300);
			};

			$scope.gridProps.filter.arrival_date = propertyDate;
			//changing the display date in calendar also
			changeCalendarDate ($scope.gridProps.filter.arrival_date);
			$scope.gridProps.display.min_hours = 4;
			//resetting the reservation data, that set during transfrer
			resetTheDataForReservationMoveFromOneDateToAnother ();
			if(!$scope.$$phase) {
				$scope.$apply();
			}

    	};


    	// making sure no previous reset in progress
    	if ( ! $scope.gridProps.edit.reset_scroll ) {
	    	$scope.clearAvailability();
			$scope.resetEdit();
			$scope.renderGrid();

	    	$scope.invokeApi(RVReservationBaseSearchSrv.fetchCurrentTime, {}, _sucessCallback);
    	};
    };

    /**
	* utility function to form reservation params for save API
	*/
    var formReservationParams = function(reservation, roomDetails, isMoveWithoutRateChange) {
    	console.log( reservation );
    	console.log( roomDetails );

    	var arrDate 	= roomDetails.arrivalDate,
    		depDate   	= roomDetails.departureDate,
    		arrTime 	= roomDetails.arrivalTime.split(":"),
    		depTime 	= roomDetails.departureTime.split(":");


    		arrTime 	= getTimeFormated(arrTime[0], arrTime[1]);
    		depTime 	= getTimeFormated(depTime[0], depTime[1]);

        //  CICO-13760
        //  The API request payload changes
        var stay = [];
        var reservationStayDetails = [];
        var stayDates = getDatesBetweenTwoDates (new Date(arrDate), new Date(depDate));

       _.each(stayDates, function(date) {
            reservationStayDetails.push({
                date: 			$filter('date')(date, $rootScope.dateFormatForAPI),
                rate_id: 		roomDetails.rate_id, // In case of the last day, send the first day's occupancy
                room_type_id: 	roomDetails.room_type_id,
                adults_count: 	reservation.adults,
                children_count: reservation.children,
                infants_count: 	reservation.infants,
                room_id: 		roomDetails.id
            });
        });
        stay.push(reservationStayDetails);

    	return {
    		// I dont knw y this require, but for the simplicity of API they force me to add :(
    	 	// even though it is in staydates array
    		'room_id'		: [roomDetails.id],
    		'arrival_date'	: arrDate,
    		'arrival_time'	: arrTime,
    		'departure_date': depDate,
    		'departure_time': depTime,
    		'reservationId' : reservation.reservation_id,
    		'stay_dates': stay,

    		//CICO-14143: Diary - Move without rate change actually changes rate
    		'is_move_without_rate_change' : isMoveWithoutRateChange ?  isMoveWithoutRateChange : false
    	};
    };

    /**
    * function used to save reservation from Diary itself
    */
	$scope.saveReservation = function(reservation, roomDetails, isMoveWithoutRateChange){
		var params = formReservationParams(reservation, roomDetails, isMoveWithoutRateChange);

		var options = {
    		params: 			params,
    		successCallBack: 	successCallBackOfSaveReservation,
    		failureCallBack: 	failureCallBackOfSaveReservation
	    };
	    $scope.callAPI(RVReservationSummarySrv.updateReservation, options);
	};

	$scope.saveReservationOnDrop = function(reservation, roomDetails, isMoveWithoutRateChange){

		// first determine if possible
		// determineAvailability(allResInRow, thisRes)

		console.log( arguments );
		return;

		var params = formReservationParams(reservation, roomDetails, isMoveWithoutRateChange);

		var options = {
    		params: 			params,
    		successCallBack: 	$scope.resetEverything,
    		failureCallBack: 	failureCallBackOfSaveReservation
	    };
	    $scope.callAPI(RVReservationSummarySrv.updateReservation, options);
	};

	var successCallBackOfSaveReservation = function(data){
		var filter 		= this.filter,
			arrival_ms 	= $scope.gridProps.display.x_n,

			time_set 	= util.gridTimeComponents(arrival_ms, 48, util.deepCopy(this.display)),
			arrival_time = filter.arrival_time,

			room_type = filter.room_type,
			rate_type = filter.rate_type;

		//CICO-14109 - Red line disappears from view after saving reservation from diary itself
		var current_proptime = $scope.gridProps.display.property_date_time;


        $scope.gridProps.display = util.deepCopy(time_set.display);

        //CICO-14109 - Red line disappears from view after saving reservation from diary itself
        $scope.gridProps.display.property_date_time = current_proptime;

        //rerendering diary with new data
		callDiaryAPIsAgainstNewDate(time_set.toStartDate(), time_set.toEndDate(), rate_type, arrival_time, room_type);
	}.bind($scope.gridProps);

	var failureCallBackOfSaveReservation = function(errorMessage){
		$scope.errorMessage = errorMessage;
	};


	$scope.clickedOnArrivalTime = function(){
		$scope.gridProps.availability.resize.current_arrival_time = null;
		$scope.gridProps.availability.resize.current_departure_time = null;
		$scope.gridProps.availability.resize.last_arrival_time = null;
		$scope.gridProps.availability.resize.last_departure_time = null;
		if(!$scope.gridProps.edit.active) {
			$scope.Availability();
		} else if ( $scope.gridProps.filter.arrival_time === '' ) {
			$scope.clearAvailability();
			$scope.resetEdit();
			$scope.renderGrid();
		};
	};

	$scope.clickedOnRoomType = function(){
		if ( !$scope.gridProps.edit.active && !!$scope.gridProps.filter.room_type ) {
			$scope.Availability();
		} else if ( $scope.gridProps.filter.room_type === null ) {
			$scope.clearAvailability();
			$scope.resetEdit();
			$scope.renderGrid();
		};
	};

	$scope.clickedOnRateType = function(){
		if($scope.gridProps.filter.rate_type === 'Standard') {
			$scope.gridProps.filter.rate = '';
		}
		//CICO-11832
		else if($scope.gridProps.filter.rate_type === 'Corporate') {
			if($scope.gridProps.filter.rate && $scope.gridProps.filter.rate !== '') {
				$scope.compCardOrTravelAgSelected();
			}
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
		console.log(arguments);
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

	/**
	* function used to switch to edit,
	* it is being used on coming from staycard or date change of reservation
	*/
	var switchToEditMode = function(reservation_id){
		// we are checking for whether we need to find the reservation against ID passed from someother state
		// and change the diary to edit mode
		if(reservation_id) {
			var rooms 				= $scope.gridProps.data,
				row_data 			= null,
				row_item_data 		= null,
				occpancies 			= null,
				reservation_details = null;

			_.each(rooms, function(room_detail) {
				occpancies 		= room_detail['occupancy'];

				_.each(occpancies,  function(occupancy) {
					if(_.has(occupancy, 'reservation_id')) {
						if(occupancy['reservation_id'] === parseInt(reservation_id)){
							row_item_data = occupancy;
							row_data = room_detail;
						}
					}
				});

			});
			if(row_data){
				$scope.onSelect(row_data, row_item_data, false, 'edit');
			}

		}
	};

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
				return room_type_id === item.id;
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

	/**
	* React calling method after rendering
	* will switch to edit mode if there is any reservaion id in stateparam
	*/
	$scope.eventAfterRendering = function() {
		$scope.$apply(function(){
			$scope.$emit('hideLoader');
			$scope.resetEdit();
		});

		setTimeout(correctRoomType, 100);

		setTimeout(function(){
			if ($stateParams && 'reservation_id' in $stateParams &&
			$stateParams.reservation_id !== '') {
				var reservation_id 		= $stateParams.reservation_id;
				$scope.$apply(function(){
					switchToEditMode(reservation_id);
				});

			}
		}, 1000);
	};

	/**
	* we are capturing model opened to add some class mainly for animation
	*/
	$rootScope.$on('ngDialog.opened', function (e, $dialog) {
		//to add stjepan's popup showing animation
		$rootScope.modalOpened = false;
		$timeout(function(){
			$rootScope.modalOpened = true;
		}, 300);
	});
	$rootScope.$on('ngDialog.closing', function (e, $dialog) {
		//to add stjepan's popup showing animation
		$rootScope.modalOpened = false;
	});

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
                	img_url = item.account_type === 'COMPANY' ? 'avatar-company.png' : 'avatar-travel-agent.png';
                	eachItem.image = '/assets/images/' + img_url;
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
            if (request.term !== '' && lastSearchText !== request.term) {
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

    var timeoutforLine;
    var currentTimeLineChanger = function(){
    	timeoutforLine = setTimeout(function(){
	    	//adjuested property date time (rounded to next 15min slot time)
	    	var newTime = new tzIndependentDate($scope.adj_property_date_time.start_date);

	    	newTime.setMinutes(newTime.getMinutes() + 15);
			$scope.adj_property_date_time.start_date = newTime.getTime();
			$scope.gridProps.display.property_date_time = $scope.adj_property_date_time;
			$scope.gridProps.display = util.deepCopy($scope.gridProps.display);
			$scope.renderGrid();
			currentTimeLineChanger();
    	}, ($scope.gridProps.display.ms_hr / ($scope.gridProps.display.intervals_per_hour)));


	};
	currentTimeLineChanger();

	/**
	* Destroy event of scope, , we have to wipe out some events, data..
	*/
	$scope.$on("$destroy", function(){

		//clearing the red line timeout
		if(timeoutforLine){
			clearTimeout(timeoutforLine);
		}
	});

}]);
