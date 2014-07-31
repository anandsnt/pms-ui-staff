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

		$scope.checkinDateInCalender = $scope.confirmedCheckinDate = getDateObj($scope.reservationData.arrivalDate);
		$scope.checkoutDateInCalender = $scope.confirmedCheckoutDate = getDateObj($scope.reservationData.departureDate);
    	//TODO: Remove the hardcoding
        $scope.roomTypeForCalendar = {}; 
        $scope.roomTypeForCalendar.id = $scope.reservationData.rooms[0].roomTypeId;
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
			
			that.renderFullCalendar();
		};

		var params = {};
        params.from_date = $scope.reservationData.arrivalDate;
        params.to_date = $scope.reservationData.departureDate;
		$scope.invokeApi(RVStayDatesCalendarSrv.fetchAvailability, params, availabilityFetchSuccess);
	};

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
		refreshCalendarEvents($scope.checkinDateInCalender, $scope.checkoutDateInCalender)
	}

	/**
	* Compute the fullcalendar events object from the availability details
	*/
    var computeEventSourceObject = function(checkinDate, checkoutDate){
        var events = [];

        var thisDate;
        var calEvt = {};
        angular.forEach($scope.availabilityDetails.results, function(dateDetails, date) {
        
            calEvt = {};
            //instead of new Date(), Fixing the timezone issue related with fullcalendar
            thisDate = getDateObj(date);
            
            calEvt.title = $rootScope.currencySymbol + 
                            dateDetails[$scope.roomTypeForCalendar.id].rate_available.room_rates.single;
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
                    calEvt.title = $rootScope.currencySymbol + 
                            dateDetails[$scope.roomTypeForCalendar.id].rate_available.room_rates.single;
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
                calEvt.className = "type-available";
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
		refreshCalendarEvents($scope.checkinDateInCalender, $scope.checkoutDateInCalender)
	};

	var refreshCalendarEvents = function(checkinDate, checkoutDate){
		$scope.eventSources.length = 0;
		$scope.events = computeEventSourceObject(checkinDate, checkoutDate);
		$scope.eventSources.length = 0;
		$scope.eventSources.push($scope.events);
	};

	$scope.refreshScroller = function() {
		setTimeout(function() {
			$scope.myScroll['stay-dates-calendar'].refresh();
		}, 0);
	};

	this.init();

}]); 