sntRover.controller('RVStayDatesCalendarCtrl', ['$state','$stateParams', '$rootScope', '$scope', 'RVStayDatesCalendarSrv','$filter',
function($state, $stateParams, $rootScope, $scope, RVStayDatesCalendarSrv, $filter) {

	//inheriting some useful things
	BaseCtrl.call(this, $scope);
	var that = this;
	$scope.heading = $filter('translate')('CHANGE_STAY_DATES_TITLE');
	$scope.setTitle($scope.heading);
	//scroller options
	$scope.setScroller('stay-dates-calendar'); 

	this.dataAssign = function(data) {
		//Data from Resolve method
		$scope.stayDetails = data;

		$scope.checkinDateInCalender = $scope.confirmedCheckinDate = getDateObj($scope.stayDetails.arrival_date);
		$scope.checkoutDateInCalender = $scope.confirmedCheckoutDate = getDateObj($scope.stayDetails.departure_date);

	};

	this.renderFullCalendar = function() {

		refreshCalendarEvents();

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
			console.log(data);
		};

		var params = {};
        params.from_date = $scope.reservationData.arrivalDate;
        params.to_date = $scope.reservationData.departureDate;
		$scope.invokeApi(RVStayDatesCalendarSrv.fetchAvailability, params, availabilityFetchSuccess);
	};

	$scope.changedDateOnCalendar = function(){
		console.log('changedDateOnCalendar');
		//refreshCalendarEvents();
		
	};

	var refreshCalendarEvents = function(){
		var events = dclone($scope.stayDetails.available_dates);
		$scope.eventSources.length = 0;
		$scope.eventSources.push(events);
	};

	$scope.refreshScroller = function() {
		setTimeout(function() {
			$scope.myScroll['stay-dates-calendar'].refresh();
		}, 0);
	};

	this.initialise();

}]); 