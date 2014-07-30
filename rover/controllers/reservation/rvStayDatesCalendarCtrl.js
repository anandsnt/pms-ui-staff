sntRover.controller('RVStayDatesCalendarCtrl', ['$state','$stateParams', '$rootScope', '$scope', 'RVStayDatesCalendarSrv','$filter',
function($state, $stateParams, $rootScope, $scope, RVStayDatesCalendarSrv, $filter) {

	//inheriting some useful things
	BaseCtrl.call(this, $scope);
	var that = this;
	$scope.heading = $filter('translate')('CHANGE_STAY_DATES_TITLE');
	$scope.setTitle($scope.heading);
	//scroller options
	$scope.setScroller('stay-dates-calendar'); 

	this.dataAssign = function() {
		//Data from Resolve method
		//$scope.stayDetails = data;
		

		//TODO: Use actual dates
		//$scope.reservationData.arrivalDate;
		//$scope.reservationData.departureDate;
		$scope.checkinDateInCalender = $scope.confirmedCheckinDate = getDateObj('2014-06-23');
		$scope.checkoutDateInCalender = $scope.confirmedCheckoutDate = getDateObj('2014-06-25');

	};

	this.renderFullCalendar = function() {

		refreshCalendarEvents();
		var events = computeEventSourceObject($scope.checkinDateInCalender, $scope.checkoutDateInCalender);
		console.log(JSON.stringify(events));
		$scope.eventSources.push(events);


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
			eventDrop : $scope.changedDateOnCalendar
		};
	}
	this.initialise = function() {
		$scope.eventSources = [];
		that.dataAssign();

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

    var computeEventSourceObject = function(checkinDate, checkoutDate){
    	/*checkinDate = getDateObj(checkinDate);
    	checkoutDate = getDateObj(checkoutDate);*/

        $scope.roomTypeForCalendar = {}; 
        $scope.roomTypeForCalendar.id = 55;

        var events = [];
        //var reservationStatus = $scope.stayDetails.calendarDetails.reservation_status;

        var thisDate;
        var calEvt = {};
        angular.forEach($scope.availabilityDetails.results, function(dateDetails, date) {
        
            calEvt = {};
            //Fixing the timezone issue related with fullcalendar
            thisDate = getDateObj(date);
            
            calEvt.title = $rootScope.currencySymbol + 
                            dateDetails[$scope.roomTypeForCalendar.id].rate_available.room_rates.single;
            calEvt.start = thisDate;
            calEvt.end = thisDate;
            calEvt.day = thisDate.getDate().toString();
            console.log(thisDate);
            console.log(checkinDate);
            

            //Event is check-in
            if (thisDate.getTime() === checkinDate.getTime()) {
                calEvt.id = "check-in";
                calEvt.className = "check-in";
                //if (reservationStatus != "CHECKEDIN" && reservationStatus != "CHECKING_OUT") {
                calEvt.startEditable = "true";
                //}
                calEvt.durationEditable = "false";

                //If check-in date and check-out dates are the same, show split view.
                /*if (checkinDate.getTime() == checkoutDate.getTime()) {
                    calEvt.className = "check-in split-view";
                    events.push(calEvt);
                    //checkout-event
                    calEvt = {};
                    if ($scope.stayDetails.calendarDetails.is_rates_suppressed == "true") {
                        calEvt.title = $scope.stayDetails.calendarDetails.text_rates_suppressed;
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
                }*/

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
	
	/**
	* Event handler for the room type dropdown in top 
	* - the dropdown which defines the data for calendar.
	*/
	$scope.roomTypeForCalendarChanged = function(){
		$scope.finalRoomType = $scope.roomTypeForCalendar;
	};

	var fetchAvailabilityDetails = function(){
		var availabilityFetchSuccess = function(data){
			$scope.$emit('hideLoader');
			$scope.availabilityDetails = data;
			
			that.renderFullCalendar();
		};

		var params = {};
        params.from_date = '2014-06-23';
        params.to_date = '2014-06-25';
		$scope.invokeApi(RVStayDatesCalendarSrv.fetchAvailability, params, availabilityFetchSuccess);
	};

	$scope.changedDateOnCalendar = function(){
		console.log('changedDateOnCalendar');
		//refreshCalendarEvents();
		
	};

	var refreshCalendarEvents = function(){
		//var events = dclone($scope.stayDetails.available_dates);
		$scope.eventSources.length = 0;
		//$scope.eventSources.push(events);
	};

	$scope.refreshScroller = function() {
		setTimeout(function() {
			$scope.myScroll['stay-dates-calendar'].refresh();
		}, 0);
	};

	this.initialise();

}]); 