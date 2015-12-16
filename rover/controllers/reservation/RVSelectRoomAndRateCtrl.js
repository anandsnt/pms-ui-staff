sntRover.controller('RVSelectRoomAndRateCtrl', [
	'$rootScope', '$scope', 'sortOrder', 'areReservationAddonsAvailable', '$stateParams', 'rates', 'ratesMeta', '$timeout', '$state',
	function($rootScope, $scope, sortOrder, areReservationAddonsAvailable, $stateParams, rates, ratesMeta, $timeout, $state) {


		$scope.stateCheck = {
			baseInfo: rates,
			activeMode: $stateParams.view && $stateParams.view === "CALENDAR" ? "CALENDAR" : "ROOM_RATE",
			calendarState: {
				showOnlyAvailableRooms: true,
				searchWithRestrictions: true,
				calendarType: "BEST_AVAILABLE"
			},
			roomDetails: {},
			preferredType: "",
			lookUp: {}
		};

		$scope.display = {
			roomFirstGrid: [],
			rateFirstGrid: []
		};

		$scope.availabilityTables = {};

		// ****************** PRIVATE *********************** //
		// 
		// 
		// 	
		// 
		// 
		// ****************** PRIVATE *********************** //

		var getTabRoomDetails = function(roomIndex) {
				var currentRoomTypeId = parseInt($scope.reservationData.tabs[roomIndex].roomTypeId, 10) || "",
					firstIndex = _.indexOf($scope.reservationData.rooms, _.findWhere($scope.reservationData.rooms, {
						roomTypeId: currentRoomTypeId
					})),
					lastIndex = _.lastIndexOf($scope.reservationData.rooms, _.last(_.where($scope.reservationData.rooms, {
						roomTypeId: currentRoomTypeId
					})));

				return {
					roomTypeId: currentRoomTypeId,
					firstIndex: firstIndex,
					lastIndex: lastIndex
				};
			},
			getCurrentRoomDetails = function() {
				return getTabRoomDetails($scope.activeRoom);
			},
			groupByRoomTypes = function(args) {
				// Populate a Room First Grid Here
				var roomTypes = {};
				// for every rate
				_.each($scope.stateCheck.baseInfo, function(rate) {
					//for every room type
					var currentRate = rate.id;
					_.each(rate.room_types, function(roomType) {
						var currentRoomType = roomType.id;
						if (!roomTypes[roomType.id]) {
							roomTypes[currentRoomType] = {
								id: currentRoomType,
								name: currentRoomType,
								rates: {}
							};
						}

						roomTypes[currentRoomType].rates[currentRate] = {
							name: currentRate,
							id: currentRate,
							adr: 0.0,
							totalAmount: 0.0,
							isSuppressed: false,
							isCorporate: false,
							dates: {}
						}

						//for every day
						_.each(roomType.dates, function(date, index) {
							if (index < roomType.dates.length - 1) {
								var currentDay = date.date;
								roomTypes[currentRoomType].rates[currentRate].totalAmount += date.amount;

								roomTypes[currentRoomType].rates[currentRate].dates[currentDay] = {
									obj: new tzIndependentDate(currentDay),
									availability: date.availability,
									amount: date.amount
								}
							}

						});
						roomTypes[currentRoomType].rates[currentRate].adr = roomTypes[currentRoomType].rates[currentRate].totalAmount / ($scope.reservationData.numNights || 0);
					});
				});

				// TODO: Sorting

				// TODO: Put the default rate up on top
				// 
				// For now, put the first rate on top

				_.each(roomTypes, function(roomType) {
					if (roomType.rates) {
						_.each(roomType.rates, function(rate, id) {
							if (!roomType.defaultRate) {
								roomType.defaultRate = rate;
							}
						});
					}
				});

				$scope.stateCheck.lookUp = roomTypes;

				$scope.display.roomFirstGrid = [];

				_.each(roomTypes, function(roomType) {
					$scope.display.roomFirstGrid.push(roomType);
				});

			},
			groupByRates = function() {

			},
			enhanceStay = function() {

				// CICO-9429: Show Addon step only if its been set ON in admin
				var navigate = function() {
					if ($scope.reservationData.guest.id || $scope.reservationData.company.id || $scope.reservationData.travelAgent.id || $scope.reservationData.group.id) {
						if ($rootScope.isAddonOn && areReservationAddonsAvailable) {
							$state.go('rover.reservation.staycard.mainCard.addons', {
								"from_date": $scope.reservationData.arrivalDate,
								"to_date": $scope.reservationData.departureDate
							});
						} else {
							$scope.computeTotalStayCost();
							$state.go('rover.reservation.staycard.mainCard.summaryAndConfirm');
						}
					}
				}
				if ($rootScope.isAddonOn && areReservationAddonsAvailable) {
					//CICO-16874
					$state.go('rover.reservation.staycard.mainCard.addons', {
						"from_date": $scope.reservationData.arrivalDate,
						"to_date": $scope.reservationData.departureDate
					});
				} else {
					var allRatesSelected = _.reduce(_.pluck($scope.reservationData.rooms, 'rateId'), function(a, b) {
						return !!a && !!b
					});
					if (allRatesSelected) {
						if (!$scope.reservationData.guest.id && !$scope.reservationData.company.id && !$scope.reservationData.travelAgent.id && !$scope.reservationData.group.id) {
							$scope.$emit('PROMPTCARD');
							$scope.$watch("reservationData.guest.id", navigate);
							$scope.$watch("reservationData.company.id", navigate);
							$scope.$watch("reservationData.travelAgent.id", navigate);
						} else {
							navigate();
						}
					} else {
						var roomIndexWithoutRate = _.findIndex($scope.reservationData.rooms, {
							rateId: ""
						});
						var tabIndexWithoutRate = _.findIndex($scope.reservationData.tabs, {
							roomTypeId: $scope.reservationData.rooms[roomIndexWithoutRate].roomTypeId
						});
						$scope.changeActiveRoomType(tabIndexWithoutRate || 0);
					}

				}

			},
			navigateOut = function() {
				if ($scope.viewState.identifier !== "REINSTATE" &&
					($stateParams.fromState === "rover.reservation.staycard.reservationcard.reservationdetails" || $stateParams.fromState === "STAY_CARD")) {
					$scope.saveAndGotoStayCard();
				} else {
					enhanceStay();
				}
			},
			initialize = function() {
				$scope.activeRoom = $scope.viewState.currentTab;
				$scope.reservationData.ratesMeta = ratesMeta;
				$scope.stateCheck.roomDetails = getCurrentRoomDetails();
				// activate room type default view based on reservation settings
				if ($scope.otherData.defaultRateDisplayName === 'Recommended') {
					$scope.activeCriteria = "RECOMMENDED";
				} else if ($scope.otherData.defaultRateDisplayName === 'By Rate') {
					$scope.activeCriteria = "RATE";
					groupByRates();
				} else {
					// By default RoomType
					$scope.activeCriteria = "ROOM_TYPE";
					groupByRoomTypes();
				}
				// preferredType
				$scope.stateCheck.preferredType = $scope.reservationData.tabs[$scope.activeRoom].roomTypeId;

				console.log(rates);
			};

		// ****************** PUBLIC *********************** //
		// 
		// 
		// 
		// 
		// 
		// ****************** PUBLIC *********************** //

		// 

		var populateStayDates = function(rateId, roomId, roomIndex) {
			_.each($scope.reservationData.rooms[roomIndex].stayDates, function(details, date) {
				details.rate.id = rateId;
				var dayInfo = $scope.stateCheck.lookUp[roomId].rates[rateId].dates[date],
					calculatedAmount = dayInfo && dayInfo.amount ||
					$scope.stateCheck.lookUp[roomId].rates[rateId].dates[$scope.reservationData.arrivalDate].amount;
				calculatedAmount = Number(parseFloat(calculatedAmount).toFixed(2));
				details.rateDetails = {
					actual_amount: calculatedAmount,
					modified_amount: calculatedAmount,
					// is_discount_allowed: $scope.reservationData.ratesMeta[rateId].is_discount_allowed === null ? "false" : $scope.reservationData.ratesMeta[rateId].is_discount_allowed.toString(), // API returns true / false as a string ... Hence true in a string to maintain consistency
					// is_suppressed: $scope.reservationData.ratesMeta[rateId].is_suppress_rate_on === null ? "false" : $scope.reservationData.ratesMeta[rateId].is_suppress_rate_on.toString()
				}
			});
		};

		$scope.refreshScroll = function() {
			$timeout(function() {
				$scope.refreshScroller('room_types');
			}, 100);
		};

		$scope.handleBooking = function(roomId, rateId, event, flag) {

			if (!!event) {
				event.stopPropagation();
			}

			if ($scope.stateCheck.stayDatesMode) {
				//TODO: Handle StayDatesMode
			} else {
				var i,
					roomInfo = $scope.stateCheck.lookUp[roomId],
					rateInfo = roomInfo.rates[rateId];
				if (!$scope.reservationData.tabs[$scope.activeRoom].roomTypeId || parseInt($scope.reservationData.tabs[$scope.activeRoom].roomTypeId) !== parseInt(roomId)) {
					$scope.reservationData.tabs[$scope.activeRoom].roomTypeId = parseInt(roomId);
				}
				for (i = $scope.stateCheck.roomDetails.firstIndex; i <= $scope.stateCheck.roomDetails.lastIndex; i++) {

					_.extend($scope.reservationData.rooms[i], {
						roomTypeId: parseInt(roomId),
						roomTypeName: roomInfo.name,
						rateId: rateId,
						isSuppressed: rateInfo.isSuppressed,
						rateName: rateInfo.name,
						rateAvg: rateInfo.adr,
						rateTotal: rateInfo.totalAmount
					});

					populateStayDates(rateId, roomId, i);
				}

				navigateOut();
			}
		};



		// ROOM RATE VIEW HANDLERS



		// CALENDAR VIEW HANDLERS

		$scope.toggleSearchWithRestrictions = function() {
			$scope.stateCheck.calendarState.searchWithRestrictions = !$scope.stateCheck.calendarState.searchWithRestrictions;
			$scope.$broadcast('availableRateFiltersUpdated');
		};

		$scope.toggleShowOnlyAvailable = function() {
			$scope.stateCheck.calendarState.showOnlyAvailableRooms = !$scope.stateCheck.calendarState.showOnlyAvailableRooms;
			$scope.$broadcast('availableRateFiltersUpdated');
		};

		$scope.toggleCalendar = function() {
			$scope.stateCheck.activeMode = $scope.stateCheck.activeMode === "ROOM_RATE" ? "CALENDAR" : "ROOM_RATE";
			$scope.heading = $scope.stateCheck.activeMode === "ROOM_RATE" ? "Rooms & Rates" : " Rate Calendar";
			$scope.setHeadingTitle($scope.heading);
			$("#rooms-and-rates-header .switch-button").toggleClass("on");
		};

		initialize();

	}
]);