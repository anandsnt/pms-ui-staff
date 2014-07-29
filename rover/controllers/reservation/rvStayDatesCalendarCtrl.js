sntRover.controller('RVStayDatesCalendarCtrl', ['$state','$stateParams', '$rootScope', '$scope', 'RVRoomRateCalendarSrv','$filter',
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

/*	this.dataAssign = function(data) {
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

	};*/

	this.renderFullCalendar = function() {
		console.log('renderFullCalendar');
		/* event source that contains custom events on the scope */
		$scope.events = $scope.stayDetails.available_dates;

		//$scope.eventSources = [$scope.events];

		$scope.eventSources.length = 0;
		$scope.eventSources.push($scope.events);

		console.log($scope.eventSources);
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
			ignoreTimezone : false//, // For ignoring timezone,
			//eventDrop : $scope.changedDateOnCalendar,
		};
	}
	this.initialise = function() {
		console.log('initialise');
		$scope.eventSources = [];
		/* var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();


    // For DEMO only  This can be created however you please. 
    // *************
    $scope.events = [
        {
        title: 'All Day Event',
        start: new Date(y, m, 1)},
    {
        title: 'Long Event',
        start: new Date(y, m, d - 5),
        end: new Date(y, m, d - 2)},
    {
        id: 999,
        title: 'Repeating Event',
        start: new Date(y, m, d - 3, 16, 0),
        allDay: false},
    {
        id: 999,
        title: 'Repeating Event',
        start: new Date(y, m, d + 4, 16, 0),
        allDay: false},
    {
        title: 'Meeting',
        start: new Date(y, m, d, 10, 30),
        allDay: false},
    {
        title: 'Lunch',
        start: new Date(y, m, d, 12, 0),
        end: new Date(y, m, d, 14, 0),
        allDay: false},
    {
        title: 'Birthday Party',
        start: new Date(y, m, d + 1, 19, 0),
        end: new Date(y, m, d + 1, 22, 30),
        allDay: false},
    {
        title: 'Click for Google',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        url: 'http://google.com/'}];

        $scope.eventSources = [$scope.events];*/


		var fetchSuccessCallback = function(data) {
			console.log("fetchSuccessCallback");
			$scope.$emit('hideLoader');
			//that.dataAssign(data);
			$scope.stayDetails = data;
			that.renderFullCalendar();
		};
		$scope.invokeApi(RVRoomRateCalendarSrv.fetchStayDateDetails, {},fetchSuccessCallback);
		
	};

	this.initialise();


}]); 