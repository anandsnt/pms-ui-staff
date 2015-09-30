sntRover.controller('RVRoomRatesCalendarCtrl', ['$state',
	'$stateParams',
	'$rootScope',
	'$scope',
	'RVStayDatesCalendarSrv',
	'$filter',
	'$timeout',
	function($state, $stateParams, $rootScope, $scope, RVStayDatesCalendarSrv, $filter, $timeout) {
		//inheriting some useful things
		BaseCtrl.call(this, $scope);
		var that = this,
			currentMasterData,
			setTitleAndScroller = function() {
				$scope.heading = $filter('translate')('CHANGE_STAY_DATES_TITLE');
				$scope.setTitle($scope.heading);
				//scroller options
				$scope.setScroller('room-rates-calendar');
			},
			refreshScroller = function() {
				$timeout(function() {
					$scope.refreshScroller('room-rates-calendar');
				}, 1000);
			},
			getFirstDayOfMonth = function(date) {
				var date = new Date(date),
					y = date.getFullYear(),
					m = date.getMonth();
				return $filter('date')(new Date(y, m, 1), 'yyyy-MM-dd');
			},
			getLastDayOfMonth = function(date) {
				var date = new Date(date),
					y = date.getFullYear(),
					m = date.getMonth();
				return $filter('date')(new Date(y, m + 1, 0), 'yyyy-MM-dd');
			},
			getLastDayOfNextMonth = function(date) {
				var date = new Date(date),
					y = date.getFullYear(),
					m = date.getMonth();
				return $filter('date')(new Date(y, m + 2, 0), 'yyyy-MM-dd');

			},
			resetCalendarEvents = function() {


				var calendarData = {
						left: [],
						right: []
					},
					arrivalDateString = $scope.reservationData.arrivalDate,
					departureDateString = $scope.reservationData.departureDate;

				_.each(currentMasterData.results, function(dailyStat) {

					var dayAvailabilityToDisplay = dailyStat.house.availability;					

					var eventData = {
						day: (function() {
							if (dailyStat.date === arrivalDateString || dailyStat.date === departureDateString) {
								return new tzIndependentDate(dailyStat.date).getDate().toString();
							}
							return "";
						})(),
						className: (function() {
							var classes = "";
							if (dailyStat.date === arrivalDateString) {
								classes += 'check-in ';
							} else if (dailyStat.date === departureDateString) {
								classes += 'check-out ';
							}

							if (dayAvailabilityToDisplay <= 0) {
								classes += 'unavailable ';
							} else if (dailyStat.date !== departureDateString) {
								classes += 'available ';
							}
							return classes;
						})(),
						start: new tzIndependentDate(dailyStat.date),
						end: new tzIndependentDate(dailyStat.date),
						editable: false,
						title: (function() {
							if (dayAvailabilityToDisplay <= 0) {
								return dayAvailabilityToDisplay.toString();
							}
							return "";
						})()
					};
					if ($scope.leftCalendarOptions.month === new tzIndependentDate(dailyStat.date).getMonth()) {
						calendarData.left.push(eventData);
					} else if ($scope.rightCalendarOptions.month === new tzIndependentDate(dailyStat.date).getMonth()) {
						calendarData.right.push(eventData);
					}
				});

				$scope.eventSources.left.push(calendarData.left);
				$scope.eventSources.right.push(calendarData.right);
			},
			getCalendarData = function(from, to) {
				$scope.invokeApi(RVStayDatesCalendarSrv.fetchCalendarData, {
					from_date: from,
					to_date: to
				}, function(data) { //Success Callback
					$scope.$emit('hideLoader');
					console.log(data);
					currentMasterData = data;
					$scope.stateVariables.rooms = data.room_types;
					$scope.stateVariables.rates = data.rates;
					resetCalendarEvents();
				}, function(errorMessage) { // Failure Callback
					$scope.errorMessage = errorMessage;
				});
			},
			resetBoundData = function() {
				$scope.eventSources.left.length = 0;
				$scope.eventSources.right.length = 0;
			};


		this.init = function() {
			$scope.eventSources = {
				left: [],
				right: []
			};

			$scope.stateVariables = {
				selectedRoom: parseInt($scope.reservationData.tabs[$scope.viewState.currentTab].roomTypeId,10) || "",
				selectedRate: parseInt($scope.reservationData.rooms[$scope.stateCheck.roomDetails.firstIndex].rateId,10) || "",
				rooms: [],
				rates: []
			}

			$scope.$emit('roomTypesCalOptionSelected');
			if (!!$scope.stateVariables.selectedRoom) {
				$scope.stateCheck.calendarState.calendarType = "ROOM_TYPE";
			} else {
				$scope.stateCheck.calendarState.calendarType = "BEST_AVAILABLE";
			}
			$scope.checkinDateInCalender = $scope.confirmedCheckinDate = tzIndependentDate($scope.reservationData.arrivalDate);
			$scope.checkoutDateInCalender = $scope.confirmedCheckoutDate = tzIndependentDate($scope.reservationData.departureDate);

			//finalRoomType - Room type finally selected by the user. corresponds to the bottom select box
			//roomTypeForCalendar - Room type which specifies the calendar data
			$scope.finalRoomType = $scope.roomTypeForCalendar = $scope.reservationData.rooms[0].roomTypeId;
			that.renderFullCalendar();
			getCalendarData(getFirstDayOfMonth($scope.checkinDateInCalender), getLastDayOfNextMonth($scope.checkinDateInCalender));
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

			refreshScroller();

		};


		$scope.selectedBestAvailableRatesCalOption = function() {
			$scope.stateCheck.calendarState.calendarType = 'BEST_AVAILABLE';
		};
		/**
		 * Event handler for Room type view selecton
		 */
		$scope.selectedRoomTypesCalOption = function() {
			$scope.stateCheck.calendarState.calendarType = 'ROOM_TYPE';
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
		var changeMonth = function(direction) {
			var startDate;
			if (direction === 'FORWARD') {
				$scope.leftCalendarOptions.month = parseInt($scope.leftCalendarOptions.month) + 1;
				$scope.rightCalendarOptions.month = parseInt($scope.rightCalendarOptions.month) + 1;
			} else {
				$scope.leftCalendarOptions.month = parseInt($scope.leftCalendarOptions.month) - 1;
				$scope.rightCalendarOptions.month = parseInt($scope.rightCalendarOptions.month) - 1;
			}
			$scope.disablePrevButton = $scope.isPrevButtonDisabled();
			startDate = new Date($scope.leftCalendarOptions.year, $scope.leftCalendarOptions.month);
			resetBoundData();
			getCalendarData(getFirstDayOfMonth(startDate), getLastDayOfNextMonth(startDate));
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