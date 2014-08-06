sntRover.controller('RVStayDatesCalendarCtrl', ['$state',
	'$stateParams',
	'$rootScope',
	'$scope',
	'RVStayDatesCalendarSrv',
	'$filter',
	'ngDialog',
	function($state, $stateParams, $rootScope, $scope, RVStayDatesCalendarSrv, $filter, ngDialog) {

		//inheriting some useful things
		BaseCtrl.call(this, $scope);
		var that = this;
		$scope.heading = $filter('translate')('CHANGE_STAY_DATES_TITLE');
		$scope.setTitle($scope.heading);
		//scroller options
		$scope.setScroller('stay-dates-calendar');



		this.init = function() {
			this.CALENDAR_PAGINATION_COUNT = 10;
			$scope.eventSources = [];

			$scope.calendarType = "ROOM_TYPE";
			if ($scope.reservationData.rooms[0].roomTypeId == "") {
				$scope.calendarType = "BEST_AVAILABLE";
			}
			$scope.checkinDateInCalender = $scope.confirmedCheckinDate = getDateObj($scope.reservationData.arrivalDate);
			$scope.checkoutDateInCalender = $scope.confirmedCheckoutDate = getDateObj($scope.reservationData.departureDate);

			//finalRoomType - Room type finally selected by the user. corresponds to the bottom select box
			//roomTypeForCalendar - Room type which specifies the calendar data
			$scope.finalRoomType = $scope.roomTypeForCalendar = $scope.reservationData.rooms[0].roomTypeId;
			//Stay nights in calendar
			$scope.nights = getNumOfStayNights();

			fetchAvailabilityDetails();

		};

		/**
		 * @Return {Array} Dates of the stayrange - excludes the departure date
		 */
		var getDatesOfTheStayRange = function() {
			var startDate = $scope.checkinDateInCalender;
			var stopDate = $scope.checkoutDateInCalender;

			var dateArray = new Array();
			var currentDate = startDate;
			while (currentDate <= stopDate) {
				dateArray.push($filter('date')(currentDate, $rootScope.dateFormatForAPI))
				currentDate = currentDate.addDays(1);
			}
			return dateArray;
		}

		//We have to update the staydetails in 'reservationData' hash data modal
		//for each day of reservation
		$scope.updateDataModel = function() {
			var availabilityDetails = dclone($scope.availabilityDetails);
			//Update the arrival_date and departure_dates
			$scope.reservationData.arrivalDate = $filter('date')($scope.checkinDateInCalender, $rootScope.dateFormatForAPI);
			$scope.reservationData.departureDate = $filter('date')($scope.checkoutDateInCalender, $rootScope.dateFormatForAPI);

			//nights
			$scope.reservationData.numNights = $scope.dates.length;

			//update the rateDetails - To calculate the total stay cost
			// var rateDetails = [];
			// for (var i in $scope.dates) {
			// 	date = $scope.dates[i];
			// 	$scope.reservationData.rateDetails.push(availabilityDetails.results[date][$scope.finalRoomType].room_rates)
			// }

			//Update the room type details
			$scope.reservationData.rooms[0].roomTypeId = $scope.finalRoomType;
			var roomTypeName = "";
			for (var i in availabilityDetails.room_types) {
				if (availabilityDetails.room_types[i].id == $scope.finalRoomType) {
					roomTypeName = availabilityDetails.room_types[i].name;
					break;
				}
			}
			$scope.reservationData.rooms[0].roomTypeName = roomTypeName;

			//Update the rate details - we need to update for each stay day
			var stayDates = {};
			/** stayDates hash format *** /
			 *
			 *	{
			 *        "2014-05-15": {
			 *            "rate": {
			 *                "id": 5,
			 *               "name": "rate_name"
			 *            },
			 *            "guests": {
			 *                "adults": 0,
			 *                "children": 0,
			 *                "infants": 5
			 *            }
			 *        }
			 *    }
			 */
			var date;
			for (var i in $scope.dates) {
				date = $scope.dates[i];

				stayDates[date] = {};
				//Guests hash
				stayDates[date].guests = {};
				stayDates[date].guests.adults = $scope.reservationData.rooms[0].numAdults;
				stayDates[date].guests.children = $scope.reservationData.rooms[0].numChildren;
				stayDates[date].guests.infants = $scope.reservationData.rooms[0].numInfants;

				//rate details
				stayDates[date].rate = {};

				//We need to get the lowest rate for that room type from the availability details
				//Even if we are in BAR calendar. we have to select a room type to make the reservation
				var rateIdForTheDate = availabilityDetails.results[date][$scope.finalRoomType].rate_id;
				stayDates[date].rate.id = rateIdForTheDate;
				var rateName = "";
				for (var j in availabilityDetails.rates) {
					if (availabilityDetails.rates[j].id == rateIdForTheDate) {
						rateName = availabilityDetails.rates[j].name;
						break;
					}
				}
				stayDates[date].rate.name = rateName;
			}

			$scope.reservationData.rooms[0].stayDates = stayDates;

			// Updating the room and rates data model to be consistent with the stay dates selected in the calendar
			// Setting parameter to be true to ensure navigation to enhanceStay
			$scope.initRoomRates(true);			
		};

		/**
		 * Event handler for set dates button
		 * Confirms the staydates in calendar
		 */
		$scope.setDatesClicked = function() {

			//Get the staydates from the calendar
			$scope.houseNotAvailableForBooking = false;
			$scope.roomTypeNotAvailableForBooking = false;
			$scope.dates = getDatesOfTheStayRange();

			//Check if the staydates has overbooking. if yes display a popup
			if (isOverBooking()) {
				ngDialog.open({
					template: '/assets/partials/reservation/alerts/overBookingAlert.html',
					className: 'ngdialog-theme-default',
					closeByDocument: false,
					scope: $scope
				});

				return false;
			}
			//If not overbooking, update the datamodals
			$scope.updateDataModel();
		};
		/**
		 * Check if the stayrange has house & room type available
		 * If for any of the staydates, house or room type not available, then it is overbooking
		 */
		var isOverBooking = function(dates) {
			console.log("isOverBooking");

			var dateDetails;
			var roomTypeAvailbilityForTheDay;
			var isOverBooking = false;
			var date;
			//Check for each stayday, whether it is overbooking
			for (var i in $scope.dates) {
				date = $scope.dates[i];
				dateDetails = $scope.availabilityDetails.results[date];

				//Check if houe available for the day 
				houseAvailabilityForTheDay = dateDetails['house'].availability;
				if (houseAvailabilityForTheDay <= 0) {
					$scope.houseNotAvailableForBooking = true;
					isOverBooking = true;
					break;
				}
				//check if selected room type available for the day
				roomTypeAvailbilityForTheDay = dateDetails[$scope.finalRoomType].room_type_availability.availability;
				if (roomTypeAvailbilityForTheDay <= 0) {
					$scope.roomTypeNotAvailableForBooking = true;
					isOverBooking = true;
					break;
				}

			}
			return isOverBooking;
		}

		var fetchAvailabilityDetails = function() {
			var availabilityFetchSuccess = function(data) {
				$scope.$emit('hideLoader');
				$scope.availabilityDetails = data;
				//Display Calendar
				that.renderFullCalendar();
			};

			//TODO: verify if the date calculation is correct

			//We are fetching the calendar data for one year. 
			//Starting from the current business date
			var params = {};
			params.from_date = $rootScope.businessDate;
			var businessDateParsed = getDateObj($rootScope.businessDate);
			var toDate = businessDateParsed.setDate(businessDateParsed.getDate() + that.CALENDAR_PAGINATION_COUNT);

			params.per_page = that.CALENDAR_PAGINATION_COUNT;
			params.to_date = $filter('date')(toDate, $rootScope.dateFormatForAPI);
			params.status = "";
			//Initialise data
			RVStayDatesCalendarSrv.availabilityData = {};
			$scope.invokeApi(RVStayDatesCalendarSrv.fetchAvailability, params, availabilityFetchSuccess);
		};

		/**
		 * Set the calendar options to display the calendar
		 */
		this.renderFullCalendar = function() {
			//calender options used by full calender, related settings are done here
			var fullCalendarOptions = {
				height: 450,
				editable: true,
				droppable: true,
				header: {
					left: '',
					center: 'title',
					right: ''
				},
				year: $scope.confirmedCheckinDate.getFullYear(), // Check in year
				month: $scope.confirmedCheckinDate.getMonth(), // Check in month (month is zero based)
				day: $scope.confirmedCheckinDate.getDate(), // Check in day
				editable: true,
				disableResizing: false,
				contentHeight: 320,
				weekMode: 'fixed',
				ignoreTimezone: false // For ignoring timezone,
			};

			$scope.leftCalendarOptions = dclone(fullCalendarOptions);
			$scope.leftCalendarOptions.eventDrop = changedDateOnCalendar;
			$scope.leftCalendarOptions.drop = dateDroppedToExternalCalendar;

			$scope.rightCalendarOptions = dclone(fullCalendarOptions);
			$scope.rightCalendarOptions.eventDrop = changedDateOnCalendar;
			$scope.rightCalendarOptions.drop = dateDroppedToExternalCalendar;


			$scope.rightCalendarOptions.month = $scope.leftCalendarOptions.month + 1;

			$scope.disablePrevButton = $scope.isPrevButtonDisabled();
			//Refresh the calendar with the arrival, departure dates
			$scope.refreshCalendarEvents();
			$scope.refreshScroller('stay-dates-calendar');
		}

		//Drag and drop handler for drag and drop to an external calendar
		dateDroppedToExternalCalendar = function(event, jsEvent, ui) {
			var finalCheckin;
			var finalCheckout;

			// checkin date/ checkout date can not be moved prior to current business date
			if (event.getTime() < getDateObj($rootScope.businessDate).getTime()) {
				//revertFunc();
				return false;
			}

			if ($(ui.target).attr('class').indexOf("check-in") >= 0) {
				//If drag and drop carried in same calendar, we don't want to handle here.
				//will be handled in 'eventDrop' (changedDateOnCalendar fn)
				if (event.getMonth == $scope.checkinDateInCalender.getMonth()) {
					return false;
				}
				//checkin type date draging after checkout date wil not be allowed
				if (event > $scope.checkoutDateInCalender) {
					return false;
				}
				finalCheckin = event;
				finalCheckout = $scope.checkoutDateInCalender;
			} else if ($(ui.target).attr('class').indexOf("check-out") >= 0) {
				//If drag and drop carried in same calendar, we don't want to handle here.
				//will be handled in 'eventDrop' (changedDateOnCalendar fn)
				if (event.getMonth == $scope.checkoutDateInCalender.getMonth()) {
					return false;
				}
				//checkout date draging before checkin date wil not be allowed
				if (event < $scope.checkinDateInCalender) {
					return false;
				}
				finalCheckin = $scope.checkinDateInCalender;
				finalCheckout = event;
			}
			// we are re-assinging our new checkin/checkout date for calendar
			$scope.checkinDateInCalender = finalCheckin;
			$scope.checkoutDateInCalender = finalCheckout;

			//Reload the calendar with new arrival, departure dates
			$scope.refreshCalendarEvents()
		};

		/**
		 * return the rate for a given date
		 */
		var getRateForTheDay = function(availabilityDetails) {
			//If no room type is selected for the room type calendar, 
			//then no need to display the rate
			var rate = {};
			if ($scope.roomTypeForCalendar == "" && $scope.calendarType == "ROOM_TYPE") {
				rate.value = "";
				rate.name = "";
			} else {
				rate.value = $rootScope.currencySymbol +
					availabilityDetails.room_rates.single;
				//Get the rate value iterating throught the rates array
				angular.forEach($scope.availabilityDetails.rates, function(rateDetails, i) {
					if (rateDetails.id == availabilityDetails.rate_id) {
						rate.name = rateDetails.name;
						return false;
					}
				});
			}
			return rate;
		};

		var getRoomTypeForBAR = function(availabilityDetails) {
			var roomTypeId = availabilityDetails.room_rates.room_type_id;
			var roomTypeName = "";
			angular.forEach($scope.availabilityDetails.room_types, function(roomType, i) {
				if (roomType.id == roomTypeId) {
					roomTypeName = roomType.description;
					return false;
				}
			});
			return roomTypeName;
		};



		/**
		 * Compute the fullcalendar events object from the availability details
		 */
		var computeEventSourceObject = function(checkinDate, checkoutDate) {

			var availabilityKey;
			var dateAvailability;
			if ($scope.calendarType == "BEST_AVAILABLE") {
				availabilityKey = 'BAR';
			} else {
				availabilityKey = $scope.roomTypeForCalendar;
			}
			var events = [];

			var thisDate;
			var calEvt = {};
			var rate = '';

			angular.forEach($scope.availabilityDetails.results, function(dateDetails, date) {


				calEvt = {};
				//instead of new Date(), Fixing the timezone issue related with fullcalendar
				thisDate = getDateObj(date);
				rate = getRateForTheDay(dateDetails[availabilityKey]);
				calEvt.title = rate.value;
				calEvt.rate = rate.name; //Displayed in tooltip
				calEvt.start = thisDate;
				calEvt.end = thisDate;
				calEvt.day = thisDate.getDate().toString();
				//Displayed in tooltip
				if ($scope.calendarType == "BEST_AVAILABLE") {
					calEvt.roomType = getRoomTypeForBAR(dateDetails[availabilityKey]);
				}

				//Event is check-in
				if (thisDate.getTime() === checkinDate.getTime()) {
					calEvt.id = "check-in";
					calEvt.className = "check-in";
					//For inhouse reservations, we can not move the arrival date
					if ($scope.reservationData.status != "CHECKEDIN" && $scope.reservationData.status != "CHECKING_OUT") {
						calEvt.startEditable = "true";
					}
					calEvt.durationEditable = "false";

					//If check-in date and check-out dates are the same, show split view.
					if (checkinDate.getTime() == checkoutDate.getTime()) {
						calEvt.className = "check-in split-view";
						events.push(calEvt);
						//checkout-event
						calEvt = {};
						calEvt.title = getRateForTheDay(dateDetails[availabilityKey]);

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
					/**dates prior to check-in and dates after checkout*/

				} else if (($scope.calendarType == "BEST_AVAILABLE" && dateDetails[availabilityKey].room_type_availability.availability > 0) || ($scope.calendarType == "ROOM_TYPE" && $scope.roomTypeForCalendar != "" && dateDetails[availabilityKey].room_type_availability.availability > 0)) {
					calEvt.className = "type-available"; //TODO: verify class name
					//console.log("room type available----" + date);
					//room type not available but house available   
				} else if (dateDetails["house"].availability > 0) {
					//console.log("room type not available----" + date)
					//calEvt.className = ""; //TODO: verify class name from stjepan
					//house not available(no room available in the hotel for any room type)
				} else {
					//console.log("house not available----" + date)
					calEvt.className = "house-unavailable";
				}

				events.push(calEvt);
			});
			return events;
		};

		/**
		 * Event handler for the room type dropdown in top
		 * - the dropdown which defines the data for calendar.
		 */
		$scope.roomTypeForCalendarChanged = function() {
			$scope.finalRoomType = $scope.roomTypeForCalendar;
			$scope.resetCalendarDates();
			$scope.refreshCalendarEvents();
		};

		/**
		 * This function is used to check the whether the movement of dates is valid
		 * accoriding to our reqmt.
		 */
		var changedDateOnCalendar = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
			console.log("changedDateOnCalendar");
			var newDateSelected = event.start; //the new date in calendar

			// also we are storing the current business date for easiness of the following code
			var currentBusinessDate = getDateObj($rootScope.businessDate);

			var finalCheckin = "";
			var finalCheckout = "";

			// checkin date/ checkout date can not be moved prior to current business date
			if (newDateSelected.getTime() < currentBusinessDate.getTime()) {
				revertFunc();
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

				finalCheckin = $scope.checkinDateInCalender;
				finalCheckout = newDateSelected;
			}
			// we are re-assinging our new checkin/checkout date for calendar
			$scope.checkinDateInCalender = finalCheckin;
			$scope.checkoutDateInCalender = finalCheckout;

			//Reload the calendar with new arrival, departure dates
			$scope.refreshCalendarEvents()
		};

		$scope.refreshCalendarEvents = function() {
			$scope.eventSources.length = 0;
			$scope.events = computeEventSourceObject($scope.checkinDateInCalender, $scope.checkoutDateInCalender);
			$scope.eventSources.length = 0;
			$scope.eventSources.push($scope.events);
		};

		var getNumOfStayNights = function() {
			//setting nights based on calender checking/checkout days
			var timeDiff = $scope.checkoutDateInCalender.getTime() - $scope.checkinDateInCalender.getTime();
			return Math.ceil(timeDiff / (1000 * 3600 * 24));
		}

		$scope.resetCalendarDates = function() {
			$scope.checkinDateInCalender = $scope.confirmedCheckinDate;
			$scope.checkoutDateInCalender = $scope.confirmedCheckoutDate;
		};

		$scope.selectedBestAvailableRatesCalOption = function() {
			$scope.calendarType = 'BEST_AVAILABLE';
			$scope.resetCalendarDates();
			$scope.refreshCalendarEvents();


		};
		$scope.selectedRoomTypesCalOption = function() {
			$scope.calendarType = 'ROOM_TYPE';
			$scope.resetCalendarDates();
			$scope.refreshCalendarEvents();

		};

		$scope.isRoomTypeChangeAllowed = function() {
			var ret = true;
			if ($scope.reservationData.status == "CHECKEDIN" ||
				$scope.reservationData.status == "CHECKING_OUT") {
				ret = false;
			}
			return ret;
		};
		//Click handler for cancel button in calendar screen
		$scope.handleCancelAction = function() {
			$state.go($scope.fromState, {});
		};

		//Click handler for calendar pre button
		$scope.prevButtonClickHandler = function() {
			$scope.leftCalendarOptions.month = parseInt($scope.leftCalendarOptions.month) - 2;
			$scope.rightCalendarOptions.month = parseInt($scope.rightCalendarOptions.month) - 2;
			$scope.disablePrevButton = $scope.isPrevButtonDisabled();
			$scope.refreshCalendarEvents();

		};

		$scope.isPrevButtonDisabled = function() {
			var disabled = false;
			if (parseInt(getDateObj($rootScope.businessDate).getMonth()) == parseInt($scope.leftCalendarOptions.month)) {
				disabled = true;
			}
			return disabled

		};


		$scope.nextButtonClickHandler = function() {
			var nextMonthDetailsFetchSuccess = function(data) {
				$scope.$emit('hideLoader');
				$scope.leftCalendarOptions.month = parseInt($scope.leftCalendarOptions.month) + 2;
				//console.log($scope.leftCalendarOptions.month);
				$scope.rightCalendarOptions.month = parseInt($scope.rightCalendarOptions.month) + 2;
				$scope.availabilityDetails = data;
				$scope.disablePrevButton = $scope.isPrevButtonDisabled();
				$scope.refreshCalendarEvents();
			};

			var params = {};
			params.from_date = '';
			params.per_page = that.CALENDAR_PAGINATION_COUNT;
			params.to_date = '';
			params.status = 'FETCH_ADDITIONAL';
			$scope.invokeApi(RVStayDatesCalendarSrv.fetchAvailability, params, nextMonthDetailsFetchSuccess);
		};

		this.init();

	}
]);