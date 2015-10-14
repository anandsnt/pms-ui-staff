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
		
		var that = this, availabilityData = null;

		var getFirstDayOfMonth = function(date) {
			return getDayOfMonth(date, 1);
		};

		var getDayOfMonth = function(date, day){
			var date = new Date(date),
				y = date.getFullYear(),
				m = date.getMonth();

			return $filter('date')(new Date(y, m, day), $rootScope.dateFormatForAPI);
		}

		var getLastDayOfMonth = function(date) {
			var date = new Date(date),
				y = date.getFullYear(),
				m = date.getMonth();

			return $filter('date')(new Date(y, m + 1, 0), $rootScope.dateFormatForAPI);
		};

		var getLastDayOfNextMonth = function(date) {
			var date = new Date(date),
				y = date.getFullYear(),
				m = date.getMonth();

			return $filter('date')(new Date(y, m + 2, 0), $rootScope.dateFormatForAPI);
		};

		/**
		 * for each day in calendar, we need to form day data for event source
		 * @param  {Object} dailyData
		 * @return {String}
		 */
		var getDayDataAgainstDailyData = function (dailyData) {
			var arrivalDateString 	= $scope.reservationData.arrivalDate,
				departureDateString = $scope.reservationData.departureDate;

			if (dailyData.date === arrivalDateString || dailyData.date === departureDateString) {
				return new tzIndependentDate(dailyData.date).getDate().toString();
			}
			return "";
		};

		/**
		 * According to each day, we need to pass seperate CSS class
		 * @param  {Object} dailyData
		 * @return {String}
		 */
		var getClassNameAgainstDailyData = function (dailyData) {
			var classes = "",
				rData 	= $scope.reservationData,
				dayHouseAvailability = dailyData.house.availability;
				

			//if the date is checkin/checkout 
			if (dailyData.date === rData.arrivalDate) {
				classes += 'check-in ';
			} 
			if (dailyData.date === rData.departureDate) {
				classes += 'check-out ';
			}

			//if day house availability is 0 or less
			if (dayHouseAvailability <= 0 || !isRoomTypeAvailable(dailyData)) {
				classes += 'unavailable ';
			} else if (dailyData.date !== rData.departureDate) {
				classes += 'available ';
			}
			return classes;
		};

		/**
		 * Will form the title from here
		 * @param  {Object} dailyData
		 * @return {String}
		 */
		var getTitleAgainstDailyData = function (dailyData) {
			var dayHouseAvailability = dailyData.house.availability;
			if (dayHouseAvailability <= 0) {
				return dayHouseAvailability.toString();
			}else
				return "";				
		};

		var isRoomTypeAvailable = function(dailyData){
			    var room_type_availability = $scope.stateVariables.selectedRoom == null? "" : $scope.stateVariables.selectedRoom;
                if(room_type_availability !== "" && dailyData.room_types[room_type_availability] <= 0)
                	return false;
                return true;
		}

		var getEmptyRateDetails = function(){
                var bestRateData = {};
			    bestRateData.room_type_name = "";
				bestRateData.rate_name = "";
				bestRateData.availability = "";
				bestRateData.restrictions = [];
				return bestRateData;
		}

		/**
		 * [findBestAvailableRateAgainstDate description]
		 * @return {[type]} [description]
		 */
		var findBestAvailableRateAgainstDate = function(dailyData) {

            if(isRoomTypeAvailable(dailyData)){
            	var availabileRates = _.reject(dailyData.rates, function(rate){
					$scope.stateVariables.selectedRate = $scope.stateVariables.selectedRate == null? "" : $scope.stateVariables.selectedRate;
					return (isInRoomTypeSelectedMode() && rate.id !== $scope.stateVariables.selectedRate && $scope.stateVariables.selectedRate != "");
				}),
				availableRoomRates = _.pluck (availabileRates, "room_rates"),
				firstAvailableRoomRate = _.reject(availableRoomRates[0],function(room_rate){
					return !isRoomRateFiltered(room_rate);
				}),
				minAvailableRoomRate = 	availableRoomRates[0],		
				minAmongRate = _.min (_.pluck(firstAvailableRoomRate, 'single')),
				min_room_rate = _.findWhere(firstAvailableRoomRate, {single:minAmongRate}), 
				minAmongRate = minAmongRate === null ? 0 : minAmongRate,
				bestAvailableRate = minAmongRate,

				eachAvailableRoomRate = null;

			
			for (var i = 1; i < availableRoomRates.length; i++) {
				eachAvailableRoomRate = _.reject(availableRoomRates[i], function(room_rate){
					return !isRoomRateFiltered(room_rate);
				});
				minAmongRate = _.min (_.pluck(eachAvailableRoomRate, 'single'));
				if (minAmongRate !== null && minAmongRate <=  bestAvailableRate){
					bestAvailableRate = minAmongRate;
					minAvailableRoomRate = availableRoomRates[i];
					min_room_rate = _.findWhere(eachAvailableRoomRate, {single:minAmongRate});
				}
			}
			bestAvailableRate = bestAvailableRate == Infinity ? "" : bestAvailableRate;
			var bestRateData = {};
			bestRateData.bestAvailableRate = bestAvailableRate;
			if(bestAvailableRate != ''){
				bestRateData.room_type_name = _.findWhere($scope.stateVariables.rooms, {id:min_room_rate.room_type_id}).name;
				bestRateData.rate_name = _.findWhere($scope.stateVariables.rates, {id: _.findWhere(availabileRates, {room_rates: minAvailableRoomRate}).id}).name;
				bestRateData.availability = min_room_rate.availability;
				_.each(min_room_rate.restrictions, function(restriction){

				restriction.value = _.findWhere($scope.stateVariables.restriction_types, {id:restriction.restriction_type_id}).value;
			});
			bestRateData.restrictions = min_room_rate.restrictions;
			}else{
				bestRateData = _.extend(bestRateData, getEmptyRateDetails());
			}
			return bestRateData;
            }else{
                var rateData = getEmptyRateDetails();
                rateData.bestAvailableRate = dailyData.room_types[$scope.stateVariables.selectedRoom];
                return rateData;
            }
            
		};

		/**To filter the room rates
		 * [isRoomRateFiltered description]
		 * @return {object} [description]
		 */
		var isRoomRateFiltered = function(room_rate){
			if(room_rate.single == null)
				return false;
			else{
                
				$scope.stateVariables.selectedRoom = $scope.stateVariables.selectedRoom == null? "" : $scope.stateVariables.selectedRoom;
				
				if(typeof _.findWhere(room_rate.restrictions, {id:1}) !== 'undefined')
					return false;
				else if(isInRoomTypeSelectedMode() && room_rate.room_type_id !== $scope.stateVariables.selectedRoom && $scope.stateVariables.selectedRoom != "")
					return false;
				else if(!isRestrictionIncludedInSearch() && room_rate.restrictions.length > 0)
					return false;
				else if(isInBestAvailableMode() && isShowAvailableRoomsSelected() && room_rate.availability
					<= 0)
					return false;
			}
			return true;
		}

		/**
		 * when a day is rendered, this callback will fire
		 * @param  {Object} date
		 * @param  {DOMNode} cell
		 */
		var dayRendered = function(date, cell) {
			var formattedDate = $filter('date')(date, $rootScope.dateFormatForAPI);
			var correspondingEventData = _.findWhere(availabilityData.results, {'date': formattedDate});

			if (typeof correspondingEventData !== "undefined") {

			}
		};

		/**
		 * against each day, we need to form event data
		 * @param  {Object} dailyData
		 * @return {Object}
		 */
		var formEventData = function (dailyData) {

			var bestRateData = findBestAvailableRateAgainstDate(dailyData);
			var title = getTitleAgainstDailyData (dailyData);
			var eventData = {
				day 		: getDayDataAgainstDailyData (dailyData),
				className 	: getClassNameAgainstDailyData (dailyData),
				start 		: new tzIndependentDate (dailyData.date),
				end 		: new tzIndependentDate (dailyData.date),
				editable 	: false,
				title 		: title == ""? bestRateData.bestAvailableRate.toString() : title,
				toolTipData : bestRateData,
				currencySymbol : $scope.currencySymbol
			};

			return eventData;
		};

		/**
		 * whether we are processing on the left side calendar
		 * @param  {Object}  dailyData
		 * @return {Boolean}
		 */
		var isProcessingLeftSideCalendar = function(dailyData) {
			//if the month of left calndr and date are same, it means
			return ($scope.leftCalendarOptions.month === new tzIndependentDate(dailyData.date).getMonth());
		};

		/**
		 * whether we are processing on the right side calendar
		 * @param  {Object}  dailyData
		 * @return {Boolean}
		 */
		var isProcessingRightSideCalendar = function(dailyData) {
			//if the month of right calndr and date are same, it means
			return ($scope.rightCalendarOptions.month === new tzIndependentDate(dailyData.date).getMonth());
		};


		/**
		 * ui-calendar requires an array of events to render
		 * this method is to form those events	
		 */
		var formCalendarEvents = function() {
			var calendarData = {
				left: [],
				right: []
			},
			eventData = null;

			_.each(availabilityData.results, function(dailyData) {
				eventData = formEventData(dailyData);

				if (isProcessingLeftSideCalendar(dailyData)) {
					calendarData.left.push(eventData);
				} 
				else if (isProcessingRightSideCalendar(dailyData)) {
					calendarData.right.push(eventData);
				}
			});

			//updating the left, right side calendar data model with new ones
			$scope.eventSources.left.push(calendarData.left);
			$scope.eventSources.right.push(calendarData.right);
			refreshScroller();
		};
		
		/**
		 * success call back of calendar details fetch
		 * @param  {Object} API response	 
		 */
		var successCallBackOfFetchCalendarAvailabilityData = function(data) {
			$scope.stateVariables.rooms = data.room_types;
			$scope.stateVariables.rates = data.rates;
			$scope.stateVariables.restriction_types = data.restriction_types;
			availabilityData = data;
			$scope.showCalender = true;

			renderFullCalendar();
			formCalendarEvents ();
		};

		/**
		 * to fetch calendar availability data
		 * @param  {String} from date
		 * @param  {String} to date
		 */
		var fetchCalendarAvailabilityData = function(from, to) {
			var params = {
                from_date: from,
				to_date: to
            };

            var options = {
                params: params,
                successCallBack: successCallBackOfFetchCalendarAvailabilityData
            };

            $scope.callAPI(RVStayDatesCalendarSrv.fetchCalendarData, options);
		};

		/**
		 * to reset the event model that we are passing to calendar
		 */
		var resetCalenarEventModel = function() {
			$scope.eventSources.left.length = 0;
			$scope.eventSources.right.length = 0;
		};

		/**
		 * to set title & iScroll object
		 */
		var	setTitleAndScroller = function() {
			//heading & title
			$scope.heading = $filter('translate')('CHANGE_STAY_DATES_TITLE');
			$scope.setTitle ($scope.heading);
			
			//scroller options
			$scope.setScroller ('room-rates-calendar');
		};

		/**
		 * method to refresh scroller
		 */
		var	refreshScroller = function() {
			$timeout(function() {
				$scope.refreshScroller('room-rates-calendar');
			}, 100);
		};

		/**
		 * Set the calendar options to display the calendar
		 */
		var renderFullCalendar = function() {
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
				month: typeof $scope.leftCalendarOptions == 'undefined'?$scope.confirmedCheckinDate.getMonth():$scope.leftCalendarOptions.month, // Check in month (month is zero based)
				day: $scope.confirmedCheckinDate.getDate(), // Check in day
				editable: true,
				disableResizing: false,
				contentHeight: 320,
				weekMode: 'fixed',
				ignoreTimezone: false, // For ignoring timezone,
				dayRender 	: dayRendered
			};

			$scope.leftCalendarOptions = _.extend({}, fullCalendarOptions);

			$scope.rightCalendarOptions = _.extend({}, fullCalendarOptions);

			// //Set month of rigt calendar
			$scope.rightCalendarOptions.month = $scope.leftCalendarOptions.month + 1;

			$scope.disablePrevButton = $scope.isPrevButtonDisabled();

			refreshScroller();
		};

		$scope.$on('availableRateFiltersUpdated', function(event){
			resetCalenarEventModel();
			formCalendarEvents();
		});

		$scope.selectedBestAvailableRatesCalOption = function() {
			switchToBestAvailableRateMode ();
			resetCalenarEventModel();
			formCalendarEvents();
		};

		/**
		 * Event handler for Room type view selecton
		 */
		$scope.selectedRoomTypesCalOption = function() {
			switchToRoomTypeMode ();
			resetCalenarEventModel();
			formCalendarEvents();

		};

		$scope.filtersUpdated = function () {
			resetCalenarEventModel();
			formCalendarEvents();

		}


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
			resetCalenarEventModel ();
			fetchCalendarAvailabilityData(getFirstDayOfMonth(startDate), getLastDayOfNextMonth(startDate));
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

		/**
		 * to switch to Room type selected mode
		 */
		var switchToRoomTypeMode = function () {
			$scope.stateCheck.calendarState.calendarType = "ROOM_TYPE";
			

		};

		/**
		 * to switch to best available rate mode
		 */
		var switchToBestAvailableRateMode = function () {
			$scope.stateCheck.calendarState.calendarType = "BEST_AVAILABLE";
			
		};

		/**
		 * [isInBestAvailableMode description]
		 * @return {Boolean}
		 */
		var isInBestAvailableMode = function() {
			return ($scope.stateCheck.calendarState.calendarType === "BEST_AVAILABLE");
		};

		/**
		 * [isInRoomTypeSelectedMode description]
		 * @return {Boolean}
		 */
		var isInRoomTypeSelectedMode = function() {
			return ($scope.stateCheck.calendarState.calendarType === "ROOM_TYPE");
		};

		/**
		 * [isRestrictionIncludeInSearch description]
		 * @return {Boolean}
		 */
		var isRestrictionIncludedInSearch = function() {
			return ($scope.stateCheck.calendarState.searchWithRestrictions);
		};

		/**
		 * [isShowAvailableRoomsSelected description]
		 * @return {Boolean}
		 */
		var isShowAvailableRoomsSelected = function() {
			return ($scope.stateCheck.calendarState.showOnlyAvailableRooms);
		};

		/**
		 * to initialize variables in controllers
		 */
		var initializeVariables = function() {
			var resData = $scope.reservationData;
			$scope.showCalender = false; 
			$scope.eventSources = {
				left: [],
				right: []
			};

			$scope.stateVariables = {
				selectedRoom: parseInt(resData.tabs[$scope.viewState.currentTab].roomTypeId, 10) || "",
				selectedRate: parseInt(resData.rooms[$scope.stateCheck.roomDetails.firstIndex].rateId, 10) || "",
				rooms: [],
				rates: []
			};

			$scope.checkinDateInCalender = $scope.confirmedCheckinDate = tzIndependentDate(resData.arrivalDate);
			$scope.checkoutDateInCalender = $scope.confirmedCheckoutDate = tzIndependentDate(resData.departureDate);			

			//finalRoomType - Room type finally selected by the user. corresponds to the bottom select box
			//roomTypeForCalendar - Room type which specifies the calendar data
			$scope.finalRoomType = $scope.roomTypeForCalendar = resData.rooms[0].roomTypeId;
		};

		/**
		 * we need to set mode initialliy
		 */
		var chooseMode = function() {
			if (!!$scope.stateVariables.selectedRoom) {
				switchToRoomTypeMode ();
			}
			else {
				switchToBestAvailableRateMode ();
			}
			$scope.$emit('roomTypesCalOptionSelected');
		};

		/**
		 * to show calender initially
		 */
		var fetchAndShowCalendar = function() {
			var firstDayOfCal = getDayOfMonth($scope.checkinDateInCalender, parseInt(tzIndependentDate($rootScope.businessDate).getDate())),
				lastDayOfNextMonth = getLastDayOfNextMonth($scope.checkinDateInCalender);
			
			fetchCalendarAvailabilityData (firstDayOfCal, lastDayOfNextMonth);
		};

		/**
		 * to what we need to in initial time
		 */
		var initializeMe = function() {

			initializeVariables();

			setTitleAndScroller();

			chooseMode();

			fetchAndShowCalendar();
		}();

	}
]);
