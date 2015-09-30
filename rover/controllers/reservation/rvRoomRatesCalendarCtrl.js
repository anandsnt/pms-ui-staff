sntRover.controller('RVRoomRatesCalendarCtrl', ['$state',
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
		$scope.setScroller('room-rates-calendar');

		this.init = function() {
			$scope.eventSources = [];

			$scope.calendarType = "ROOM_TYPE";
			if ($scope.reservationData.rooms[0].roomTypeId === "") {
				$scope.calendarType = "BEST_AVAILABLE";
			}
			$scope.checkinDateInCalender = $scope.confirmedCheckinDate = tzIndependentDate($scope.reservationData.arrivalDate);
			$scope.checkoutDateInCalender = $scope.confirmedCheckoutDate = tzIndependentDate($scope.reservationData.departureDate);

			//finalRoomType - Room type finally selected by the user. corresponds to the bottom select box
			//roomTypeForCalendar - Room type which specifies the calendar data
			$scope.finalRoomType = $scope.roomTypeForCalendar = $scope.reservationData.rooms[0].roomTypeId;
			that.renderFullCalendar();
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
			
			// //Setting events for right calendar
			 $scope.rightCalendarOptions = dclone(fullCalendarOptions);

			// //Set month of rigt calendar
			$scope.rightCalendarOptions.month = $scope.leftCalendarOptions.month + 1;

			$scope.disablePrevButton = $scope.isPrevButtonDisabled();

			setTimeout(function(){
				$scope.refreshScroller('room-rates-calendar');
			}, 1500);


		};

		
		$scope.selectedBestAvailableRatesCalOption = function() {
			$scope.calendarType = 'BEST_AVAILABLE';
		};
		/**
		* Event handler for Room type view selecton
		*/
		$scope.selectedRoomTypesCalOption = function() {
			$scope.calendarType = 'ROOM_TYPE';
		};

		
		$scope.isPrevButtonDisabled = function() {
			var disabled = false;
			if (parseInt(tzIndependentDate($rootScope.businessDate).getMonth()) === parseInt($scope.leftCalendarOptions.month)) {
				disabled = true;
			}
			return disabled;

		};

		/**
		* Handles the forward and backward change for the calendar months
		*/
		var changeMonth = function(direction){
			if(direction === 'FORWARD'){
				$scope.leftCalendarOptions.month = parseInt($scope.leftCalendarOptions.month) + 1;
				$scope.rightCalendarOptions.month = parseInt($scope.rightCalendarOptions.month) + 1;
			} else {
				$scope.leftCalendarOptions.month = parseInt($scope.leftCalendarOptions.month) - 1;
				$scope.rightCalendarOptions.month = parseInt($scope.rightCalendarOptions.month) - 1;
			}
			$scope.disablePrevButton = $scope.isPrevButtonDisabled();
		};

		/**
		* Click handler for the next month arrow
		* Fetches the details for the next set of dates -
		* Starting from last fetched date to the max visible date in calendar when we change month
		*/
		$scope.nextButtonClickHandler = function() {
			
			changeMonth('FORWARD');
		};

		/**
		* Click handler for the next month arrow
		* Fetches the details for the next set of dates -
		* Stars from the first visible date in calendar when go back a month
		* to the start date available in the availability details
		*/
		$scope.prevButtonClickHandler = function() {
		
			changeMonth('BACKWARD');
		};

		this.init();

	}
]);