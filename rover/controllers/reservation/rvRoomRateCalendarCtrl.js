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


}]); 