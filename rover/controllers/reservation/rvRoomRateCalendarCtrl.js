sntRover.controller('RVRoomRateCalendarCtrl', ['$state','$stateParams', '$rootScope', '$scope', 'RVRoomRateCalendarSrv','$filter',
function($state, $stateParams, $rootScope, $scope, RVRoomRateCalendarSrv, $filter) {

	//inheriting some useful things
	BaseCtrl.call(this, $scope);
	var that = this;
	$scope.heading = $filter('translate')('CHANGE_STAY_DATES_TITLE');
	$scope.setTitle($scope.heading);
	//scroller options
	$scope.$parent.myScrollOptions = {
		'edit_staydate_updatedDetails' : {
			snap : false,
			scrollbars : true,
			vScroll : true,
			vScrollbar : true,
			hideScrollbar : false,
			click : true,
			tap : true
		},
		'edit_staydate_calendar' : {
			snap : false,
			scrollbars : true,
			vScroll : true,
			vScrollbar : true,
			hideScrollbar : false,
			click : true,
			tap : true
		}

	};

	this.dataAssign = function(data) {
		//Data from Resolve method
		$scope.stayDetails = data;
		$scope.stayDetails.isOverlay = false;
		//For future comparison / reset
		console.log($scope.stayDetails);

		$scope.checkinDateInCalender = $scope.confirmedCheckinDate = getDateObj($scope.stayDetails.arrival_date);
		$scope.checkoutDateInCalender = $scope.confirmedCheckoutDate = getDateObj($scope.stayDetails.departure_date);

		//Data for rightside Pane.
		$scope.rightSideReservationUpdates = '';
		$scope.roomSelected = $scope.stayDetails.room_number;
		$scope.calendarNightDiff = '';
		$scope.avgRate = '';
		$scope.availableRooms = [];

	};

	this.renderFullCalendar = function() {
		/* event source that contains custom events on the scope */
		$scope.events = $scope.getEventSourceObject($scope.checkinDateInCalender, $scope.checkoutDateInCalender);
		$scope.eventSources = [$scope.events];
		//calender options used by full calender, related settings are done here
		$scope.fullCalendarOptions = {
			height : 450,
			editable : true,
			header : {
				left : 'prev',
				center : 'title',
				right : 'next'
			},
			year : $scope.confirmedCheckinDate.getFullYear(), // Check in year
			month : $scope.confirmedCheckinDate.getMonth(), // Check in month (month is zero based)
			day : $scope.confirmedCheckinDate.getDate(), // Check in day
			editable : true,
			disableResizing : false,
			contentHeight : 320,
			weekMode : 'fixed',
			ignoreTimezone : false, // For ignoring timezone,
			eventDrop : $scope.changedDateOnCalendar,
		};
	}
	this.initialise = function() {
		console.log('initialise');

		var fetchSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			that.dataAssign(data);
			that.renderFullCalendar();
		};
		$scope.invokeApi(RVRoomRateCalendarSrv.fetchCalenderDetails, {},fetchSuccessCallback);
		
	};
	//Stay dates can be extended only if dates are available prior to checkin date
	//or after checkout date.
	this.checkIfStaydatesCanBeExtended = function(){
		var reservationStatus = $scope.stayDetails.reservation_status;
		var checkinTime = $scope.checkinDateInCalender.setHours(00, 00, 00);
		var checkoutTime = $scope.checkoutDateInCalender.setHours(00, 00, 00);
		var thisTime = "";
		var canExtendStay = false;
		console.log($scope.stayDetails.available_dates);

		$($scope.stayDetails.available_dates).each(function(index) {
			console.log("inside");
			//Put time correction 
			thisTime = getDateObj(this.date).setHours(00, 00, 00);
			//Check if a day available for extending prior to the checkin day
            if(reservationStatus != "CHECKEDIN" && reservationStatus != "CHECKING_OUT"){
				if (thisTime < checkinTime) {
					canExtendStay = true;
					return false;//break out of for loop
				}
            }
            //Check if a day is available to extend after the departure date
			if (thisTime > checkoutTime) {
				canExtendStay = true;
				return false;//break out of for loop
			}
		});

		return canExtendStay;

	}

	$scope.errorCallbackCheckUpdateAvaibale = function(errorMessage) {
		$scope.$emit("hideLoader");

	};

	$scope.successCallbackCheckUpdateAvaibale = function(data) {
		$scope.stayDetails.isOverlay = true;
		$scope.$emit("hideLoader");
		//entire function is for right side

		/**
		*based on the availability of room, web service will give 6 status
		* "room_available": we need to show room details, rate, total, avg...
		* "room_type_available": we need to show room list, after selecting that
		* "not_available": we need to show the not available message
		* "has_restriction": restrictions exist for the rate / room / date combination
		* 					display the existing restriction 
		* "to_be_unassigned": Room can be unassigned from another guest 
		* 					and the guest can continue on same room
		* "do_not_move": Do Not Move flag on reservation with the assigned room
		* "maintenance": Room under maintenance
		*/
		if (data.availability_status == "room_available") {
			$scope.showRoomAvailable();
		}

		else if (data.availability_status == "room_type_available") {
			that.showRoomTypeAvailable(data);
		}

		else if (data.availability_status == "not_available") {
			that.showRoomNotAvailable();
		}

		else if (data.availability_status == "has_restriction") {
			$scope.rightSideReservationUpdates = 'RESTRICTION_EXISTS';
			$scope.stayDetails.restrictions = data.restrictions;
		}

		else if (data.availability_status == "to_be_unassigned") {
			$scope.rightSideReservationUpdates = 'PREASSIGNED';
			$scope.stayDetails.preassignedGuest = data.preassigned_guest;
		}

		else if (data.availability_status == "maintenance") {
			$scope.rightSideReservationUpdates = 'MAINTENANCE';
		}

		else if (data.availability_status == "do_not_move") {
			$scope.rightSideReservationUpdates = "ROOM_CANNOT_UNASSIGN";
		}
		$scope.refreshScroller(); 
	};

	//function to show restricted stay range div- only available for non-standalone PMS
	this.showRestrictedStayRange = function() {
		$scope.rightSideReservationUpdates = 'STAY_RANGE_RESTRICTED';
		$scope.refreshScroller();
	};

	//function to show not available room types div
	this.showRoomNotAvailable = function() {
		$scope.rightSideReservationUpdates = 'ROOM_NOT_AVAILABLE';
		$scope.refreshScroller();
	};

	// function to show room list
	that.showRoomTypeAvailable = function(data) {
		$scope.availableRooms = data.rooms;
		//we are showing the right side with updates
		$scope.rightSideReservationUpdates = 'ROOM_TYPE_AVAILABLE';
		$scope.refreshScroller();
	};

	//function to show room details, total, avg.. after successful checking for room available
	$scope.showRoomAvailable = function() {
		//setting nights based on calender checking/checkout days
		var timeDiff = $scope.checkoutDateInCalender.getTime() - $scope.checkinDateInCalender.getTime();
		$scope.calendarNightDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

		//calculating the total rate / avg.rate
		$scope.totRate = 0;
		var checkinRate = '';
		$($scope.stayDetails.available_dates).each(function(index) {

			//we have to add rate between the calendar checkin date & calendar checkout date only
			if (getDateObj(this.date).getTime() >= $scope.checkinDateInCalender.getTime() && getDateObj(this.date).getTime() < $scope.checkoutDateInCalender.getTime()) {
				$scope.totRate += parseFloat(this.rate);
			}
			//if calendar checkout date is same as calendar checking date, total rate is same as that day's checkin rate
			if (this.date == ($scope.stayDetails.arrival_date)) {
				checkinRate = $scope.escapeNull(this.rate) == "" ? "" : parseInt(this.rate);
			}

		});
		//calculating the avg. rate
		if ($scope.calendarNightDiff > 0) {
			$scope.avgRate = Math.round(($scope.totRate / $scope.calendarNightDiff + 0.00001) * 100 / 100 );
		} else {
			$scope.totRate = checkinRate;
			$scope.avgRate = Math.round(($scope.totRate + 0.00001));
		}
		//we are showing the right side with updates
		$scope.rightSideReservationUpdates = 'ROOM_AVAILABLE';
		$scope.refreshScroller();
	}
	//click function to execute when user selected a room from list (on ROOM_TYPE_AVAILABLE status)
	$scope.roomSelectedFromList = function(roomNumber) {
		$scope.roomSelected = roomNumber;
		$scope.showRoomAvailable();
	}

	$scope.getRoomClass = function(reservationStatus, roomStatus, foStatus) {
		var roomClass = "";
		if (reservationStatus == "CHECKING_IN") {
			if (roomStatus == "READY" && foStatus == "VACANT") {
				roomClass = "ready";
			} else {
				roomClass = "not-ready";
			}
		}
		return roomClass;
	};

	this.successCallbackConfirmUpdates = function(data) {
		$scope.$emit("hideLoader");
		$scope.goBack();
	};
	this.failureCallbackConfirmUpdates = function(errorMessage) {

		$scope.$emit("hideLoader");
		$scope.errorMessage = errorMessage;
	};

	$scope.resetDates = function() {
		$scope.stayDetails.isOverlay = false;
		that.dataAssign();
		/* event source that contains custom events on the scope */
		$scope.events = $scope.getEventSourceObject($scope.checkinDateInCalender, $scope.checkoutDateInCalender);

		$scope.eventSources.length = 0;
		$scope.eventSources.push($scope.events);

	}

	$scope.goBack = function() {
		$state.go('rover.reservation.staycard.reservationcard.reservationdetails', {"id": $stateParams.reservationId, "confirmationId": $stateParams.confirmNumber, "isrefresh": true});
	};

	// function to get color class against a room based on it's status
	$scope.getColorCode = function(roomReadyStatus, checkinInspectedOnly) {
		return getMappedRoomReadyStatusColor(roomReadyStatus, checkinInspectedOnly);
	};

	$scope.confirmUpdates = function() {
		var postParams = {
			'room_selected' : $scope.roomSelected,
			'arrival_date' : getDateString($scope.checkinDateInCalender),
			'dep_date' : getDateString($scope.checkoutDateInCalender),
			'reservation_id' : $scope.stayDetails.reservation_id
		};
		$scope.invokeApi(RVRoomRateCalendarSrv.confirmUpdates, postParams, that.successCallbackConfirmUpdates, that.failureCallbackConfirmUpdates);
	}
	/*
	 this function is used to check the whether the movement of dates is valid accoriding to our reqmt.
	 */
	$scope.changedDateOnCalendar = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
		$scope.stayDetails.isOverlay = false;
		var newDateSelected = event.start;
		//the new date in calendar

		// we are storing the available first date & last date for easiness of the following code
		var availableStartDate = getDateObj($scope.stayDetails.available_dates[0].date);
		var availableLastDate = getDateObj($scope.stayDetails.available_dates[$scope.stayDetails.calendarDetails.available_dates.length - 1].date);

		// also we are storing the current business date for easiness of the following code
		var currentBusinessDate = getDateObj($scope.stayDetails.current_business_date);

		var finalCheckin = "";
		var finalCheckout = "";

		// we will not allow to drag before to available start date or to drag after available end date
		if (newDateSelected < availableStartDate || newDateSelected > availableLastDate) {
			revertFunc();
			// reverting back to it's original position
			return false;
		}

		if (event.id == 'check-in') {
			//checkin type date draging after checkout date wil not be allowed
			if (newDateSelected > $scope.checkoutDateInCalender) {
				revertFunc();
				return false;
			}
			finalCheckin = newDateSelected;
			finalCheckout = $scope.checkoutDateInCalender;
		} else if (event.id == "check-out") {
			//checkout date draging before checkin date wil not be allowed
			if (newDateSelected < $scope.checkinDateInCalender) {
				revertFunc();
				return false;
			}
			// also before current busines date also not allowed
			if (newDateSelected.getTime() < currentBusinessDate.getTime()) {
				revertFunc();
				return false;
			}

			finalCheckin = $scope.checkinDateInCalender;
			finalCheckout = newDateSelected;
		}
		// we are re-assinging our new checkin/checkout date for calendar
		$scope.checkinDateInCalender = finalCheckin;
		$scope.checkoutDateInCalender = finalCheckout;

		//$scope.myCalendar.fullCalendar.rerenderEvents();
		//changing the data for fullcalendar
		$scope.events = $scope.getEventSourceObject($scope.checkinDateInCalender, $scope.checkoutDateInCalender);
		$scope.eventSources.length = 0;
		$scope.eventSources.push($scope.events);

		//For stand-alone PMS, the restrictions are calculated from the server
		//We call the API when dates are changed to get the status
		if($rootScope.isStandAlone){
			// checking if stay range is restricted between that days, 
			//if so we will not call webservice for availabilty
			if (that.isStayRangeRestricted($scope.checkinDateInCalender, 
											$scope.checkoutDateInCalender)) {
				that.showRestrictedStayRange();
				return false;
			}

		}
		
		//calling the webservice for to check the availablity of rooms on these days
		var getParams = {
			'arrival_date' : getDateString($scope.checkinDateInCalender),
			'dep_date' : getDateString($scope.checkoutDateInCalender),
			'reservation_id' : $scope.stayDetails.reservation_id
		};

		$scope.invokeApi(RVRoomRateCalendarSrv.checkUpdateAvaibale, getParams, $scope.successCallbackCheckUpdateAvaibale, $scope.errorCallbackCheckUpdateAvaibale);

	};

	/*
	 function to check the stayrange restricted between dates
	 */
	this.isStayRangeRestricted = function(checkinDate, checkoutDate) {
		var checkinTime = checkinDate.setHours(00, 00, 00);
		var checkoutTime = checkoutDate.setHours(00, 00, 00);
		var thisTime = "";
		var totalNights = 0;
		var minNumOfStay = "";
		$($scope.stayDetails.available_dates).each(function(index) {
			//Put time correction 
			thisTime = getDateObj(this.date).setHours(00, 00, 00);
			//We calculate the minimum length of stay restriction 
			//by reffering to the checkin day
			if (this.date == getDateString(checkinDate)) {
				$(this.restriction_list).each(function(index) {
					if (this.restriction_type == "MINIMUM_LENGTH_OF_STAY") {
						minNumOfStay = this.number_of_days;
					}
				});
			}
			//Get the number of nights of stay. 
			if (thisTime < checkinTime || thisTime >= checkoutTime) {
				return true;
			}
			totalNights++;
		});
		if (totalNights < minNumOfStay) {
			return true;
		} else {
			return false;
		}
	};

	$scope.getEventSourceObject = function(checkinDate, checkoutDate) {

		var events = [];
		var currencyCode = $scope.stayDetails.currency_code;
		var reservationStatus = $scope.stayDetails.reservation_status;

		var thisDate;
		var calEvt = {};
		$($scope.stayDetails.available_dates).each(function(index) {
			calEvt = {};
			//Fixing the timezone issue related with fullcalendar
			thisDate = getDateObj(this.date);

			if ($scope.stayDetails.is_rates_suppressed == "true") {
				calEvt.title = $scope.stayDetails.text_rates_suppressed;
			} else {
				calEvt.title = getCurrencySymbol(currencyCode) + $scope.escapeNull(this.rate).split('.')[0];
			}
			calEvt.start = thisDate;
			calEvt.end = thisDate;
			calEvt.day = thisDate.getDate().toString();

			//Event is check-in
			if (thisDate.getTime() === checkinDate.getTime()) {
				calEvt.id = "check-in";
				calEvt.className = "check-in";
				if (reservationStatus != "CHECKEDIN" && reservationStatus != "CHECKING_OUT") {
					calEvt.startEditable = "true";
				}
				calEvt.durationEditable = "false";

				//If check-in date and check-out dates are the same, show split view.
				if (checkinDate.getTime() == checkoutDate.getTime()) {
					calEvt.className = "check-in split-view";
					events.push(calEvt);
					//checkout-event
					calEvt = {};
					if ($scope.stayDetails.is_rates_suppressed == "true") {
						calEvt.title = $scope.stayDetails.text_rates_suppressed;
					} else {
						calEvt.title = getCurrencySymbol(currencyCode) + $scope.escapeNull(this.rate).split('.')[0];
					}
					calEvt.start = thisDate;
					calEvt.end = thisDate;
					calEvt.day = thisDate.getDate().toString();
					calEvt.id = "check-out";
					calEvt.className = "check-out split-view";
					calEvt.startEditable = "true";
					calEvt.durationEditable = "false"
				}

				//mid-stay range
			} else if ((thisDate.getTime() > checkinDate.getTime()) && (thisDate.getTime() < checkoutDate.getTime())) {
				calEvt.id = "availability";
				calEvt.className = "mid-stay";
				//Event is check-out
			} else if (thisDate.getTime() == checkoutDate.getTime()) {
				calEvt.id = "check-out";
				calEvt.className = "check-out";
				calEvt.startEditable = "true";
				calEvt.durationEditable = "false";
				//dates prior to check-in and dates after checkout
			} else {
				//calEvt.id = "availability";
				calEvt.className = "type-available";
			}

			events.push(calEvt);
		});
		return events;
	};

	this.initialise();

	$scope.refreshScroller = function() {
		setTimeout(function() {
			$scope.myScroll['edit_staydate_updatedDetails'].refresh();
			$scope.myScroll['edit_staydate_calendar'].refresh();
		}, 300);
	};

	$scope.goToRoomAndRatesCalendar = function() {
		$state.go('rover.reservation.staycard.mainCard.roomType', {
			from_date: $scope.confirmedCheckinDate,
			to_date: $scope.confirmedCheckoutDate,
			view: "CALENDAR"
		});
	}

	$scope.$on('$viewContentLoaded', function() {

		$scope.refreshScroller();
	});

}]); 