sntRover.controller('RVStayDatesCalendarCtrl', ['$state','$stateParams', '$rootScope', '$scope', 'RVStayDatesCalendarSrv','$filter',
function($state, $stateParams, $rootScope, $scope, RVStayDatesCalendarSrv, $filter) {

	//inheriting some useful things
	BaseCtrl.call(this, $scope);
	var that = this;
	$scope.heading = $filter('translate')('CHANGE_STAY_DATES_TITLE');
	$scope.setTitle($scope.heading);
	//scroller options
	$scope.setScroller('stay-dates-calendar'); 



	
	this.init = function() {
		$scope.eventSources = [];

		$scope.calendarType = "ROOM_TYPE";
		if($scope.reservationData.rooms[0].roomTypeId == ""){
			$scope.calendarType = "BEST_AVAILABLE";
		}

		$scope.checkinDateInCalender = $scope.confirmedCheckinDate = getDateObj($scope.reservationData.arrivalDate);
		$scope.checkoutDateInCalender = $scope.confirmedCheckoutDate = getDateObj($scope.reservationData.departureDate);
        $scope.roomTypeForCalendar = $scope.reservationData.rooms[0].roomTypeId;
        $scope.nights = getNumOfStayNights();

		fetchAvailabilityDetails();

		/*var fetchSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			that.dataAssign(data);
			$scope.stayDetails = data;
			that.renderFullCalendar();
			$scope.refreshScroller();
		};*/
		//$scope.invokeApi(RVRoomRateCalendarSrv.fetchStayDateDetails, {},fetchSuccessCallback);


				
	};

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
        var toDate = businessDateParsed.setDate(businessDateParsed.getDate() + 365) ;
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

        console.log(availabilityKey);

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
                calEvt.startEditable = "true";
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
            	dateDetails[availabilityKey].room_type_availability > 0) { 
                calEvt.className = "availability"; //TODO: verify class name
            //room type not available but house available   
            } else if(dateDetails["house"].availability > 0) {
            	calEvt.className = "no-type-availability"; //TODO: verify class name
            //house not available(no room available in the hotel for any room type)
            } else{
				calEvt.className = "no-house-availability";
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



	this.init();

}]); 