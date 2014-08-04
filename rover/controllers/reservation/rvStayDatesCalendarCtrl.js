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
		this.CALENDAR_PAGINATION_COUNT = 75;
		$scope.eventSources = [];

		$scope.calendarType = "ROOM_TYPE";
		if($scope.reservationData.rooms[0].roomTypeId == ""){
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
	    while (currentDate < stopDate) {
	        dateArray.push($filter('date')(currentDate, $rootScope.dateFormatForAPI))
	        currentDate = currentDate.addDays(1);
	    }
	   return dateArray;
	}

	//We have to update the staydetails in 'reservationData' hash data modal
	//for each day of reservation
	$scope.updateDataModel = function(){

		var availabilityDetails = dclone($scope.availabilityDetails);

		//Update the room type details
		$scope.reservationData.rooms[0].roomTypeId = $scope.finalRoomType;
		var roomTypeName = "";
		for(var i in availabilityDetails.room_types){
			if(availabilityDetails.room_types[i].id == $scope.finalRoomType){
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
		for(var i in $scope.dates){
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
			for(var j in availabilityDetails.rates){
				if(availabilityDetails.rates[j].id == rateIdForTheDate){
					rateName = availabilityDetails.rates[j].name;
					break;
				}
			}
			stayDates[date].rate.name = rateName;
		}

		$scope.reservationData.rooms[0].stayDates = stayDates;

	};
	/**
	* Event handler for set dates button
	* Confirms the staydates in calendar
	*/
	$scope.setDatesClicked = function(){

		//Get the staydates from the calendar
		$scope.houseNotAvailableForBooking = false;
		$scope.roomTypeNotAvailableForBooking = false;
		$scope.dates = getDatesOfTheStayRange();

		//Check if the staydates has overbooking. if yes display a popup
		if(isOverBooking()){
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
	var isOverBooking = function(dates){
		var dateDetails;
		var roomTypeAvailbilityForTheDay;
		var isOverBooking = false;
		var date;
		//Check for each stayday, whether it is overbooking
		for(var i in $scope.dates){
			date = $scope.dates[i];
			dateDetails = $scope.availabilityDetails.results[date];
			
			//Check if houe available for the day 
			houseAvailabilityForTheDay = dateDetails['house'].availability;
			if(houseAvailabilityForTheDay <=0){
				$scope.houseNotAvailableForBooking = true;
				isOverBooking = true;
				break;
			}
			//check if selected room type available for the day
			roomTypeAvailbilityForTheDay = dateDetails[$scope.finalRoomType].room_type_availability.availability;
			if(roomTypeAvailbilityForTheDay <= 0){
				$scope.roomTypeNotAvailableForBooking = true;
				isOverBooking = true;
				break;
			}

		}

		return isOverBooking;
	}

	var fetchAvailabilityDetails = function(){
		var availabilityFetchSuccess = function(data){
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
        var toDate = businessDateParsed.setDate(businessDateParsed.getDate() + that.CALENDAR_PAGINATION_COUNT) ;

        params.per_page = that.CALENDAR_PAGINATION_COUNT;
        params.to_date = $filter('date')(toDate, $rootScope.dateFormatForAPI);
		
		$scope.invokeApi(RVStayDatesCalendarSrv.fetchAvailability, params, availabilityFetchSuccess);
	};

	/**
	* Set the calendar options to display the calendar
	*/
	this.renderFullCalendar = function() {
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
			eventDrop : changedDateOnCalendar
		};

		//Refresh the calendar with the arrival, departure dates
		$scope.refreshCalendarEvents()
	}

	/**
	* return the rate for a given date
	*/
	var getRateForTheDay = function(availabilityDetails){
		//If no room type is selected for the room type calendar, 
		//then no need to display the price
		var rate
		if($scope.roomTypeForCalendar == "" && $scope.calendarType == "ROOM_TYPE"){
			rate = "";
		} else {
			rate = $rootScope.currencySymbol + 
		                availabilityDetails.room_rates.single;
		}
		return rate;

	}; 

	/**
	* Compute the fullcalendar events object from the availability details
	*/
    var computeEventSourceObject = function(checkinDate, checkoutDate){

        var availabilityKey;
        if($scope.calendarType == "BEST_AVAILABLE"){
        	availabilityKey = 'BAR';
        } else {
			availabilityKey = $scope.roomTypeForCalendar;
        }
        var events = [];

        var thisDate;
        var calEvt = {};

        angular.forEach($scope.availabilityDetails.results, function(dateDetails, date) {
            calEvt = {};
            //instead of new Date(), Fixing the timezone issue related with fullcalendar
            thisDate = getDateObj(date);
            calEvt.title = getRateForTheDay(dateDetails[availabilityKey]);
            calEvt.start = thisDate;
            calEvt.end = thisDate;
            calEvt.day = thisDate.getDate().toString();

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
            


            //room type available - If no room type is being selected, only show house availability.
            } else if($scope.roomTypeForCalendar != "" && 
            	dateDetails[availabilityKey].room_type_availability.availability > 0) { 
                calEvt.className = "type-available"; //TODO: verify class name
                console.log("room type available----" + date);
            //room type not available but house available   
            } else if(dateDetails["house"].availability > 0) {
            	console.log("room type not available----" + date)
            	//calEvt.className = ""; //TODO: verify class name from stjepan
            //house not available(no room available in the hotel for any room type)
            } else{
            	console.log("house not available----" + date)
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
	$scope.roomTypeForCalendarChanged = function(){
		$scope.finalRoomType = $scope.roomTypeForCalendar;
		$scope.resetCalendarDates();
		$scope.refreshCalendarEvents();
	};

	/**
	* This function is used to check the whether the movement of dates is valid 
	* accoriding to our reqmt.
	*/
	var changedDateOnCalendar = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {


		var newDateSelected = event.start;//the new date in calendar

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

	$scope.refreshCalendarEvents = function(){
		$scope.eventSources.length = 0;
		$scope.events = computeEventSourceObject($scope.checkinDateInCalender, $scope.checkoutDateInCalender);
		$scope.eventSources.length = 0;
		$scope.eventSources.push($scope.events);
	};

	$scope.refreshScroller = function() {
		setTimeout(function() {
			$scope.myScroll['stay-dates-calendar'].refresh();
		}, 0);
	};

	var getNumOfStayNights = function(){
		//setting nights based on calender checking/checkout days
		var timeDiff = $scope.checkoutDateInCalender.getTime() - $scope.checkinDateInCalender.getTime();
		return Math.ceil(timeDiff / (1000 * 3600 * 24));
	}

	$scope.resetCalendarDates = function(){
		$scope.checkinDateInCalender = $scope.confirmedCheckinDate;
		$scope.checkoutDateInCalender = $scope.confirmedCheckoutDate;
	};

	$scope.selectedBestAvailableRatesCalOption = function(){
		$scope.calendarType= 'BEST_AVAILABLE'; 
		$scope.resetCalendarDates();
		$scope.refreshCalendarEvents(); 


	};
	$scope.selectedRoomTypesCalOption = function(){
		$scope.calendarType ='ROOM_TYPE'; 
		$scope.resetCalendarDates();
		$scope.refreshCalendarEvents(); 

	};

	$scope.isRoomTypeChangeAllowed = function(){
		var ret = true;
		if($scope.reservationData.status == "CHECKEDIN" || 
			$scope.reservationData.status == "CHECKING_OUT") {
			ret = false;
		}
		return ret;
	};

	$scope.handleCancelAction = function(){
		console.log($scope.fromState);
		$state.go($scope.fromState, {});
	};

	this.init();

}]); 