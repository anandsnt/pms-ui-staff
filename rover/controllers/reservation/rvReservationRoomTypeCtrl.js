sntRover.controller('RVReservationRoomTypeCtrl', ['$rootScope', '$scope', 'roomRates', 'RVReservationBaseSearchSrv', '$timeout', '$state', 'ngDialog', '$sce', '$stateParams', 'dateFilter', '$filter',
	function($rootScope, $scope, roomRates, RVReservationBaseSearchSrv, $timeout, $state, ngDialog, $sce, $stateParams, dateFilter, $filter) {

		// smart switch btw edit reservation flow and create reservation flow
		if ( !!$state.params && $state.params.isFromChangeStayDates ) {
			$rootScope.setPrevState = {
				title: 'Stay Dates',
				name: 'rover.reservation.staycard.changestaydates'
			}
		} else if( $scope.reservationData && $scope.reservationData.confirmNum && $scope.reservationData.reservationId ) {
			$rootScope.setPrevState = {
				title: $filter('translate')('STAY_CARD'),
				name: 'rover.reservation.staycard.reservationcard.reservationdetails',
				param: {
					confirmationId: $scope.reservationData.confirmNum,
					id: $scope.reservationData.reservationId,
					isrefresh: true
				}
			}
		} else {
			$rootScope.setPrevState = {
				title: $filter('translate')('CREATE_RESERVATION'),
				callback: 'setSameCardNgo',
				scope: $scope
			}
		}

		// since we are going back to create reservation screen
		// mark 'isSameCard' as true on '$scope.reservationData'
		$scope.setSameCardNgo = function() {
			$scope.reservationData.isSameCard = true;
			$state.go('rover.reservation.search');
		};



		$scope.displayData = {};
		$scope.selectedRoomType = -1;
		$scope.expandedRoom = -1;
		//TODO : Make adjustments if multiple rooms are selected and the room selection bar is displayed
		$scope.containerHeight = $(window).height() - 280;
		$scope.showLessRooms = true;
		$scope.showLessRates = false;

		// $scope.activeMode = "ROOM_RATE";
		$scope.stateCheck = {
			rateSelected: {
				allDays: false,
				oneDay: false,
			},
			activeMode: "ROOM_RATE",
			stayDatesMode: false,
			selectedStayDate: "",
			guestOptionsIsEditable: false,
			preferredType: "",
			rateFilterText: "",
			dateModeActiveDate: "",
			restrictedContractedRates: {},
			datesContainerWidth: $(window).width() - 180,
			dateButtonContainerWidth: $scope.reservationData.stayDays.length * 80,
			suppressedRates: []
		};

		$scope.showingStayDates = false;


		// activate room type default view based on reservation settings
		if ($scope.otherData.defaultRateDisplayName == 'Recommended') {
			$scope.activeCriteria = "RECOMMENDED";
		} else if ($scope.otherData.defaultRateDisplayName == 'By Rate') {
			$scope.activeCriteria = "RATE";
		} else {
			// By default RoomType
			$scope.activeCriteria = "ROOM_TYPE";
		}
		//CICO-5253 Rate Types Listing
		// 			RACK
		// 			BAR
		// 			Packages
		// 			Promotions
		$scope.ratetypePriority = {
			"Rack Rates": 0,
			"Bar Rates": 1,
			"Package Rates": 2,
			"Specials & Promotions": 3
		}


		$scope.setScroller('room_types', {
			preventDefault: false
		});

		$scope.setScroller('stayDates', {
			scrollX: true,
			scrollY: false
		});


		var init = function(isCallingFirstTime) {
			BaseCtrl.call(this, $scope);

			$scope.$emit('showLoader');
			$scope.heading = 'Rooms & Rates';
			$scope.setHeadingTitle($scope.heading);

			$scope.displayData.dates = [];
			$scope.filteredRates = [];
			$scope.stateCheck.restrictedContractedRates = [];
			$scope.isRateFilterActive = true;
			$scope.rateFiltered = false;

			$scope.otherData.taxesMeta = roomRates.tax_codes;

			//interim check on page reload if the page is refreshed
			if ($scope.reservationData.arrivalDate == '' || $scope.reservationData.departureDate == '') {
				//defaulting to today's and tommorow's dates
				$scope.reservationData.arrivalDate = (new tzIndependentDate().toISOString().slice(0, 10).replace(/-/g, "-"));
				$scope.reservationData.departureDate = (new tzIndependentDate(new tzIndependentDate().getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10).replace(/-/g, "-"));

				$($scope.reservationData.rooms).each(function(i, d) {
					$scope.reservationData.rooms[i].numAdults = 1;
					d.numChildren = 0;
					d.numInfants = 0;
				});

			}

			//defaults and hardcoded values
			$scope.tax = roomRates.tax || 0;
			$scope.rooms = $scope.reservationData.rooms;
			$scope.activeRoom = 0;

			// CICO - 6081 ! 
			/*
				Need to check the room type availability adn the house availability

				if (room type available || house available) then
					goto ROOM_RATE
				else
					goto CALENDAR
				endif
			*/

			// .. do the availabilty check here
			// TODO : This section might have to be redone when there are more than one room in a reservation
			if ($stateParams.view == "DEFAULT") {
				var isRoomAvailable = true;
				var isHouseAvailable = true;

				_.each(roomRates.results, function(dayInfo, index) {
					if (isHouseAvailable && dayInfo.house.availability < 1) {
						isHouseAvailable = false;
					}
					if (isRoomAvailable && $scope.reservationData.rooms[$scope.activeRoom].roomTypeId != "") {
						var roomStatus = _.findWhere(dayInfo.room_types, {
							"id": $scope.reservationData.rooms[$scope.activeRoom].roomTypeId
						});
						if (typeof roomStatus != "undefined" && roomStatus.availability < 1) {
							isRoomAvailable = false;
						};
					}
				});

				if (!isRoomAvailable && !isHouseAvailable && isCallingFirstTime) {
					$scope.toggleCalendar();
				}
			} else if ($stateParams.view == "CALENDAR" && isCallingFirstTime) {
				$scope.toggleCalendar();
			}

			//CICO-6069 Init selectedDay
			if (!$scope.stateCheck.dateModeActiveDate) {
				if ($scope.reservationData.midStay) {
					// checking if midstay and handling the expiry condition
					if (new tzIndependentDate($scope.reservationData.departureDate) > new tzIndependentDate($rootScope.businessDate)) {
						$scope.stateCheck.dateModeActiveDate = $rootScope.businessDate;
						$scope.stateCheck.selectedStayDate = $scope.reservationData.rooms[$scope.activeRoom].stayDates[$rootScope.businessDate];
					} else {
						$scope.stateCheck.dateModeActiveDate = $scope.reservationData.arrivalDate;
						$scope.stateCheck.selectedStayDate = $scope.reservationData.rooms[$scope.activeRoom].stayDates[$scope.reservationData.arrivalDate];
					}
				} else {
					$scope.stateCheck.dateModeActiveDate = $scope.reservationData.arrivalDate;
					$scope.stateCheck.selectedStayDate = $scope.reservationData.rooms[$scope.activeRoom].stayDates[$scope.reservationData.arrivalDate];
				}
			}

			//Restructure rates for easy selection
			var rates = [];

			$scope.days = roomRates.results.length;


			//Reset isSupressedField
			$scope.stateCheck.suppressedRates = [];
			$(roomRates.rates).each(function(i, d) {
				rates[d.id] = d;
				if (d.is_suppress_rate_on) {
					$scope.stateCheck.suppressedRates.push(d.id);
				}
			});

			$scope.displayData.allRates = rates;

			$scope.reservationData.ratesMeta = rates;

			$scope.roomAvailability = $scope.getAvailability(roomRates);

			//Filter for rooms which are available and have rate information
			$scope.displayData.allRooms = $(roomRates.room_types).filter(function() {
				return $scope.roomAvailability[this.id] && $scope.roomAvailability[this.id].availability == true &&
					$scope.roomAvailability[this.id].rates.length > 0 && $scope.roomAvailability[this.id].level != null;
			});

			//sort the rooms by levels


			$scope.displayData.allRooms.sort(function(a, b) {
				var room1AvgPerNight = parseInt($scope.roomAvailability[a.id].averagePerNight);
				var room2AvgPerNight = parseInt($scope.roomAvailability[b.id].averagePerNight);
				if (room1AvgPerNight < room2AvgPerNight)
					return -1;
				if (room1AvgPerNight > room2AvgPerNight)
					return 1;
				return 0;
			});

			$scope.displayData.allRooms.sort(function(a, b) {
				if (a.level < b.level)
					return -1;
				if (a.level > b.level)
					return 1;
				return 0;
			});

			//CICO-7792 : Bring contracted rates to the top
			$scope.displayData.allRooms.sort(function(a, b) {
				if (hasContractedRate($scope.roomAvailability[a.id].rates))
					return -1;
				if (hasContractedRate($scope.roomAvailability[b.id].rates))
					return 1;
				return 0;
			});



			//$scope.displayData.allRooms = roomRates.room_types;
			$scope.displayData.roomTypes = $scope.displayData.allRooms;

			//TODO: Handle the selected roomtype from the previous screen
			$scope.stateCheck.preferredType = $scope.reservationData.rooms[$scope.activeRoom].roomTypeId;
			//$scope.preferredType = 5;
			$scope.roomTypes = roomRates.room_types;
			$scope.filterRooms();
			$scope.$emit('hideLoader');
		};

		var selectRoomAndRate = function() {
			$scope.reservationData.rateDetails[$scope.activeRoom] = $scope.roomAvailability[$scope.reservationData.rooms[$scope.activeRoom].roomTypeId].ratedetails;
			$scope.computeTotalStayCost();
			var rates = [];
			_.each($scope.reservationData.rooms[0].stayDates, function(staydate, idx) {
				rates.push(staydate.rate.id);
			});

			function allthesame(arr) {
				var L = arr.length - 1;
				while (L) {
					if (arr[L--] !== arr[L]) return false;
				}
				return true;
			}

			if (allthesame(rates)) {
				$scope.reservationData.rooms[$scope.activeRoom].rateId = rates;
				$scope.reservationData.rooms[$scope.activeRoom].rateName = "Multiple Rates Selected";
			} else {
				$scope.reservationData.rooms[$scope.activeRoom].rateId = rates[0];
				$scope.reservationData.rooms[$scope.activeRoom].rateName = $scope.reservationData.rooms[0].stayDates[$scope.reservationData.arrivalDate].rate.name;
			}
			$scope.enhanceStay();
		}

		$scope.initRoomRates = function(isfromCalendar) {
			var fetchSuccess = function(data) {
				roomRates = data;
				init();
				if (isfromCalendar) {
					selectRoomAndRate();
				}
			}

			var params = {};

			params.from_date = $scope.reservationData.arrivalDate;
			params.to_date = $scope.reservationData.departureDate;
			params.company_id = $scope.reservationData.company.id;
			params.travel_agent_id = $scope.reservationData.travelAgent.id;
			$scope.invokeApi(RVReservationBaseSearchSrv.fetchAvailability, params, fetchSuccess);

			// redo the staydays array as there is a possibility that the reservation days have changed!
			$scope.reservationData.stayDays = [];
			for (var d = [], ms = new tzIndependentDate($scope.reservationData.arrivalDate) * 1, last = new tzIndependentDate($scope.reservationData.departureDate) * 1; ms <= last; ms += (24 * 3600 * 1000)) {
				$scope.reservationData.stayDays.push({
					date: dateFilter(new tzIndependentDate(ms), 'yyyy-MM-dd'),
					dayOfWeek: dateFilter(new tzIndependentDate(ms), 'EEE'),
					day: dateFilter(new tzIndependentDate(ms), 'dd')
				});
			}
		}

		var hasContractedRate = function(rates) {
			var hasRate = false;
			_.each(rates, function(rateId) {
				if ($scope.displayData.allRates[rateId].account_id != null) {
					hasRate = true;
				}
			});
			return hasRate;
		}

		$scope.setRates = function() {
			//CICO-5253 > Rate Types Reservartion
			//Get the rates for which rooms are available $scope.displayData.allRooms
			$scope.ratesMaster = [];
			$scope.displayData.availableRates = [];

			// if ($scope.preferredType == null || $scope.preferredType == '' || typeof $scope.preferredType == 'undefined') {
			$($scope.displayData.allRooms).each(function(i, d) {
				var room = $scope.roomAvailability[d.id];
				$(room.rates).each(function(i, rateId) {
					if (typeof $scope.ratesMaster[rateId] == 'undefined') {
						$scope.ratesMaster[rateId] = {
							rooms: [],
							rate: $scope.displayData.allRates[rateId]
						};
					}
					$scope.ratesMaster[rateId].rooms.push(room);
				})
			});

			$($scope.ratesMaster).each(function(i, d) {
				if (typeof d != 'undefined') {
					//Sort Rooms inside the rates so that they are in asc order of avg/day
					//TODO: Restructure the data
					if ($scope.stateCheck.preferredType == null || $scope.stateCheck.preferredType == '' || typeof $scope.stateCheck.preferredType == 'undefined') {
						d.rooms.sort(function(a, b) {
							if (a.total[d.rate.id].average < b.total[d.rate.id].average)
								return -1;
							if (a.total[d.rate.id].average > b.total[d.rate.id].average)
								return 1;
							return 0;
						});
						d.preferredType = d.rooms[0].id;
						$scope.displayData.availableRates.push(d);

					} else {
						//preferred room process
						// If a contracted rate, then got to show it anyway
						if (hasContractedRate([d.rate.id])) {
							$scope.displayData.availableRates.push(d);
							d.preferredType = d.rooms[0].id;
						} else if (_.where(d.rooms, {
								id: parseInt($scope.stateCheck.preferredType)
							}).length > 0) {
							d.preferredType = parseInt($scope.stateCheck.preferredType);
							d.rooms.sort(function(a, b) {
								if (a.total[d.rate.id].average < b.total[d.rate.id].average)
									return -1;
								if (a.total[d.rate.id].average > b.total[d.rate.id].average)
									return 1;
								return 0;
							});
							$scope.displayData.availableRates.push(d);
						}
					}
				}
			});

			//TODO:The Rate order within each Rate Type should be alphabetical
			$scope.displayData.availableRates.sort(function(a, b) {
				if (a.rate.name.toLowerCase() < b.rate.name.toLowerCase())
					return -1;
				if (a.rate.name.toLowerCase() > b.rate.name.toLowerCase())
					return 1;
				return 0;
			});

			/**
			 * A simple utility function to move an element from one position to next in an array
			 * @param  {Array} arr
			 * @param  {Integer} fromIndex
			 * @param  {Integer} toIndex
			 */
			function arraymove(arr, fromIndex, toIndex) {
				var element = arr[fromIndex]
				arr.splice(fromIndex, 1);
				arr.splice(toIndex, 0, element);
			}

			// CICO-7792: Put contracted / corporate rates on top
			// CICO-10455
			// Iterate from last till first in the array and put the element with account_id upfront

			if ($scope.displayData.availableRates && $scope.displayData.availableRates.length > 1) {
				var ratesCopy = angular.copy($scope.displayData.availableRates);
				for (i = ratesCopy.length; i > 0; i--) {
					var currentRate = ratesCopy[i - 1].rate;
					if (currentRate.account_id != null) {
						arraymove($scope.displayData.availableRates, i - 1, 0);
					}
				}
			}
		}

		var populateStayDates = function(rateId, roomId) {
			_.each($scope.reservationData.rooms[$scope.activeRoom].stayDates, function(details, date) {
				details.rate.id = rateId;
				details.rate.name = $scope.displayData.allRates[rateId].name;
				// CICO-6079
				var calculatedAmount = $scope.roomAvailability[roomId].ratedetails[date] && $scope.roomAvailability[roomId].ratedetails[date][rateId].rate ||
					$scope.roomAvailability[roomId].ratedetails[$scope.reservationData.arrivalDate][rateId].rate;
				calculatedAmount = parseFloat(calculatedAmount).toFixed(2);
				details.rateDetails = {
					actual_amount: calculatedAmount,
					modified_amount: calculatedAmount,
					is_discount_allowed: $scope.reservationData.ratesMeta[rateId].is_discount_allowed == null ? "false" : $scope.reservationData.ratesMeta[rateId].is_discount_allowed.toString(), // API returns true / false as a string ... Hence true in a string to maintain consistency
					is_suppressed: $scope.reservationData.ratesMeta[rateId].is_suppress_rate_on == null ? "false" : $scope.reservationData.ratesMeta[rateId].is_suppress_rate_on.toString()
				}
			});
		}

		var isRateSelected = function() {
			// Have to check if all the days have rates and enable the DONE button
			var allSelected = {
				allDays: true,
				oneDay: false
			};
			_.each($scope.reservationData.rooms[$scope.activeRoom].stayDates, function(staydateconfig, date) {
				if (staydateconfig.rate.id != null && staydateconfig.rate.id != "") {
					allSelected.oneDay = true;
				}
				if (allSelected.allDays && (date != $scope.reservationData.departureDate) && (staydateconfig.rate.id == null || staydateconfig.rate.id == "")) {
					allSelected.allDays = false;
				}
			});
			return allSelected;
		}

		/*
		 *	The below method is to advance to the enhancements page from
		 *	the room & rates screen in the STAY_DATES mode
		 */
		$scope.handleDaysBooking = function(event) {
			event.stopPropagation();
			if (!$scope.stateCheck.rateSelected.allDays) {
				//if the dates are not all set with rates
				return false;
			} else {
				// TODO : Handle multiple rates selected
				if ($scope.reservationUtils.isVaryingRates(0)) {
					$scope.reservationData.rooms[$scope.activeRoom].rateName = "Multiple Rates Selected"
				} else {
					$scope.reservationData.rooms[0].rateName = $scope.displayData.allRates[$scope.reservationData.rooms[$scope.activeRoom].stayDates[$scope.reservationData.arrivalDate].rate.id].name;
				}
				$scope.reservationData.rateDetails[$scope.activeRoom] = $scope.roomAvailability[$scope.reservationData.rooms[$scope.activeRoom].roomTypeId].ratedetails;
				$scope.computeTotalStayCost();
				$scope.enhanceStay();
			}
		}

		$scope.handleNoEdit = function(event, roomId, rateId) {
			event.stopPropagation();
			$scope.reservationData.rooms[$scope.activeRoom].rateName = $scope.displayData.allRates[rateId].name;
			$scope.reservationData.rateDetails[$scope.activeRoom] = $scope.roomAvailability[roomId].ratedetails;
			if (!$scope.stateCheck.stayDatesMode) {
				$scope.enhanceStay();
			}
		}

		$scope.enhanceStay = function() {
			// CICO-9429: Show Addon step only if its been set ON in admin
			var navigate = function() {
				if ($scope.reservationData.guest.id || $scope.reservationData.company.id || $scope.reservationData.travelAgent.id) {
					if ($rootScope.isAddonOn) {
						$state.go('rover.reservation.staycard.mainCard.addons', {
							"from_date": $scope.reservationData.arrivalDate,
							"to_date": $scope.reservationData.departureDate
						});
					} else {
						$state.go('rover.reservation.staycard.mainCard.summaryAndConfirm');
					}
				}
			}
			if ($rootScope.isAddonOn) {
				$state.go('rover.reservation.staycard.mainCard.addons', {
					"from_date": $scope.reservationData.arrivalDate,
					"to_date": $scope.reservationData.departureDate
				});
			} else {
				if (!$scope.reservationData.guest.id && !$scope.reservationData.company.id && !$scope.reservationData.travelAgent.id) {
					$scope.$emit('PROMPTCARD');
					$scope.$watch("reservationData.guest.id", navigate);
					$scope.$watch("reservationData.company.id", navigate);
					$scope.$watch("reservationData.travelAgent.id", navigate);
				} else {
					navigate();
				}
			}

		}

		var updateSupressedRatesFlag = function() {
			// Find if any of the selected rates is suppressed
			$scope.reservationData.rooms[$scope.activeRoom].isSuppressed = false;
			_.each($scope.reservationData.rooms[$scope.activeRoom].stayDates, function(d, i) {
				var currentRateSuppressed = ($scope.stateCheck.suppressedRates.indexOf(d.rate.id) > -1);
				if (typeof $scope.reservationData.rooms[$scope.activeRoom].isSuppressed == 'undefined') {
					$scope.reservationData.rooms[$scope.activeRoom].isSuppressed = currentRateSuppressed;
				} else {
					$scope.reservationData.rooms[$scope.activeRoom].isSuppressed = $scope.reservationData.rooms[$scope.activeRoom].isSuppressed || currentRateSuppressed;
				}
			})
		}

		$scope.handleBooking = function(roomId, rateId, event) {
			event.stopPropagation();
			/*	Using the populateStayDates method, the stayDates object for the active room are 
			 *	are updated with the rate and rateName information
			 */
			// CICO-9727: Reservations - Error thrown when user chooses SR rates for another room type
			// bypass rate selection from room type other than $scope.stateCheck.preferredType

			var currentRoom = $scope.reservationData.rooms[$scope.activeRoom];
			// Disable room type change if stay date mode is true
			if ($scope.stateCheck.preferredType > 0 && roomId !== $scope.stateCheck.preferredType && $scope.stateCheck.stayDatesMode) {
				return false;
			}
			if ($scope.stateCheck.stayDatesMode) {
				var activeDate = $scope.stateCheck.dateModeActiveDate;
				if (!$scope.stateCheck.rateSelected.oneDay) {
					// The first selected day must be taken as the preferredType
					// No more selection of rooms must be allowed here
					$scope.stateCheck.preferredType = parseInt(roomId);
					currentRoom.roomTypeId = roomId;
					currentRoom.rateId = [];
					currentRoom.rateId.push(rateId);
					currentRoom.stayDates[$scope.stateCheck.dateModeActiveDate].rate.id = rateId;
					currentRoom.roomTypeName = $scope.roomAvailability[roomId].name;
					$scope.reservationData.rateDetails[$scope.activeRoom] = $scope.roomAvailability[currentRoom.roomTypeId].ratedetails;
					$scope.filterRooms();
				}
				$scope.stateCheck.selectedStayDate.rate.id = rateId;
				currentRoom.stayDates[activeDate].rate.id = rateId;
				// CICO-6079

				var calculatedAmount = $scope.roomAvailability[roomId].ratedetails[activeDate] && $scope.roomAvailability[roomId].ratedetails[activeDate][rateId].rate ||
					$scope.roomAvailability[roomId].ratedetails[activeDate][rateId].rate;
				calculatedAmount = parseFloat(calculatedAmount).toFixed(2);
				currentRoom.stayDates[activeDate].rateDetails = {
					actual_amount: calculatedAmount,
					modified_amount: calculatedAmount,
					is_discount_allowed: $scope.reservationData.ratesMeta[rateId].is_discount_allowed == null ? "false" : $scope.reservationData.ratesMeta[rateId].is_discount_allowed.toString(), // API returns true / false as a string ... Hence true in a string to maintain consistency
					is_suppressed: $scope.reservationData.ratesMeta[rateId].is_suppress_rate_on == null ? "false" : $scope.reservationData.ratesMeta[rateId].is_suppress_rate_on.toString()
				}
				currentRoom.stayDates[activeDate].rate.id = rateId;

				if (!currentRoom.rateId) {
					currentRoom.rateId = []
				}
				currentRoom.rateId.push(rateId);
				// see if the done button has to be enabled
				// 
				updateSupressedRatesFlag();

				$scope.stateCheck.rateSelected.allDays = isRateSelected().allDays;
				$scope.stateCheck.rateSelected.oneDay = isRateSelected().oneDay;
			} else {
				populateStayDates(rateId, roomId);
				currentRoom.roomTypeId = roomId;
				currentRoom.roomTypeName = $scope.roomAvailability[roomId].name;
				currentRoom.rateId = rateId;
				currentRoom.isSuppressed = $scope.displayData.allRates[rateId].is_suppress_rate_on;
				currentRoom.rateName = $scope.displayData.allRates[rateId].name;
				$scope.reservationData.demographics.market = $scope.displayData.allRates[rateId].market_segment.id == null ? "" : $scope.displayData.allRates[rateId].market_segment.id;
				$scope.reservationData.demographics.source = $scope.displayData.allRates[rateId].source.id == null ? "" : $scope.displayData.allRates[rateId].source.id;
				currentRoom.rateAvg = $scope.roomAvailability[roomId].total[rateId].average;
				currentRoom.rateTotal = $scope.roomAvailability[roomId].total[rateId].total;

				//TODO: update the Tax Amount information
				$scope.reservationData.totalStayCost = $scope.roomAvailability[roomId].total[rateId].total;
				$scope.reservationData.totalTaxAmount = 0;

				//TODO : 7641 - Update the rateDetails array in the reservationData
				$scope.reservationData.rateDetails[$scope.activeRoom] = $scope.roomAvailability[roomId].ratedetails;
				$scope.checkOccupancyLimit();
				$scope.enhanceStay();
			}

			// check whether any one of the rooms rate has isSuppressed on and turn on flag
			var keepGoing = true;
			$scope.reservationData.isRoomRateSuppressed = false;
			angular.forEach($scope.reservationData.rooms, function(room, index) {
				if (keepGoing) {
					if (room.isSuppressed) {
						$scope.reservationData.isRoomRateSuppressed = true;
						keepGoing = false;
					}
				}
			});

			$scope.$emit("REFRESHACCORDIAN");
		}

		$scope.showAllRooms = function() {
			$scope.showLessRooms = false;
			$scope.refreshScroll();
			$scope.filterRooms();
		}


		$scope.setSelectedType = function(val) {
			$scope.selectedRoomType = $scope.selectedRoomType == val.id ? -1 : val.id;
			$scope.refreshScroll();
		}

		// Fix for CICO-9536
		// Expected Result: Only one single room type can be applied to a reservation.
		// However, the user should be able to change the room type for the first night on the Stay Dates screen,
		// while the reservation is not yet checked in. The control should be disabled for any subsequent nights.
		$scope.resetRates = function() {
			_.each($scope.reservationData.rooms[$scope.activeRoom].stayDates, function(stayDate, idx) {
				stayDate.rate.id = '';
				stayDate.rate.name = '';
			});
			$scope.stateCheck.rateSelected.allDays = false;
			// reset value, else rate selection will get bypassed 
			// check $scope.handleBooking method
			$scope.stateCheck.rateSelected.oneDay = false;
		}

		$scope.filterRooms = function() {
			if ($scope.stateCheck.preferredType == null || $scope.stateCheck.preferredType == '' || typeof $scope.stateCheck.preferredType == 'undefined') {
				if ($scope.showLessRooms && $scope.displayData.allRooms.length > 1) {
					$scope.displayData.roomTypes = $scope.displayData.allRooms.first();
					var level = $scope.displayData.allRooms.first()[0].level;
					var firstId = $scope.displayData.allRooms.first()[0].id;
					if (level == 1 || level == 2) {
						//Append rooms from the next level
						//Get the candidate rooms of the room to be appended
						var targetlevel = level + 1;
						var candidateRooms = $($scope.roomAvailability).filter(function() {
							return this.level == targetlevel && this.availability == true && this.rates.length > 0;
						});
						//Check if candidate rooms are available IFF not in stayDatesMode
						if (candidateRooms.length == 0) {
							//try for candidate rooms in the same level						
							candidateRooms = $($scope.roomAvailability).filter(function() {
								return this.level == level && this.id != firstId && this.availability == true && this.rates.length > 0 && parseInt(this.averagePerNight) >= parseInt($scope.roomAvailability[firstId].averagePerNight);
							});
						}
						//Sort the candidate rooms to get the one with the least average rate
						candidateRooms.sort(function(a, b) {
							if (parseInt(a.averagePerNight) < parseInt(b.averagePerNight))
								return -1;
							if (parseInt(a.averagePerNight) > parseInt(b.averagePerNight))
								return 1;
							return 0;
						});
						//append the appropriate room to the list to be displayed
						if (candidateRooms.length > 0) {
							var selectedRoom = $($scope.displayData.allRooms).filter(function() {
								return this.id == candidateRooms[0].id;
							});
							if (selectedRoom.length > 0) {
								$scope.displayData.roomTypes.push(selectedRoom[0]);
							}
						}

					}
				} else {
					$scope.displayData.roomTypes = $scope.displayData.allRooms;
				}
				$scope.selectedRoomType = -1;
			} else {
				$scope.reservationData.rooms[$scope.activeRoom].roomTypeId = $scope.stateCheck.preferredType;
				// If a room type of category Level1 is selected, show this room type plus the lowest priced room type of the level 2 category.
				// If a room type of category Level2 is selected, show this room type plus the lowest priced room type of the level 3 category.
				// If a room type of category Level3 is selected, only show the selected room type.
				$scope.displayData.roomTypes = $($scope.displayData.allRooms).filter(function() {
					return this.id == $scope.stateCheck.preferredType || hasContractedRate($scope.roomAvailability[this.id].rates);
				});
				if ($scope.displayData.roomTypes.length > 0 && !$scope.stateCheck.rateSelected.oneDay && $scope.reservationData.status != "CHECKEDIN" && $scope.reservationData.status != "CHECKING_OUT") {
					var level = $scope.roomAvailability[$scope.displayData.roomTypes[0].id].level;
					if (level == 1 || level == 2) {
						//Append rooms from the next level
						//Get the candidate rooms of the room to be appended
						var targetlevel = level + 1;
						var candidateRooms = $($scope.roomAvailability).filter(function() {
							return this.level == targetlevel && this.availability == true && this.rates.length > 0 && !hasContractedRate($scope.roomAvailability[this.id].rates);
						});

						//Check if candidate rooms are available
						if (candidateRooms.length == 0) {
							//try for candidate rooms in the same level						
							candidateRooms = $($scope.roomAvailability).filter(function() {
								return this.level == level && this.id != $scope.stateCheck.preferredType && this.availability == true && this.rates.length > 0 && parseInt(this.averagePerNight) >= parseInt($scope.roomAvailability[$scope.stateCheck.preferredType].averagePerNight) && !hasContractedRate($scope.roomAvailability[this.id].rates);
							});
						}
						//Sort the candidate rooms to get the one with the least average rate
						candidateRooms.sort(function(a, b) {
							if (a.averagePerNight < b.averagePerNight)
								return -1;
							if (a.averagePerNight > b.averagePerNight)
								return 1;
							return 0;
						});
						//append the appropriate room to the list to be displayed
						if (candidateRooms.length > 0) {
							var selectedRoom = $($scope.displayData.allRooms).filter(function() {
								return this.id == candidateRooms[0].id;
							});
							if (selectedRoom.length > 0) {
								$scope.displayData.roomTypes.push(selectedRoom[0]);
							}
						}
					}
				}
				$scope.selectedRoomType = $scope.stateCheck.preferredType;
			}

			$scope.setRates();
			$scope.refreshScroll();
		}

		$scope.restrictionsMapping = {
			1: 'CLOSED',
			2: 'CLOSED_ARRIVAL',
			3: 'CLOSED_DEPARTURE',
			4: 'MIN_STAY_LENGTH',
			5: 'MAX_STAY_LENGTH',
			6: 'MIN_STAY_THROUGH',
			7: 'MIN_ADV_BOOKING',
			8: 'MAX_ADV_BOOKING',
			9: 'DEPOSIT_REQUESTED',
			10: 'CANCEL_PENALTIES',
			11: 'LEVELS'
		}

		// This method does a restriction check on the rates!
		var restrictionCheck = function(roomsIn) {
			var rooms = roomsIn;
			_.each(rooms, function(room, idx) {
				var roomId = room.id;
				if (room.rates.length > 0) {
					_.each(room.rates, function(rateId) {
						/*("now processing", {
							roomId: roomId,
							rateId: rateId
						})*/
						var validRate = true;
						_.each(room.ratedetails, function(today, key) {
							var currDate = key;
							//Step 1 : Check if the rates are configured for all the days of stay
							if (typeof today[rateId] == 'undefined') {
								// ("The rate " + rateId + " is not available for " + roomId + " on " + key);
								// TODO: Uncomment the following code block and comment the line after the block to show rates configured for just that day in the room and rates section under the staydates mode
								/*if ($scope.stateCheck.stayDatesMode) {
									if (currDate == $scope.stateCheck.dateModeActiveDate) {
										validRate = false;
									}
								} else {
									validRate = false;
								}*/
								validRate = false;
							} else {
								var rateConfiguration = today[rateId].rateBreakUp;
								var numAdults = parseInt($scope.reservationData.rooms[$scope.activeRoom].numAdults);
								var numChildren = parseInt($scope.reservationData.rooms[$scope.activeRoom].numChildren);
								// In case of stayDatesMode the occupancy has to be considered only for the single day
								if ($scope.stateCheck.stayDatesMode) {
									numAdults = parseInt($scope.reservationData.rooms[$scope.activeRoom].stayDates[$scope.stateCheck.dateModeActiveDate].guests.adults);
									numChildren = parseInt($scope.reservationData.rooms[$scope.activeRoom].stayDates[$scope.stateCheck.dateModeActiveDate].guests.children);
								}

								var stayLength = parseInt($scope.reservationData.numNights);
								// The below variable stores the days till the arrival date
								var daysTillArrival = Math.round((new tzIndependentDate($scope.reservationData.arrivalDate) - new tzIndependentDate($rootScope.businessDate)) / (1000 * 60 * 60 * 24));

								//Step 2 : Check if the rates are configured for the selected occupancy
								if (rateConfiguration.single == null && rateConfiguration.double == null && rateConfiguration.extra_adult == null && rateConfiguration.child == null) {
									// ("This rate has to be removed as no rates are confugured for " + key);
									validRate = false;
								} else {
									// Step 2: Check for the other constraints here
									// Step 2 A : Children
									if (numChildren > 0 && rateConfiguration.child == null) {
										// ("This rate has to be removed as no children are configured for " + key);
										validRate = false;
									} else if (numAdults == 1 && rateConfiguration.single == null) { // Step 2 B: one adult - single needs to be configured
										// ("This rate has to be removed as no single are configured for " + key);
										validRate = false;
									} else if (numAdults >= 2 && rateConfiguration.double == null) { // Step 2 C: more than one adult - double needs to be configured
										// ("This rate has to be removed as no double are configured for " + key);
										validRate = false;
									} else if (numAdults > 2 && rateConfiguration.extra_adult == null) { // Step 2 D: more than two adults - need extra_adult to be configured
										// ("This rate has to be removed as no adults are configured for " + key);
										validRate = false;
									}
								}
								//[TODO]Step 3 : Check if the rates are configured for the selected restrictions
								if (rateConfiguration.restrictions.length > 0) {
									_.each(rateConfiguration.restrictions, function(restriction) {
										switch ($scope.restrictionsMapping[restriction.restriction_type_id]) {
											case 'CLOSED': // 1 CLOSED
												// Cannot book a closed room
												validRate = false;
												break;
											case 'CLOSED_ARRIVAL': // 2 CLOSED_ARRIVAL
												if (new tzIndependentDate(currDate) - new tzIndependentDate($scope.reservationData.arrivalDate) == 0) {
													validRate = false;
												}
												break;
											case 'CLOSED_DEPARTURE': // 3 CLOSED_DEPARTURE
												if (new tzIndependentDate(currDate) - new tzIndependentDate($scope.reservationData.departureDate) == 0) {
													validRate = false;
												}
												break;
											case 'MIN_STAY_LENGTH': // 4 MIN_STAY_LENGTH
												if (restriction.days != null && stayLength < restriction.days) {
													validRate = false;
												}
												break;
											case 'MAX_STAY_LENGTH': // 5 MAX_STAY_LENGTH
												if (restriction.days != null && stayLength > restriction.days) {
													validRate = false;
												}
												break;
											case 'MIN_STAY_THROUGH': // 6 MIN_STAY_THROUGH
												if (Math.round((new tzIndependentDate($scope.reservationData.departureDate) - new tzIndependentDate(currDate)) / (1000 * 60 * 60 * 24)) < restriction.days) {
													validRate = false;
												}
												break;
											case 'MIN_ADV_BOOKING': // 7 MIN_ADV_BOOKING
												if (restriction.days != null && daysTillArrival < restriction.days) {
													validRate = false;
												}
												break;
											case 'MAX_ADV_BOOKING': // 8 MAX_ADV_BOOKING
												if (restriction.days != null && daysTillArrival > restriction.days) {
													validRate = false;
												}
												break;
											case 'DEPOSIT_REQUESTED': // 9 DEPOSIT_REQUESTED
												break;
											case 'CANCEL_PENALTIES': // 10 CANCEL_PENALTIES
												break;
											case 'LEVELS': // 11 LEVELS
												break;

										}
									})

								}
							}

						});
						//Remove rate from the room's list here if flag failed
						// CICO-7792 : To keep corporate rates even if not applicable on those days
						if ($scope.displayData.allRates[rateId].account_id) {
							if (!validRate) {
								if (typeof $scope.stateCheck.restrictedContractedRates[roomId] == "undefined") {
									$scope.stateCheck.restrictedContractedRates[roomId] = [];
								}
								$scope.stateCheck.restrictedContractedRates[roomId].push(rateId);
							}
						} else if (!validRate) {
							var existingRates = roomsIn[roomId].rates;
							var afterRemoval = _.without(existingRates, rateId);
							roomsIn[roomId].rates = afterRemoval;
						}
					});
				}
			});
			return roomsIn;
		}

		var getTaxPercent = function(taxes) {
			var taxTotalPercent = 0.0;
			var taxTotalDollars = 0.0;
			_.each(taxes, function(tax) {
				var taxDetails = _.where($scope.otherData.taxesMeta, {
					id: parseInt(tax.charge_code_id)
				});
				if (taxDetails.length == 0) {
					//Error condition! Tax code in results but not in meta data
					console.log("Error on tax meta data");
				} else {
					var taxData = taxDetails[0];
					// Need not consider perstay here
					var taxAmount = taxData.amount;
					if (taxData.amount_sign != "+") {
						taxData.amount = parseFloat(taxData.amount * -1.0);
					}
					if (taxData.post_type == 'NIGHT') {
						if (taxData.amount_symbol == '%') {
							taxTotalPercent = parseFloat(taxTotalPercent) + parseFloat(taxData.amount);
						} else {
							taxTotalDollars = parseFloat(taxData.amount) + parseFloat(taxTotalDollars);
						}
					}
				}
			})
			var taxDetails = "";
			if (taxTotalPercent > 0.0) {
				taxDetails += taxTotalPercent + "%"
			}
			if (taxTotalDollars > 0.0) {
				if (taxDetails) {
					taxDetails += "+ $" + taxTotalDollars;
				} else {
					taxDetails += "$" + taxTotalDollars;
				}
			}
			return taxDetails ? taxDetails : "0%";
		}

		$scope.getAvailability = function(roomRates) {
			var rooms = [];
			var currOccupancy = parseInt($scope.reservationData.rooms[$scope.activeRoom].numAdults) + parseInt($scope.reservationData.rooms[$scope.activeRoom].numChildren);
			var roomDetails = [];
			$(roomRates.room_types).each(function(i, d) {
				roomDetails[d.id] = d;
			});
			// Parse through all room-rate combinations.
			$(roomRates.results).each(function(i, d) {
				/*  --Initializing the displayData.dates array for the rows in the day wise rate table
				 *	Need NOT show the departure day in the table. [It is NOT included in any of the computations]
				 *	Hence check if the day is a departure day before adding it to the array
				 *	TODO: Have added a check to handle zero nights > Need to check with product team if zero nights is an accepted scenario.
				 *	If so, will have to change computation in other places as well to handle zero nights.
				 */
				if (d.date == $scope.reservationData.arrivalDate || d.date != $scope.reservationData.departureDate) {
					$scope.displayData.dates.push({
						str: d.date,
						obj: new tzIndependentDate(d.date)
					});

					var for_date = d.date;
					//step1: check for room availability in the date range
					$(d.room_types).each(function(i, d) {
						if (typeof rooms[d.id] == "undefined") {
							rooms[d.id] = {
								id: d.id,
								name: roomDetails[d.id].name,
								level: roomDetails[d.id].level,
								availability: true,
								rates: [],
								ratedetails: {},
								total: [],
								defaultRate: 0,
								averagePerNight: 0,
								description: roomDetails[d.id].description
							};
						}
						//CICO-6619 || currOccupancy > roomDetails[d.id].max_occupancy
						if (d.availability < 1) {
							rooms[d.id].availability = false;
						}
					});

					//step2: extract rooms with rate information
					$(d.rates).each(function(i, d) {
						var rate_id = d.id;

						var taxes = d.taxes;

						$(d.room_rates).each(function(i, d) {
							if ($(rooms[d.room_type_id].rates).index(rate_id) < 0) {
								rooms[d.room_type_id].rates.push(rate_id);
							}
							if (typeof rooms[d.room_type_id].ratedetails[for_date] == 'undefined') {
								rooms[d.room_type_id].ratedetails[for_date] = [];
							}
							rooms[d.room_type_id].ratedetails[for_date][rate_id] = {
								rate_id: rate_id,
								rate: $scope.calculateRate(d, for_date),
								taxes: taxes,
								rateBreakUp: d,
								day: new tzIndependentDate(for_date)
							};

							//calculate tax for the current day
							if (taxes && taxes.length > 0) { // Need to calculate taxes IFF there are taxes associated with the rate
								var taxApplied = $scope.calculateTax(for_date, rooms[d.room_type_id].ratedetails[for_date][rate_id].rate, taxes, $scope.activeRoom);
								rooms[d.room_type_id].ratedetails[for_date][rate_id].tax = parseFloat(taxApplied.inclusive) + parseFloat(taxApplied.exclusive);
								rooms[d.room_type_id].ratedetails[for_date][rate_id].taxExclusive = parseFloat(taxApplied.exclusive);
							} else {
								rooms[d.room_type_id].ratedetails[for_date][rate_id].tax = 0;
								rooms[d.room_type_id].ratedetails[for_date][rate_id].taxExclusive = 0;
							}

							rooms[d.room_type_id].ratedetails[for_date][rate_id].total = parseFloat(rooms[d.room_type_id].ratedetails[for_date][rate_id].taxExclusive) + parseFloat(rooms[d.room_type_id].ratedetails[for_date][rate_id].rate);

							//TODO : compute total
							if (typeof rooms[d.room_type_id].total[rate_id] == 'undefined') {
								rooms[d.room_type_id].total[rate_id] = {
									total: 0,
									totalRate: 0,
									average: 0,
									percent: "0%"
								}
							}

							//total of all rates for ADR computation
							rooms[d.room_type_id].total[rate_id].totalRate += parseFloat(rooms[d.room_type_id].ratedetails[for_date][rate_id].rate);
							//total of all rates including taxes.
							rooms[d.room_type_id].total[rate_id].total += rooms[d.room_type_id].ratedetails[for_date][rate_id].total;
							//compute the tax header for the table
							if (taxes && taxes.length > 0) {
								rooms[d.room_type_id].total[rate_id].percent = getTaxPercent(taxes);
							}
							var stayLength = $scope.reservationData.numNights;
							// Handle single days for calculating rates
							if (stayLength == 0) stayLength = 1;
							rooms[d.room_type_id].total[rate_id].average = parseFloat(rooms[d.room_type_id].total[rate_id].totalRate / stayLength).toFixed(2);
						})
					})
				}
			});

			rooms = restrictionCheck(rooms);
			//$scope.displayData.allRates[118].account_id
			_.each(rooms, function(value) {
				// step3: total and average calculation
				// var value = rooms[id];

				//step4 : sort the rates within each room
				value.rates.sort(function(a, b) {
					var averageA = parseFloat(value.total[a].average);
					var averageB = parseFloat(value.total[b].average);
					if (averageA < averageB)
						return -1;
					if (averageA > averageB)
						return 1;
					return 0;
				});

				//Step 4a [CICO-7792] Bring the corporate rates to the top
				/*  https://stayntouch.atlassian.net/browse/CICO-7792
				 *	If both a Travel Agent and a Company are linked to the reservation,
				 *	both with active, valid contracts,
				 *	display the Company first, then the Travel Agent.
				 */
				value.rates.sort(function(a, b) {
					if ($scope.displayData.allRates[a].account_id != null && $scope.displayData.allRates[b].account_id != null) {
						if (parseInt($scope.displayData.allRates[a].account_id) == parseInt($scope.reservationDetails.companyCard.id)) {
							return -1;
						}
						if (parseInt($scope.displayData.allRates[b].account_id) == parseInt($scope.reservationDetails.companyCard.id)) {
							return 1;
						}
					}
					if ($scope.displayData.allRates[a].account_id != null)
						return -1;
					if ($scope.displayData.allRates[b].account_id != null)
						return 1;
					return 0;
				});

				//TODO: Caluculate the default ID
				if (value.rates.length > 0) {
					value.defaultRate = value.rates[0];
				} else {
					value.defaultRate = -1;
				}

				//step5: calculate the rate differences between the rooms
				//Put the average rate in the room object
				if (typeof value.total[value.defaultRate] != 'undefined') {
					value.averagePerNight = value.total[value.defaultRate].average;
					value.isSuppressed = $scope.displayData.allRates[value.defaultRate].is_suppress_rate_on;
				}
			});

			return rooms;
		}

		$scope.refreshScroll = function() {
			$timeout(function() {
				$scope.refreshScroller('room_types');
			}, 100);
		}

		$scope.calculateRate = function(rateTable, forDate) {
			// Hi Shiju, 
			// The rate amount calculation works as follows: 
			// 1.       1 Adult, 0 Children: Single
			// 2.       2 Adults, 0 Children: Double
			// 3.       3 Adults, 0 Children: Double + Extra Adult
			// 4.       4 Adults, 0 Children: Double + 2x Extra Adult
			// 5.       1 Adult, 1 Child: Single + Child Rate
			// 6.       1 Adult, 2 Children: Single + 2x Child Rate
			// 7.       2 Adults, 2 Children: Double + 2x Child Rate
			// 8.       3 Adults, 3 Children: Double + Extra Adult + 3x Child Rate
			// And for forth….
			// Can we set the ADR & Total Stay calculation already now, so we can make sure it works correctly. When we add the tax, we just need to add in the extra amount. For now just add 0.00 for the tax value.
			// Thanks,
			// Nicki

			var adults = parseInt($scope.reservationData.rooms[$scope.activeRoom].stayDates[forDate].guests.adults);
			var children = parseInt($scope.reservationData.rooms[$scope.activeRoom].stayDates[forDate].guests.children);

			var baseRoomRate = adults >= 2 ? rateTable.double : rateTable.single;
			var extraAdults = adults >= 2 ? adults - 2 : 0;

			return baseRoomRate + (extraAdults * rateTable.extra_adult) + (children * rateTable.child);
		}

		$scope.watchCount = 0;

		$scope.$watch('reservationData.rooms[0].numAdults', function() {
			if ($scope.watchCount > 1) {
				init();
			} else {
				$scope.watchCount++;
			}
		});
		$scope.$watch('reservationData.rooms[0].numChildren', function() {
			if ($scope.watchCount > 1) {
				init();
			} else {
				$scope.watchCount++;
			}
		});

		$scope.selectRate = function(selectedRate) {
			$scope.stateCheck.rateFilterText = selectedRate.rate.name;
			$scope.filterRates();
			$scope.rateFiltered = true;
			$scope.refreshScroll();

		}

		$scope.hideResults = function() {
			$timeout(function() {
				$scope.isRateFilterActive = false;
			}, 300);
		}
		$scope.filterRates = function() {
			$scope.rateFiltered = false;
			if ($scope.stateCheck.rateFilterText.length > 0) {
				var re = new RegExp($scope.stateCheck.rateFilterText, "gi");
				$scope.filteredRates = $($scope.displayData.availableRates).filter(function() {
					return this.rate.name.match(re);
				})
				if($scope.filteredRates.length){
					// CICO-11119
					$scope.isRateFilterActive = true;	
				}				
			} else {
				$scope.filteredRates = [];
			}
			$scope.refreshScroll();
		}

		$scope.$watch('activeCriteria', function() {
			$scope.refreshScroll();
			$scope.stateCheck.rateFilterText = "";
			$scope.filterRates();
		});

		$scope.highlight = function(text, search) {
			if (!search) {
				return text;
			}
			return text.replace(new RegExp(search, 'gi'), '<span class="highlight">$&</span>');
		};

		$scope.to_trusted = function(html_code) {
			return $sce.trustAsHtml(html_code);
		}


		// 	CICO-7792 BEGIN
		$scope.$on("cardChanged", function(event, cardIds) {

			$scope.reservationData.company.id = cardIds.companyCard;
			$scope.reservationData.travelAgent.id = cardIds.travelAgent;

			$scope.initRoomRates();
			// Call the availability API and rerun the init method


		});
		// 	CICO-7792 END

		$scope.$on('switchToStayDatesCalendar', function() {
			$scope.stateCheck.activeMode = $scope.stateCheck.activeMode == "ROOM_RATE" ? "CALENDAR" : "ROOM_RATE";
			$("#rooms-and-rates-header .data-off span").toggleClass("value switch-icon");
		});

		$scope.toggleCalendar = function() {
			$scope.stateCheck.activeMode = $scope.stateCheck.activeMode == "ROOM_RATE" ? "CALENDAR" : "ROOM_RATE";
			$scope.heading = $scope.stateCheck.activeMode == "ROOM_RATE" ? "Rooms & Rates" : " Change Stay Dates";
			$scope.setHeadingTitle($scope.heading);
			$("#rooms-and-rates-header .data-off span").toggleClass("value switch-icon");
		}

		$scope.showStayDateDetails = function(selectedDate) {
			// by pass departure stay date from stay dates manipulation
			if (selectedDate == $scope.reservationData.departureDate) {
				return false;
			}
			$scope.stateCheck.dateModeActiveDate = selectedDate;
			$scope.stateCheck.selectedStayDate = $scope.reservationData.rooms[$scope.activeRoom].stayDates[selectedDate];
		}

		$scope.toggleEditGuestOptions = function() {
			$scope.stateCheck.guestOptionsIsEditable = !$scope.stateCheck.guestOptionsIsEditable;
		}

		/**
		 *	The below method toggles the staydates view.
		 *	Also, if the user is coming in this view for the first time, the first date is auto-selected
		 */
		$scope.toggleStayDaysMode = function() {
			$scope.stateCheck.stayDatesMode = !$scope.stateCheck.stayDatesMode;
			init();
			// see if the done button has to be enabled
			if ($scope.stateCheck.stayDatesMode) {
				$scope.stateCheck.rateSelected.allDays = isRateSelected().allDays;
				$scope.stateCheck.rateSelected.oneDay = isRateSelected().oneDay;
				//Adjust to the height of the stay dates container
				$scope.containerHeight = $scope.containerHeight - 70;
			} else {
				//Adjust to the height of the stay dates container
				$scope.containerHeight = $scope.containerHeight + 70;
			}
			$scope.refreshScroll();
			$timeout(function() {
				$scope.refreshScroller("stayDates");
			}, 150);

		}

		$scope.updateDayOccupancy = function(occupants) {
			$scope.reservationData.rooms[$scope.activeRoom].stayDates[$scope.stateCheck.dateModeActiveDate].guests[occupants] = parseInt($scope.stateCheck.selectedStayDate.guests[occupants]);
			/**
			 * CICO-8504
			 * In case of multiple rates selected, the side bar and the reservation summary need to showcase the first date's occupancy!
			 *
			 */
			if ($scope.reservationData.arrivalDate == $scope.stateCheck.dateModeActiveDate) {
				var occupancy = $scope.reservationData.rooms[$scope.activeRoom].stayDates[$scope.stateCheck.dateModeActiveDate].guests;
				$scope.reservationData.rooms[$scope.activeRoom].numAdults = occupancy.adults;
				$scope.reservationData.rooms[$scope.activeRoom].numChildren = occupancy.children;
				$scope.reservationData.rooms[$scope.activeRoom].numInfants = occupancy.infants;
			}

			if (!$scope.checkOccupancyLimit($scope.stateCheck.dateModeActiveDate)) {
				$scope.preferredType = "";
				// TODO : Reset other stuff as well
				$scope.stateCheck.rateSelected.oneDay = false;
				$scope.stateCheck.rateSelected.allDays = false;
				_.each($scope.reservationData.rooms[$scope.activeRoom].stayDates, function(stayDate) {
					stayDate.rate = {
						id: ""
					}
				});
			}
			init();
		}

		init(true);
	}
]);