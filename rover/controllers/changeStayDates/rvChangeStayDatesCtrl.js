sntRover.controller('RVchangeStayDatesController', ['$state', '$stateParams', '$rootScope', '$scope', 'stayDateDetails', 'RVChangeStayDatesSrv', '$filter',
	function($state, $stateParams, $rootScope, $scope, stayDateDetails, RVChangeStayDatesSrv, $filter) {
		//inheriting some useful things
		BaseCtrl.call(this, $scope);

		// set a back button on header
		$rootScope.setPrevState = {
			title: $filter('translate')('STAY_CARD'),
			callback: 'goBack',
			scope: $scope
		}

		var that = this;
		// CICO-9081
		var translatedHeading = $filter('translate')('CHANGE_STAY_DATES_TITLE');
		$scope.$emit('HeaderChanged', translatedHeading);
		$scope.setTitle(translatedHeading);

		/**
		 * setting the scroll options for the room list
		 */
		var scrollerOptions = {
			preventDefault: false
		};
		$scope.setScroller('edit_staydate_updatedDetails', scrollerOptions);
		$scope.setScroller('edit_staydate_calendar', scrollerOptions);

		this.dataAssign = function() {
			//Data from Resolve method
			$scope.stayDetails = stayDateDetails;
			$scope.stayDetails.isOverlay = false;
			//For future comparison / reset
			$scope.checkinDateInCalender = $scope.confirmedCheckinDate = tzIndependentDate($scope.stayDetails.details.arrival_date);
			$scope.checkoutDateInCalender = $scope.confirmedCheckoutDate = tzIndependentDate($scope.stayDetails.details.departure_date);

			//Data for rightside Pane.
			$scope.rightSideReservationUpdates = '';
			$scope.roomSelected = $scope.stayDetails.details.room_number;
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
				height: 450,
				editable: true,
				header: {
					left: 'prev',
					center: 'title',
					right: 'next'
				},
				year: $scope.confirmedCheckinDate.getFullYear(), // Check in year
				month: $scope.confirmedCheckinDate.getMonth(), // Check in month (month is zero based)
				day: $scope.confirmedCheckinDate.getDate(), // Check in day
				editable: true,
				disableResizing: false,
				contentHeight: 320,
				weekMode: 'fixed',
				ignoreTimezone: false, // For ignoring timezone,
				eventDrop: $scope.changedDateOnCalendar,
			};
			setTimeout(function() {
				$scope.refreshScroller('edit_staydate_calendar');
			}, 0)
		}
		this.initialise = function() {
			that.dataAssign();

			if ($rootScope.isStandAlone) {

				if (!that.checkIfStaydatesCanBeExtended()) {
					$scope.rightSideReservationUpdates = 'NO_HOUSE_AVAILABLE';
					$scope.refreshScroller();
				} else if (that.hasMultipleRates()) {
					$scope.rightSideReservationUpdates = 'HAS_MULTIPLE_RATES';
					$scope.refreshScroller();
				}

			}
			that.renderFullCalendar();

		};

		/**
		 * If the reservation has multiple rates, then the user should not be allowed to extend the Stay dates
		 * User has to select a rate first. So display an option to go to the stayDates calendar
		 * TODO: verify if stay dates can be shortened in this case
		 */
		this.hasMultipleRates = function() {
			var calendarDetails = $scope.stayDetails.calendarDetails;
			var checkinTime = $scope.checkinDateInCalender;
			var checkoutTime = $scope.checkoutDateInCalender;
			var thisTime = "";
			//If the flag 'has_multiple_rates' is true, 
			//then we do not display the dates before check in and dates after departure date as an event
			//Remove those dates fromt the available dates response
			if (calendarDetails.has_multiple_rates == 'true') {
				for (var i = calendarDetails.available_dates.length - 1; i >= 0; i--) {
					thisTime = tzIndependentDate(calendarDetails.available_dates[i].date) //.setHours(00, 00, 00);
					if (thisTime < checkinTime || thisTime > checkoutTime) {
						$scope.stayDetails.calendarDetails.available_dates.splice(i, 1);
					}
				}
				return true;
			}

			return false;
		};

		//Stay dates can be extended only if dates are available prior to checkin date
		//or after checkout date.
		this.checkIfStaydatesCanBeExtended = function() {
			var calendarDetails = $scope.stayDetails.calendarDetails;
			var reservationStatus = calendarDetails.reservation_status;
			var checkinTime = $scope.checkinDateInCalender;
			var checkoutTime = $scope.checkoutDateInCalender;
			var thisTime = "";
			var canExtendStay = false;

			$(calendarDetails.available_dates).each(function(index) {
				//Put time correction 
				thisTime = tzIndependentDate(this.date);
				//Check if a day available for extending prior to the checkin day
				//Not applicable to inhouse reservations since they can not extend checkin date
				if (reservationStatus != "CHECKEDIN" && reservationStatus != "CHECKING_OUT") {
					if (thisTime < checkinTime) {
						canExtendStay = true;
						return false; //break out of for loop
					}
				}
				//Check if a day is available to extend after the departure date
				if (thisTime > checkoutTime) {
					canExtendStay = true;
					return false; //break out of for loop
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
			$scope.availabilityDetails = data;

			//if restrictions exist for the rate / room / date combination
			//					display the existing restriction 
			//Only for standalone. In pms connected, restrictions handled in server 
			//and will return not available status
			if ($rootScope.isStandAlone) {
				if (data.restrictions.length > 0) {
					$scope.rightSideReservationUpdates = 'RESTRICTION_EXISTS';
					$scope.stayDetails.restrictions = data.restrictions;
					$scope.refreshScroller();
					return false;
				}
			}

			$scope.checkAvailabilityStatus();

		};


		/**
		 *based on the availability of room, web service will give 5 status
		 * "room_available": we need to show room details, rate, total, avg...
		 * "room_type_available": we need to show room list, after selecting that
		 * "not_available": we need to show the not available message
		 * "to_be_unassigned": Room can be unassigned from another guest
		 * 					and the guest can continue on same room
		 * "do_not_move": Do Not Move flag on reservation with the assigned room
		 * "maintenance": Room under maintenance
		 */
		$scope.checkAvailabilityStatus = function() {

			if ($scope.availabilityDetails.availability_status == "room_available") {
				$scope.showRoomAvailable();
			} else if ($scope.availabilityDetails.availability_status == "room_type_available") {
				that.showRoomTypeAvailable($scope.availabilityDetails);
			} else if ($scope.availabilityDetails.availability_status == "not_available") {
				that.showRoomNotAvailable();
			} else if ($scope.availabilityDetails.availability_status == "to_be_unassigned") {
				$scope.rightSideReservationUpdates = 'PREASSIGNED';
				$scope.stayDetails.preassignedGuest = $scope.availabilityDetails.preassigned_guest;
			} else if ($scope.availabilityDetails.availability_status == "maintenance") {
				$scope.rightSideReservationUpdates = 'MAINTENANCE';
			} else if ($scope.availabilityDetails.availability_status == "do_not_move") {
				$scope.rightSideReservationUpdates = "ROOM_CANNOT_UNASSIGN";
			}
			$scope.refreshScroller();
		}

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
			var numNightsWithoutSR = $scope.calendarNightDiff; 
			$scope.isStayRatesSuppressed = false;
			//calculating the total rate / avg.rate
			$scope.totRate = 0;
			var checkinRate;
			var stayRangeRatesSuppressed = true;

			$($scope.stayDetails.calendarDetails.available_dates).each(function(index) {
				
				//we have to add rate between the calendar checkin date & calendar checkout date only
				if (tzIndependentDate(this.date).getTime() >= $scope.checkinDateInCalender.getTime()
			 	&& tzIndependentDate(this.date).getTime() < $scope.checkoutDateInCalender.getTime()) {

					if(this.is_sr == "false"){
						stayRangeRatesSuppressed = false;
						$scope.totRate += parseFloat(this.rate);
					} else {
						numNightsWithoutSR --;// Findout the number of days having no suppressed rate
					}
				}

				//if calendar checkout date is same as calendar checking date, total rate is same as that day's checkin rate
				if ($scope.calendarNightDiff == 0 && tzIndependentDate(this.date).getTime() == $scope.checkinDateInCalender.getTime()) {
					stayRangeRatesSuppressed = this.is_sr == "true" ? true: false;
					checkinRate = this.is_sr == "true" ? $filter('translate')('SUPPRESSED_RATES_TEXT'): $scope.escapeNull(this.rate);
				}

			});

			//calculating the avg. rate
			if (numNightsWithoutSR > 0) {
				$scope.avgRate = Math.round(parseInt($scope.totRate) / numNightsWithoutSR + 0.00001);
			} else {
				$scope.totRate = Math.round((parseInt(checkinRate) + 0.00001));;
				$scope.avgRate = Math.round((parseInt($scope.totRate) + 0.00001));
			}
			//If the entair stay range has suppressed rate, then we display the avg daily rate and total staycost as SR
			if(stayRangeRatesSuppressed){
				$scope.isStayRatesSuppressed = true;
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
			if ($rootScope.isStandAlone) {
				if (!that.checkIfStaydatesCanBeExtended()) {
					$scope.rightSideReservationUpdates = 'NO_HOUSE_AVAILABLE';
					$scope.refreshScroller();
				}
			}
			/* event source that contains custom events on the scope */
			$scope.events = $scope.getEventSourceObject($scope.checkinDateInCalender, $scope.checkoutDateInCalender);

			$scope.eventSources.length = 0;
			$scope.eventSources.push($scope.events);

		}

		$scope.goBack = function() {
			$state.go('rover.reservation.staycard.reservationcard.reservationdetails', {
				"id": $stateParams.reservationId,
				"confirmationId": $stateParams.confirmNumber,
				"isrefresh": true
			});
		};

		// function to get color class against a room based on it's status
		$scope.getColorCode = function(roomReadyStatus, checkinInspectedOnly) {
			return getMappedRoomReadyStatusColor(roomReadyStatus, checkinInspectedOnly);
		};

		$scope.confirmUpdates = function() {
			var postParams = {
				'room_selected': $scope.roomSelected,
				'arrival_date': getDateString($scope.checkinDateInCalender),
				'dep_date': getDateString($scope.checkoutDateInCalender),
				'reservation_id': $scope.stayDetails.calendarDetails.reservation_id
			};
			$scope.invokeApi(RVChangeStayDatesSrv.confirmUpdates, postParams, that.successCallbackConfirmUpdates, that.failureCallbackConfirmUpdates);
		}
		/*
	 this function is used to check the whether the movement of dates is valid accoriding to our reqmt.
	 */
		$scope.changedDateOnCalendar = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
			$scope.stayDetails.isOverlay = false;
			//the new date in calendar
			var newDateSelected = event.start;

			// we are storing the available first date & last date for easiness of the following code
			var availableStartDate = tzIndependentDate($scope.stayDetails.calendarDetails.available_dates[0].date);
			var availableLastDate = tzIndependentDate($scope.stayDetails.calendarDetails.available_dates[$scope.stayDetails.calendarDetails.available_dates.length - 1].date);

			// also we are storing the current business date for easiness of the following code
			var currentBusinessDate = tzIndependentDate($scope.stayDetails.calendarDetails.current_business_date);

			var finalCheckin = "";
			var finalCheckout = "";

			// we will not allow to drag before to available start date or to drag after available end date
			if (newDateSelected < availableStartDate || newDateSelected > availableLastDate) {
				revertFunc();
				// reverting back to it's original position
				return false;
			}
			//Events other than check-in and checkout should not be drag and droped
			if (event.id !== 'check-in' && event.id !== 'check-out') {
				revertFunc();
				return false;
			}

			if (event.id == 'check-in') {
				//checkin type date draging after checkout date wil not be allowed
				if (newDateSelected > $scope.checkoutDateInCalender) {
					revertFunc();
					return false;
				}
				finalCheckin = newDateSelected.clone();
				finalCheckout = $scope.checkoutDateInCalender.clone();
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
				finalCheckin = $scope.checkinDateInCalender.clone();
				finalCheckout = newDateSelected.clone();
			}
			// we are re-assinging our new checkin/checkout date for calendar
			$scope.checkinDateInCalender = finalCheckin;
			$scope.checkoutDateInCalender = finalCheckout;

			$scope.events = $scope.getEventSourceObject($scope.checkinDateInCalender, $scope.checkoutDateInCalender);
			$scope.eventSources.length = 0;
			$scope.eventSources.push($scope.events);

			//For non standalone PMS the restrications are calculated from the 
			//initital calendar data returned by server
			if (!$rootScope.isStandAlone) {
				//Check if the stay range is restricted, if so display a restrication message
				if (that.isStayRangeRestricted($scope.checkinDateInCalender,
					$scope.checkoutDateInCalender)) {
					that.showRestrictedStayRange();
					return false;
				}

			}

			//calling the webservice for to check the availablity of rooms on these days
			var getParams = {
				'arrival_date': getDateString($scope.checkinDateInCalender),
				'dep_date': getDateString($scope.checkoutDateInCalender),
				'reservation_id': $scope.stayDetails.calendarDetails.reservation_id
			};

			$scope.invokeApi(RVChangeStayDatesSrv.checkUpdateAvaibale, getParams, $scope.successCallbackCheckUpdateAvaibale, $scope.errorCallbackCheckUpdateAvaibale);

		};

		/**
		 * function to check the stayrange restricted between dates
		 * We iterate through each day and see if any restriction is applied
		 */
		this.isStayRangeRestricted = function(checkinDate, checkoutDate) {
			var checkinTime = checkinDate.clone().setHours(00, 00, 00);
			var checkoutTime = checkoutDate.clone().setHours(00, 00, 00);
			var thisTime = "";
			var totalNights = 0;
			var minNumOfStay = "";
			$($scope.stayDetails.calendarDetails.available_dates).each(function(index) {
				//Put time correction 
				thisTime = tzIndependentDate(this.date).setHours(00, 00, 00);
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
			var currencyCode = $scope.stayDetails.calendarDetails.currency_code;
			var reservationStatus = $scope.stayDetails.calendarDetails.reservation_status;

			var thisDate;
			var calEvt = {};
			$($scope.stayDetails.calendarDetails.available_dates).each(function(index) {
				calEvt = {};
				//Fixing the timezone issue related with fullcalendar
				thisDate = tzIndependentDate(this.date);
				if (this.is_sr == "true") {
					calEvt.title = $filter('translate')('SUPPRESSED_RATES_TEXT');
				} else {
					calEvt.title = getCurrencySymbol(currencyCode) + Math.round(this.rate);
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
						if (this.is_sr == "true") {
							calEvt.title = $filter('translate')('SUPPRESSED_RATES_TEXT');
						} else {
							calEvt.title = getCurrencySymbol(currencyCode) + Math.round(this.rate);
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
					calEvt.id = "mid-stay" + index; // Id should be unique
					calEvt.className = "mid-stay";
					//Event is check-out
				} else if (thisDate.getTime() == checkoutDate.getTime()) {
					calEvt.id = "check-out";
					calEvt.className = "check-out";
					calEvt.startEditable = "true";
					calEvt.durationEditable = "false";
					//dates prior to check-in and dates after checkout
				} else {
					calEvt.id = "availability" + index; // Id should be unique
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

		$scope.goToRoomAndRates = function() {
			$state.go('rover.reservation.staycard.mainCard.roomType', {
				from_date: $scope.confirmedCheckinDate,
				to_date: $scope.confirmedCheckoutDate,
				fromState: 'STAY_CARD',
				company_id: $scope.reservationData.company.id,
				travel_agent_id: $scope.reservationData.travelAgent.id
			});
		}

		$scope.$on('$viewContentLoaded', function() {

			$scope.refreshScroller();
		});

	}
<<<<<<< HEAD
]);
=======


	
]);
>>>>>>> CICO-9348
