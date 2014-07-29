sntRover.controller('RVStayDatesCalendarCtrl', ['$state','$stateParams', '$rootScope', '$scope', 'RVRoomRateCalendarSrv','$filter',
function($state, $stateParams, $rootScope, $scope, RVRoomRateCalendarSrv, $filter) {

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
		console.log('renderFullCalendar');
		/* event source that contains custom events on the scope */
		$scope.events = $scope.stayDetails.available_dates;

		//$scope.eventSources = [$scope.events];

		$scope.eventSources.length = 0;
		$scope.eventSources.push($scope.events);

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
		$scope.eventSources = [];

		var fetchSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			that.dataAssign(data);
			$scope.stayDetails = data;
			that.renderFullCalendar();
		};
		$scope.invokeApi(RVRoomRateCalendarSrv.fetchStayDateDetails, {},fetchSuccessCallback);
		
	};

	this.initialise();

}]); 