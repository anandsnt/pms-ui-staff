sntRover.controller('RVSelectRoomAndRateCtrl', [
	'$rootScope', '$scope', 'sortOrder', 'areReservationAddonsAvailable', '$stateParams', 'rates', 'ratesMeta', '$timeout', '$state', 'RVReservationBaseSearchSrv', 'RVReservationStateService', 'RVReservationDataService', 'house', 'RVSelectRoomRateSrv', 'rvPermissionSrv', 'ngDialog', 'rateAddons', '$filter',
	function($rootScope, $scope, sortOrder, areReservationAddonsAvailable, $stateParams, rates, ratesMeta, $timeout, $state, RVReservationBaseSearchSrv, RVReservationStateService, RVReservationDataService, house, RVSelectRoomRateSrv, rvPermissionSrv, ngDialog, rateAddons, $filter) {

		$scope.stateCheck = {
			sortOrder: sortOrder.value,
			house: house, //house availability
			baseInfo: rates,
			activeMode: $stateParams.view && $stateParams.view === "CALENDAR" ? "CALENDAR" : "ROOM_RATE",
			activeView: "", // RECOMMENDED, ROOM_TYPE and RATE
			stayDatesMode: false,
			calendarState: {
				showOnlyAvailableRooms: true,
				searchWithRestrictions: true,
				calendarType: "BEST_AVAILABLE"
			},
			roomDetails: {},
			preferredType: "",
			lookUp: {},
			taxInfo: null,
			showClosedRates: false,
			rateSelected: {
				allDays: false,
				oneDay: false
			},
			selectedStayDate: "",
			dateModeActiveDate: "",
			dateButtonContainerWidth: $scope.reservationData.stayDays.length * 80,
			guestOptionsIsEditable: false,
			exhaustedAddons: [],
			showLessRooms: true,
            maxRoomsToShow: 0,
			selectedRoomType: -1,
			addonLookUp: {}
		};

		$scope.display = {
			roomFirstGrid: [],
			rateFirstGrid: []
		};

		//--
		$scope.restrictionColorClass = RVSelectRoomRateSrv.restrictionColorClass;
		$scope.restrictionsMapping = ratesMeta['restrictions'];

		//-- REFERENCES
		var TABS = $scope.reservationData.tabs,
			ROOMS = $scope.reservationData.rooms,
			ARRIVAL_DATE = $scope.reservationData.arrivalDate,
			DEPARTURE_DATE = $scope.reservationData.departureDate;


		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- ***************************
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- PRIVATE METHODS
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- ***************************

		var isMembershipValid = function() {
				var membership = $scope.reservationData.guestMemberships,
					selectedMembership = $scope.reservationData.member.value,
					validFFP = _.findWhere(membership.ffp, {
						membership_type: selectedMembership
					}),
					validHLP = _.findWhere(membership.hlp, {
						membership_type: selectedMembership
					});

				return ($rootScope.isFFPActive && !!validFFP) || ($rootScope.isHLPActive && !!validHLP);
			},
			evaluatePromotion = function() {
				var promoFrom = $scope.reservationData.code.from,
					promoTo = $scope.reservationData.code.to,
					isValid = true,
					validityTable = {};

				_.each(ROOMS[$scope.activeRoom].stayDates, function(dateInfo, currDate) {
					if (currDate !== DEPARTURE_DATE || currDate === ARRIVAL_DATE) {
						if (!!promoFrom) {
							isValid = new tzIndependentDate(promoFrom) <= new tzIndependentDate(currDate);
						}
						if (!!promoTo) {
							isValid = new tzIndependentDate(promoTo) >= new tzIndependentDate(currDate);
						}
					}
					validityTable[currDate] = isValid;
				});
				return validityTable;
			},
			getTabRoomDetails = function(roomIndex) {
				var currentRoomTypeId = parseInt(TABS[roomIndex].roomTypeId, 10) || "",
					firstIndex = _.indexOf(ROOMS, _.findWhere(ROOMS, {
						roomTypeId: currentRoomTypeId
					})),
					lastIndex = _.lastIndexOf(ROOMS, _.last(_.where(ROOMS, {
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
			isRateSelected = function() {
				// Have to check if all the days have rates and enable the DONE button
				var allSelected = {
					allDays: true,
					oneDay: false
				};
				_.each(ROOMS[$scope.activeRoom].stayDates, function(dateConfig, date) {
					if (!!dateConfig.rate.id) {
						allSelected.oneDay = true;
					}
					if (allSelected.allDays && (date !== DEPARTURE_DATE) && !dateConfig.rate.id) {
						allSelected.allDays = false;
					}
				});
				return allSelected;
			},
			fetchRates = function() {
				var occupancies = _.pluck(ROOMS[$scope.activeRoom].stayDates, "guests");
				if (occupancies.length > 1) {
					// No need to send last day's occupancy to the rate's API 
					occupancies.splice(-1, 1)
				}

				var payLoad = {
					from_date: ARRIVAL_DATE,
					to_date: DEPARTURE_DATE,
					company_id: $scope.reservationData.company.id,
					travel_agent_id: $scope.reservationData.travelAgent.id,
					group_id: $scope.reservationData.group.id,
					allotment_id: $scope.reservationData.allotment.id,
					promotion_code: $scope.reservationData.searchPromoCode,
					promotion_id: $scope.reservationData.promotionId,
					override_restrictions: $scope.stateCheck.showClosedRates,
					'adults[]': _.pluck(occupancies, "adults"),
					'children[]': _.pluck(occupancies, "children"),
					'include_expired_promotions': !!$scope.reservationData.promotionId && $scope.stateCheck.showClosedRates,

				};

				if ($scope.stateCheck.stayDatesMode) {
					payLoad['restrictions_on_date'] = $scope.stateCheck.dateModeActiveDate;
				};

				$scope.invokeApi(RVReservationBaseSearchSrv.fetchRates, payLoad, function(rates) {
					$scope.stateCheck.baseInfo = rates;
					$scope.stateCheck.addonLookUp = RVReservationStateService.getAddonAmounts(rateAddons,
						ARRIVAL_DATE,
						DEPARTURE_DATE,
						ROOMS[$scope.activeRoom].stayDates);
					groupByRoomTypes();
					groupByRates();
					$scope.$emit('hideLoader');
				});
			},
			hasContractedRate = function(rates) {
				var hasRate = false;
				_.each(rates, function(rate) {
					if ($scope.reservationData.ratesMeta[rate.id].account_id !== null) {
						hasRate = true;
					}
				});
				return hasRate;
			},
			updateMetaInfoWithCustomRates = function() {
				var customRate;

				if (!!$scope.reservationData.group.id) {
					customRate = RVReservationStateService.getCustomRateModel($scope.reservationData.group.id, $scope.reservationData.group.name, 'GROUP');
					$scope.reservationData.ratesMeta[customRate.id] = customRate;
				};

				if (!!$scope.reservationData.allotment.id) {
					customRate = RVReservationStateService.getCustomRateModel($scope.reservationData.allotment.id, $scope.reservationData.allotment.name, 'ALLOTMENT');
					$scope.reservationData.ratesMeta[customRate.id] = customRate;
				};
			},
			groupByRoomTypes = function(args) {
				// Populate a Room First Grid Here
				var roomTypes = {},
					isHouseFull = $scope.stateCheck.stayDatesMode ? $scope.stateCheck.house[$scope.stateCheck.dateModeActiveDate] < 1 : $scope.getLeastHouseAvailability() < 1,
                    isGroupReservation = !!$scope.reservationData.group.id || !!$scope.reservationData.allotment.id,
					isPromoInvalid = $scope.reservationData.code &&
					$scope.reservationData.code.id &&
					!_.reduce($scope.stateCheck.promotionValidity, function(a, b) {
						return a && b;
					});

				// for every rate
				_.each($scope.stateCheck.baseInfo, function(rate) {
					//for every room type
					var currentRate = rate.id;

					_.each(rate.room_types, function(roomType) {
						var currentRoomType = roomType.id;

						//---- MITIGATE -- CUSTOM RATES NOT IN META
						if (!$scope.reservationData.ratesMeta[currentRate]) {
							// -- Note: This should optimally come inside this condition only if a group/allotment is added in the Room & Rates screen. Else this would have been done in initialization itself.
							updateMetaInfoWithCustomRates();
						}

						if (!!$scope.reservationData.ratesMeta[currentRate]) {
							//If some rate is returned that is not in the meta data... this means that the rates are being edited in another session. These updates wont be available due to caching!

							if (!roomTypes[currentRoomType]) {
								roomTypes[currentRoomType] = {
									id: currentRoomType,
									name: $scope.reservationData.roomsMeta[currentRoomType].name,
									rates: {},
									availability: null,
									level: $scope.reservationData.roomsMeta[currentRoomType].level
								};
							}

							//---------------------------------------------------------------------------------------------- Add FULL-HOUSE if applicable in restrictions

							if (!isGroupReservation && isHouseFull && (!roomType.first_restriction || roomType.first_restriction.type_id != 99)) {
								roomType.restriction_count = roomType.restriction_count ? roomType.restriction_count + 1 : 1;
								if (roomType.restriction_count === 1) {
									roomType.first_restriction = {
										type_id: 99,
										days: null
									}
								}
							}

							//---------------------------------------------------------------------------------------------- Add INVALID PROMO if applicable in restrictions

							if (isPromoInvalid && (!roomType.first_restriction || roomType.first_restriction.type_id != 98)) {
								if (_.indexOf($scope.reservationData.ratesMeta[currentRate].linked_promotion_ids, $scope.reservationData.code.id) > -1) {

									roomType.restriction_count = roomType.restriction_count ? roomType.restriction_count + 1 : 1;
									if (roomType.restriction_count === 1) {
										roomType.first_restriction = {
											type_id: 98,
											days: null
										}
									}
								}
							}

							roomTypes[currentRoomType].rates[currentRate] = {
								name: $scope.reservationData.ratesMeta[currentRate].name,
								id: currentRate,
								adr: 0.0,
								totalAmount: 0.0,
								isSuppressed: !!$scope.reservationData.ratesMeta[currentRate].is_suppress_rate_on,
								isCorporate: !!rate.isCorporate,
								isGroupRate: !!rate.isGroupRate,
								isAllotmentRate: !!rate.isAllotmentRate,
								isMember: !!$scope.reservationData.member.isSelected && $scope.reservationData.ratesMeta[rate.id].is_member,
								dates: {},
								showDays: false,
								numRestrictions: roomType.restriction_count || 0,
								restriction: roomType.first_restriction,
								forRoomType: currentRoomType,
								isPromotion: !isPromoInvalid &&
									_.indexOf($scope.reservationData.ratesMeta[currentRate].linked_promotion_ids, $scope.reservationData.code.id) > -1
							}

							//for every day
							_.each(roomType.dates, function(date, index) {
								if (index < roomType.dates.length - 1 || roomType.dates.length === 1) {
									var currentDay = date.date;

									roomTypes[currentRoomType].rates[currentRate].totalAmount = parseFloat(roomTypes[currentRoomType].rates[currentRate].totalAmount) +
										date.amount +
										($scope.stateCheck.addonLookUp[currentDay][currentRate] || 0.0);

									roomTypes[currentRoomType].rates[currentRate].dates[currentDay] = {
											obj: new tzIndependentDate(currentDay),
											availability: date.availability,
											amount: date.amount
										}
										// Assign Least Availability on the room level
									roomTypes[currentRoomType].availability = roomTypes[currentRoomType].availability === null ? date.availability : Math.min(roomTypes[currentRoomType].availability, date.availability);
								}
							});

							roomTypes[currentRoomType].rates[currentRate].adr = roomTypes[currentRoomType].rates[currentRate].totalAmount / ($scope.reservationData.numNights || 1);
						}

					});
				});

				// BookKeeping for lookup	
				$scope.stateCheck.lookUp = roomTypes;
                
                $scope.stateCheck.maxRoomsToShow = _.keys(roomTypes).length;

				// Sorting
				var roomTypesArray = [];
				_.each(roomTypes, function(roomType) {

					roomType.ratesArray = _.values(roomType.rates);

					// ************************************************************************************************* STEP 1a : Sort rates based on the preference
					if ($scope.stateCheck.sortOrder === "HIGH_TO_LOW") {
						roomType.ratesArray.sort(RVReservationDataService.sortRatesInRoomsDESC);
					} else {
						roomType.ratesArray.sort(RVReservationDataService.sortRatesInRoomsASC);
					}

					if (roomType.ratesArray.length > 0) {
						roomType.defaultRate = roomType.ratesArray[0];
					} else {
						roomType.defaultRate = -1;
					}

					roomTypesArray.push(roomType);
				});

				// Filtering	
				$scope.display.roomFirstGrid = [];
				// ------------------------------------------------------------------- [ no room type selected ]
				if (!$scope.stateCheck.preferredType) {
					$scope.stateCheck.selectedRoomType = -1;
					//--------------------------------------------------------------------------------------------------[ sort the rooms on increasing adr and then on the levels ]
					// always list roomtypes within a level in increasing order of their default rates
					// ************************************************************************************************* STEP 2a : sort rooms by ascending 'default rate's ADR'
					roomTypesArray.sort(RVReservationDataService.sortRoomTypesAscADR);
					//sort the rooms by levels
					// ************************************************************************************************* STEP 2b : sort rooms by ascending 'Levels'
					roomTypesArray.sort(RVReservationDataService.sortRoomTypesAscLevels);
					//CICO-7792 : Bring contracted rates to the top
					// ************************************************************************************************* STEP 2c : Bring the roomtypes with contracted rates to top
					roomTypesArray.sort(function(a, b) {
						if (hasContractedRate(a.ratesArray) && !hasContractedRate(b.ratesArray)) {
							return -1;
						}
						if (hasContractedRate(b.ratesArray) && !hasContractedRate(a.ratesArray)) {
							return 1;
						}
						return 0;
					});
					if ($scope.stateCheck.showLessRooms) { //--------------------------- [ minimal view ]
						// put the first room and the least room in the next level
						_.each(roomTypesArray, function(roomType) {
							if ($scope.display.roomFirstGrid.length < 2) { // ------------------------------------------[ as the rooms are in sorted order by now, put the next best room here. This will remain as the next option unless a room in next level is available ]
								$scope.display.roomFirstGrid.push(roomType);
							} else if ($scope.display.roomFirstGrid.length === 2) {
								// -------------------------------------------------------------------------------------[ as the rooms are in sorted order by now, just put the next level's room here ]
								if (roomType.level > $scope.display.roomFirstGrid[1].level && (roomType.level - $scope.display.roomFirstGrid[0].level < 2)) {
									$scope.display.roomFirstGrid[1] = roomType;
								}
							}
						});
					} else {
						$scope.display.roomFirstGrid = roomTypesArray;
					}
				} else {
					TABS[$scope.activeRoom].roomTypeId = $scope.stateCheck.preferredType;
					// If a room type of category Level1 is selected, show this room type plus the lowest priced room type of the level 2 category.
					// If a room type of category Level2 is selected, show this room type plus the lowest priced room type of the level 3 category.
					// If a room type of category Level3 is selected, only show the selected room type.
					$scope.display.roomFirstGrid = _.filter(roomTypesArray, function(roomType) {
						return roomType.id === parseInt($scope.stateCheck.preferredType, 10) ||
							!$scope.reservationData.group.id && $scope.viewState.identifier === "CREATION" && hasContractedRate(roomType.ratesArray); // In case of group skip this check
					});

					if ($scope.display.roomFirstGrid.length > 0 &&
						TABS.length < 2 && // Not showing other room types in case of multiple reservations
						roomTypesArray.length > 0 &&
						!$scope.stateCheck.rateSelected.oneDay &&
						$scope.reservationData.status !== "CHECKEDIN" &&
						$scope.reservationData.status !== "CHECKING_OUT") {
						var level = $scope.reservationData.roomsMeta[$scope.stateCheck.preferredType].level;
						if (level === 1 || level === 2) {
							//Append rooms from the next level
							//Get the candidate rooms of the room to be appended
							var targetlevel = level + 1;
							var candidateRooms = _.filter(roomTypesArray, function(roomType) {
								return roomType.level === targetlevel &&
									roomType.ratesArray.length > 0 &&
									!hasContractedRate(roomType.ratesArray);
							});

							//Check if candidate rooms are available
							if (candidateRooms.length === 0) {
								//try for candidate rooms in the same level
								candidateRooms = _.filter(roomTypesArray, function(roomType) {
									return roomType.level === level &&
										parseInt(roomType.id, 10) !== parseInt($scope.stateCheck.preferredType, 10) &&
										roomType.ratesArray.length > 0 &&
										parseInt(roomType.defaultRate.adr) >= parseInt($scope.display.roomFirstGrid[0].defaultRate.adr) &&
										!hasContractedRate(roomType.ratesArray);
								});
							}
							//Sort the candidate rooms to get the one with the least average rate
							candidateRooms.sort(RVReservationDataService.sortRoomTypesAscADR);

							//append the appropriate room to the list to be displayed
							if (candidateRooms.length > 0) {
								var selectedRoom = $(roomTypesArray).filter(function() {
									return this.id === candidateRooms[0].id;
								});
								if (selectedRoom.length > 0) {
									$scope.display.roomFirstGrid.push(selectedRoom[0]);
								}
							}
						}
					}
					$scope.stateCheck.selectedRoomType = $scope.stateCheck.preferredType;
				}
				$scope.refreshScroll();
			},
			groupByRates = function() {
				var rates = {};
				_.each($scope.stateCheck.lookUp, function(room, roomId) {
					_.each(room.rates, function(rate) {
						if (!rates[rate.id]) {
							rates[rate.id] = {
								id: rate.id,
								name: rate.name,
								rooms: [],
								showDays: false,
								isSuppressed: !!$scope.reservationData.ratesMeta[rate.id].is_suppress_rate_on,
								isCorporate: rate.isCorporate,
								isGroupRate: rate.isGroupRate,
								isAllotmentRate: rate.isAllotmentRate,
								isMember: !!$scope.reservationData.member.isSelected && $scope.reservationData.ratesMeta[rate.id].is_member,
								isPromotion: rate.isPromotion
							};
						}
						rates[rate.id].rooms.push({
							id: room.id,
							name: room.name,
							adr: rate.adr,
							dates: rate.dates,
							availability: room.availability,
							restriction: rate.restriction,
							numRestrictions: rate.numRestrictions
						});
					})
				});

				var ratesArray = [];

				_.each(rates, function(rate) {
					if (!$scope.stateCheck.preferredType) {
						// ************************************************************************************************************************************* STEP 1a : Sort ASC room-rate ADR
						rate.rooms.sort(RVReservationDataService.sortRatesAsc);
						ratesArray.push(rate);
						rate.selectedRoom = rate.rooms[0];
						rate.selectedRoomId = rate.rooms[0].id;

					} else {
						//preferred room process
						// If a contracted rate, then got to show it anyway
						var prefRooms = _.where(rate.rooms, {
							id: parseInt($scope.stateCheck.preferredType)
						});

						if (prefRooms.length > 0) {
							// ********************************************************************************************************************************* STEP 1a : Sort ASC room-rate ADR
							rate.rooms.sort(RVReservationDataService.sortRatesAsc);
							ratesArray.push(rate);
							rate.selectedRoomId = parseInt($scope.stateCheck.preferredType);
							rate.selectedRoom = prefRooms[0];
						} else if (!!$scope.reservationData.ratesMeta[rate.id].account_id) {
							ratesArray.push(rate);
							rate.selectedRoomId = rate.rooms[0].id;
							rate.selectedRoom = rate.rooms[0];
						}
					}

				});

				// ********************************************************************************************************************************************* STEP 2a : Sort ASC rate names
				// ********************************************************************************************************************************************* STEP 2b : Bring Member rates to top
				// ********************************************************************************************************************************************* STEP 2c : Bring Promoted rates to top
				// ********************************************************************************************************************************************* STEP 2d : Bring Corporate rates to top
				ratesArray.sort(RVReservationDataService.sortRateAlphabet);

				$scope.display.rateFirstGrid = ratesArray;
				$scope.refreshScroll();
			},
			goToAddonsView = function() {
				$state.go('rover.reservation.staycard.mainCard.addons', {
					"from_date": ARRIVAL_DATE,
					"to_date": DEPARTURE_DATE
				});
			},
			enhanceStay = function() {
				// CICO-9429: Show Addon step only if its been set ON in admin
				var navigate = function() {
					if ($scope.reservationData.guest.id || $scope.reservationData.company.id || $scope.reservationData.travelAgent.id || $scope.reservationData.group.id) {
						if ($rootScope.isAddonOn && areReservationAddonsAvailable) {
							goToAddonsView();
						} else {
							$scope.computeTotalStayCost();
							$state.go('rover.reservation.staycard.mainCard.summaryAndConfirm');
						}
					}
				}
				if ($rootScope.isAddonOn && areReservationAddonsAvailable) {
					//CICO-16874
					goToAddonsView();
				} else {
					var allRatesSelected = _.reduce(_.pluck(ROOMS, 'rateId'), function(a, b) {
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
						var roomIndexWithoutRate = _.findIndex(ROOMS, {
							rateId: ""
						});
						var tabIndexWithoutRate = _.findIndex(TABS, {
							roomTypeId: ROOMS[roomIndexWithoutRate].roomTypeId
						});
						$scope.changeActiveRoomType(tabIndexWithoutRate || 0);
					}

				}

			},
			// Fix for CICO-9536
			// Expected Result: Only one single room type can be applied to a reservation.
			// However, the user should be able to change the room type for the first night on the Stay Dates screen,
			// while the reservation is not yet checked in. The control should be disabled for any subsequent nights.
			resetRates = function() {
				var roomIndex = $scope.stateCheck.roomDetails.firstIndex;
				for (; roomIndex <= $scope.stateCheck.roomDetails.lastIndex; roomIndex++) {
					_.each(ROOMS[roomIndex].stayDates, function(stayDate, idx) {
						stayDate.rate.id = '';
						stayDate.rate.name = '';
					});
				}
				$scope.stateCheck.rateSelected.allDays = false;
				// reset value, else rate selection will get bypassed
				// check $scope.handleBooking method
				$scope.stateCheck.rateSelected.oneDay = false;
			},
			navigateOut = function() {
				if ($scope.viewState.identifier !== "REINSTATE" &&
					($stateParams.fromState === "rover.reservation.staycard.reservationcard.reservationdetails" || $stateParams.fromState === "STAY_CARD")) {
					saveAndGotoStayCard();
				} else {
					$scope.computeTotalStayCost();
					enhanceStay();
				}
			},
			initScrollers = function() {
				$scope.setScroller('room_types', {
					preventDefault: false
				});
				$scope.setScroller('stayDates', {
					scrollX: true,
					scrollY: false
				});
			},
			setBackButton = function() {
				// CICO-20270: to force selection of a rate after removing a card with contracted rate.
				if ($stateParams.disable_back_staycard) {
					return;
				}

				// smart switch btw edit reservation flow and create reservation flow
				if (!!$state.params && $state.params.isFromChangeStayDates) {
					$rootScope.setPrevState = {
						title: 'Stay Dates',
						name: 'rover.reservation.staycard.changestaydates'
					}
				} else if ($scope.reservationData && $scope.reservationData.confirmNum && $scope.reservationData.reservationId) {
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
			},
			updateSupressedRatesFlag = function() {
				var roomIndex = $scope.stateCheck.roomDetails.firstIndex;
				for (; roomIndex <= $scope.stateCheck.roomDetails.lastIndex; roomIndex++) {
					$scope.reservationData.rooms[roomIndex].isSuppressed = false;
					_.each($scope.reservationData.rooms[roomIndex].stayDates, function(d, i) {
						// Find if any of the selected rates is suppressed
						var currentRateSuppressed = !!d.rate.id && !!$scope.reservationData.ratesMeta[d.rate.id].is_suppress_rate_on;
						if (typeof $scope.reservationData.rooms[roomIndex].isSuppressed === 'undefined') {
							$scope.reservationData.rooms[roomIndex].isSuppressed = currentRateSuppressed;
						} else {
							$scope.reservationData.rooms[roomIndex].isSuppressed = $scope.reservationData.rooms[roomIndex].isSuppressed || currentRateSuppressed;
						}
					});
				}
			},
			initialize = function() {
				$scope.heading = 'Rooms & Rates';
				$scope.setHeadingTitle($scope.heading);


				$scope.activeRoom = $scope.viewState.currentTab;
				$scope.stateCheck.preferredType = TABS[$scope.activeRoom].roomTypeId;

				$scope.stateCheck.roomDetails = getCurrentRoomDetails();

				//--
				if (!$scope.stateCheck.dateModeActiveDate) {
					var stayDates = ROOMS[$scope.stateCheck.roomDetails.firstIndex].stayDates;
					//--
					if ($scope.reservationData.midStay) {
						// checking if midstay and handling the expiry condition
						if (new tzIndependentDate(DEPARTURE_DATE) > new tzIndependentDate($rootScope.businessDate)) {
							$scope.stateCheck.dateModeActiveDate = $rootScope.businessDate;
							$scope.stateCheck.selectedStayDate = stayDates[$rootScope.businessDate];
						} else {
							$scope.stateCheck.dateModeActiveDate = ARRIVAL_DATE;
							$scope.stateCheck.selectedStayDate = stayDates[ARRIVAL_DATE];
						}
					} else {
						$scope.stateCheck.dateModeActiveDate = ARRIVAL_DATE;
						$scope.stateCheck.selectedStayDate = stayDates[ARRIVAL_DATE];
					}
				}

				$scope.reservationData.ratesMeta = ratesMeta['rates'];

				updateMetaInfoWithCustomRates();

				// activate room type default view based on reservation settings
				if ($scope.otherData.defaultRateDisplayName === 'Recommended') {
					$scope.stateCheck.activeView = "RECOMMENDED";
				} else if ($scope.otherData.defaultRateDisplayName === 'By Rate') {
					$scope.stateCheck.activeView = "RATE";
				} else {
					// By default RoomType
					$scope.stateCheck.activeView = "ROOM_TYPE";
				}

				// Compute costs for the rate addons initially for each day
				$scope.stateCheck.addonLookUp = RVReservationStateService.getAddonAmounts(rateAddons,
					ARRIVAL_DATE,
					DEPARTURE_DATE,
					ROOMS[$scope.activeRoom].stayDates);

				if (!!$scope.reservationData.code && !!$scope.reservationData.code.id) {
					$scope.stateCheck.promotionValidity = evaluatePromotion();
				}

				setBackButton();

				groupByRoomTypes();
				groupByRates();

				//--
				initScrollers();
				initEventListeners();
				//--
			},
			/**
			 * [findExhaustedRateAddons description]
			 * @param  {[type]} roomId [description]
			 * @param  {[type]} rateId [description]
			 * @return {[type]}        [description]
			 */
			findExhaustedRateAddons = function(roomId, rateId) {
				var exhaustedRateAddons = [],
					updateExhaustedAddonsList = function(addon) {
						// Need to see the applicable count based on the amount_type
						var applicableCount = RVReservationStateService.getApplicableAddonsCount(
							addon.amountType,
							addon.postType,
							parseInt(addon.postFrequency, 10),
							parseInt(TABS[$scope.viewState.currentTab].numAdults, 10),
							parseInt(TABS[$scope.viewState.currentTab].numChildren, 10),
							parseInt($scope.reservationData.numNights, 10)
						) * parseInt(TABS[$scope.viewState.currentTab].roomCount, 10);


						if (_.isNumber(addon.inventory) && addon.inventory < applicableCount) {
							var currentIndex = _.findIndex(exhaustedRateAddons, {
								id: addon.id
							});
							if (currentIndex > -1) { //entry exists already
								if (exhaustedRateAddons[currentIndex].inventory > addon.inventory) {
									exhaustedRateAddons[currentIndex].inventory = addon.inventory; //reset to the minimum of the counts	
								}
							} else {
								exhaustedRateAddons.push(addon);
							}
						}
					},
					dayLoop = function(forDate) {
						if (forDate === ARRIVAL_DATE || forDate !== DEPARTURE_DATE) {
							var associatedAddons = RVReservationStateService.fetchAssociatedAddons(rateId);
							_.each(associatedAddons, function(addon) {
								var inventoryForDay = _.findWhere(addon.inventory, {
									date: forDate
								});

								updateExhaustedAddonsList({
									name: addon.name,
									postType: addon.post_type.value,
									amountType: addon.amount_type.value,
									postFrequency: addon.post_type.frequency,
									id: addon.id,
									inventory: inventoryForDay && _.isNumber(inventoryForDay.available_count) ? inventoryForDay.available_count : null
								});
							});
						}
					};

				if (!$scope.stateCheck.stayDatesMode) { // Not in stay dates mode
					_.each($scope.reservationData.stayDays, function(day) {
						dayLoop(day.date);
					});
				} else { // In stay dates mode
					dayLoop($scope.stateCheck.dateModeActiveDate);
				}

				return exhaustedRateAddons;
			},
			alertAddonOverbooking = function(close) {
				var addonIndex = 0,
					timer = 0;
				if (close) {
					$scope.closeDialog();
					timer = 1500
				}
				$timeout(function() {
					for (; addonIndex < $scope.stateCheck.exhaustedAddons.length; addonIndex++) {
						var addon = $scope.stateCheck.exhaustedAddons[addonIndex];
						if (!addon.isAlerted) {
							addon.isAlerted = true;
							ngDialog.open({
								template: '/assets/partials/reservationCard/rvInsufficientInventory.html',
								className: 'ngdialog-theme-default',
								closeByDocument: true,
								scope: $scope,
								data: JSON.stringify({
									name: addon.name,
									count: addon.inventory,
									canOverbookInventory: rvPermissionSrv.getPermissionValue('OVERRIDE_ITEM_INVENTORY')
								})
							});
							break;
						}
					}
					if (addonIndex === $scope.stateCheck.exhaustedAddons.length) {
						$scope.handleBooking($scope.stateCheck.selectedRoomRate.roomId, $scope.stateCheck.selectedRoomRate.rateId, false, {
							skipAddonCheck: true
						});
					}
				}, timer);
			},
			/**
			 * [fetchTaxRateAddonMeta description]
			 * @param  {Function} callback [description]
			 * @return {[type]}            [description]
			 */
			fetchTaxRateAddonMeta = function(callback) {
				if (!callback) {
					callback = function() {
						console.log('No call back for tax and rate addon meta fetching');
					}
				}

				$scope.invokeApi(RVReservationBaseSearchSrv.fetchTaxInformation, {
					from_date: ARRIVAL_DATE,
					to_date: DEPARTURE_DATE
				}, function(response) {
					$scope.stateCheck.taxInfo = true;
					RVReservationStateService.metaData.taxDetails = angular.copy(response);
					RVReservationStateService.metaData.rateAddons = angular.copy(rateAddons); // the rate addons are resolved when we come inside this screen
					callback();
					$scope.$emit('hideLoader');
				});
			},
			haveAddonsChanged = function(entireSet, associatedAddons) {
				// TODO: Clear this up... fromState should have only the name of this state
				if ($stateParams.fromState === "rover.reservation.staycard.reservationcard.reservationdetails" ||
					$stateParams.fromState === "STAY_CARD") {
					return associatedAddons && associatedAddons.length > 0;
				} else {
					var extraAddons = [];
					_.each(entireSet, function(addon) {
						if (!_.find(associatedAddons, {
								id: addon.id
							})) {
							extraAddons.push(addon.id);
						}
					})
					return extraAddons.length > 0;
				}
			},
			transferState = function() {
				updateSupressedRatesFlag();
				// Set flag for suppressed rates
				$scope.reservationData.isRoomRateSuppressed = _.reduce(_.pluck(ROOMS, 'isSuppressed'), function(a, b) {
					return a || b
				});
				// Check if there has been a rateChange
				if (!!RVReservationStateService.bookMark.lastPostedRate) {
					// Identify if there are extra addons added other than those of the associated rate's
					var firstRoom = ROOMS[0],
						currentRate = firstRoom.rateId,
						existingAddons = firstRoom.addons, // Entire set of addons for the reservation (incl rate associated addons)
						existingRateAddons = _.filter(existingAddons, function(addon) {
							return addon.is_rate_addon;
						}),
						existingReservationAddons = _.filter(existingAddons, function(addon) {
							return !addon.is_rate_addon;
						}),
						newRateAddons = RVReservationStateService.fetchAssociatedAddons(currentRate),
						reservationAddonsChanged = false;

					RVReservationStateService.setReservationFlag('RATE_CHANGED', true);

					firstRoom.addons = _.map(newRateAddons, function(addon) {
						return _.extend(addon, {
							is_rate_addon: true
						})
					});

					//Go through the existingReservationAddons and retain those of which arent having the new rate
					//in their excluded list. Leave the rest
					_.each(existingReservationAddons, function(addon) {
						if (!addon.allow_rate_exclusion || (addon.allow_rate_exclusion && _.indexOf(addon.excluded_rate_ids, currentRate) < 0)) {
							firstRoom.addons.push(addon);
						} else {
							reservationAddonsChanged = true;
						}
					});

					// if user has added extra addons other than that of the associated rate -- alert the user!
					if (reservationAddonsChanged || haveAddonsChanged(existingAddons, existingRateAddons)) {
						ngDialog.open({
							template: '/assets/partials/reservation/alerts/rateChangeAddonsAlert.html',
							scope: $scope,
							closeByDocument: false,
							closeByEscape: false
						});
						return false;
					}
				}

				navigateOut();
			},
			populateStayDates = function(rateId, roomId, roomIndex) {
				_.each(ROOMS[roomIndex].stayDates, function(details, date) {
					details.rate.id = rateId;
					var dayInfo = $scope.stateCheck.lookUp[roomId].rates[rateId].dates[date],
						calculatedAmount = dayInfo && dayInfo.amount ||
						$scope.stateCheck.lookUp[roomId].rates[rateId].dates[ARRIVAL_DATE].amount;
					calculatedAmount = Number(parseFloat(calculatedAmount).toFixed(2));
					details.rateDetails = {
						actual_amount: calculatedAmount,
						modified_amount: calculatedAmount,
						is_discount_allowed: $scope.reservationData.ratesMeta[rateId].is_discount_allowed_on === null ? "false" : $scope.reservationData.ratesMeta[rateId].is_discount_allowed_on.toString(), // API returns true / false as a string ... Hence true in a string to maintain consistency
						is_suppressed: $scope.reservationData.ratesMeta[rateId].is_suppress_rate_on === null ? "false" : $scope.reservationData.ratesMeta[rateId].is_suppress_rate_on.toString()
					}
				});
			},
			saveAndGotoStayCard = function() {
				var staycardDetails = {
					title: $filter('translate')('STAY_CARD'),
					name: 'rover.reservation.staycard.reservationcard.reservationdetails',
					param: {
						confirmationId: $scope.reservationData.confirmNum,
						id: $scope.reservationData.reservationId,
						isrefresh: true
					}
				};
				$scope.saveReservation(staycardDetails.name, staycardDetails.param);
			};

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- ***************************
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- PUBLIC METHODS
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- ***************************

		$scope.refreshScroll = function() {
			$timeout(function() {
				$scope.refreshScroller('room_types');
				$scope.$parent.myScroll['room_types'] && $scope.$parent.myScroll['room_types'].refresh();
			}, 100);
		};

		$scope.getBookButtonStyle = function(roomId, rateId) {

			if (!!$scope.reservationData.ratesMeta[rateId].account_id && $scope.stateCheck.lookUp[roomId].rates[rateId].numRestrictions > 0) {
				return 'red';
			}

			if (!$scope.stateCheck.stayDatesMode) {
				if ($scope.stateCheck.lookUp[roomId].rates[rateId].numRestrictions > 0) {
					return 'brand-colors'
				} else {
					return 'green'
				}
			} else { //Staydates mode
				if ($scope.stateCheck.lookUp[roomId].rates[rateId].numRestrictions > 0) {
					return 'white brand-text'
				} else {
					return 'white green-text'
				}
			}
		};

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- PERMISSIONS

		$scope.restrictIfOverbook = function(roomId, rateId) {
			var canOverbookHouse = rvPermissionSrv.getPermissionValue('OVERBOOK_HOUSE'),
				canOverbookRoomType = rvPermissionSrv.getPermissionValue('OVERBOOK_ROOM_TYPE');

            
            if(!!$scope.reservationData.group.id || !!$scope.reservationData.allotment.id) {
            	// CICO-26707 Skip house avbl check for group/allotment reservations
                canOverbookHouse = true;
                //CICO-24923 TEMPORARY : Dont let overbooking of Groups from Room and Rates
                if($scope.getLeastAvailability(roomId, rateId) < 1){
                	return true;
				}
				//CICO-24923 TEMPORARY
            }

			if (canOverbookHouse && canOverbookRoomType) {
				//CICO-17948
				//check actual hotel availability with permissions
				return false;
			}

			if (!canOverbookHouse && $scope.getLeastHouseAvailability() < 1) {
				return true;
			}

			if (!canOverbookRoomType && $scope.getLeastAvailability(roomId, rateId) < 1) {
				return true;
			}

			// Default
			return false;
		};

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- RESTRICTIONS
		$scope.toggleClosedRates = function() {
			$scope.stateCheck.showClosedRates = !$scope.stateCheck.showClosedRates;
			fetchRates();
		};

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- STAY DATES MODE
		$scope.toggleStayDaysMode = function() {
			$scope.stateCheck.stayDatesMode = !$scope.stateCheck.stayDatesMode;

			// see if the done button has to be enabled
			if ($scope.stateCheck.stayDatesMode) {
				$scope.stateCheck.rateSelected.allDays = isRateSelected().allDays;
				$scope.stateCheck.rateSelected.oneDay = isRateSelected().oneDay;
			}

			$scope.refreshScroll();

			$timeout(function() {
				$scope.refreshScroller("stayDates");
			}, 150);

			fetchRates();
		};

		$scope.showStayDateDetails = function(selectedDate) {
			// by pass departure stay date from stay dates manipulation
			if (selectedDate === DEPARTURE_DATE) {
				return false;
			}
			$scope.stateCheck.dateModeActiveDate = selectedDate;
			$scope.stateCheck.selectedStayDate = ROOMS[$scope.stateCheck.roomDetails.firstIndex].stayDates[selectedDate];
			fetchRates();
		};


		$scope.toggleEditGuestOptions = function() {
			$scope.stateCheck.guestOptionsIsEditable = !$scope.stateCheck.guestOptionsIsEditable;
		}


		$scope.updateDayOccupancy = function(occupants) {
			ROOMS[$scope.stateCheck.roomDetails.firstIndex].stayDates[$scope.stateCheck.dateModeActiveDate].guests[occupants] =
				parseInt($scope.stateCheck.selectedStayDate.guests[occupants]);
			/**
			 * CICO-8504
			 * In case of multiple rates selected, the side bar and the reservation summary need to showcase the first date's occupancy!
			 *
			 */
			if (ARRIVAL_DATE === $scope.stateCheck.dateModeActiveDate) {
				var occupancy = ROOMS[$scope.stateCheck.roomDetails.firstIndex].stayDates[$scope.stateCheck.dateModeActiveDate].guests,
					roomIndex = $scope.stateCheck.roomDetails.firstIndex;
				for (; roomIndex <= $scope.stateCheck.roomDetails.lastIndex; roomIndex++) {
					ROOMS[roomIndex].numAdults = occupancy.adults;
					ROOMS[roomIndex].numChildren = occupancy.children;
					ROOMS[roomIndex].numInfants = occupancy.infants;
				}
			}

			if (!$scope.checkOccupancyLimit($scope.stateCheck.dateModeActiveDate)) {
				$scope.preferredType = "";
				// TODO : Reset other stuff as well
				$scope.stateCheck.rateSelected.oneDay = false;
				$scope.stateCheck.rateSelected.allDays = false;
				var roomIndex = $scope.stateCheck.roomDetails.firstIndex;
				for (; roomIndex <= $scope.stateCheck.roomDetails.lastIndex; roomIndex++) {
					_.each(ROOMS[roomIndex].stayDates, function(stayDate) {
						stayDate.rate = {
							id: ""
						};
					});
				}
			};
			fetchRates();
		};


		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- COMPUTE TAX AND DAY BREAKUP

		/**
		 * [viewRateBreakUp description]
		 * @param  {[type]} rate       [description]
		 * @param  {[type]} updateOnly [description]
		 * @return {[type]}            [description]
		 */
		$scope.viewRateBreakUp = function(rate, updateOnly) {

			var computeDetails = function() {
				RVSelectRoomRateSrv.houseAvailability = $scope.stateCheck.house;
				RVSelectRoomRateSrv.isGroupReservation = !!$scope.reservationData.group.id || !!$scope.reservationData.allotment.id;

				if ($scope.reservationData.code && //------------------------------------------------------------------- Place INVALID PROMO to be set IFF 
					$scope.reservationData.code.id && //---------------------------------------------------------------- a) A promotion has been entered [AND]
					!_.reduce($scope.stateCheck.promotionValidity, function(a, b) { //---------------------------------  b) The entered promo has expired [AND]
						return a && b
					}) &&
					_.indexOf($scope.reservationData.ratesMeta[rate.id].linked_promotion_ids, $scope.reservationData.code.id) > -1) { //------  c) rate is linked to the promo
					RVSelectRoomRateSrv.promotionValidity = $scope.stateCheck.promotionValidity;
				} else {
					RVSelectRoomRateSrv.promotionValidity = null; //---------------------------------------------------  ELSE set this as NULL
				}

				$scope.invokeApi(RVSelectRoomRateSrv.getRestrictions, {
					from_date: ARRIVAL_DATE,
					to_date: DEPARTURE_DATE,
					rate_id: rate.id,
					room_type_id: $scope.stateCheck.activeView === "RATE" ? rate.selectedRoom.id : rate.forRoomType
				}, function(restrictions) {

					$scope.$emit('hideLoader');

					var datesArray = rate.dates;

					rate.total = 0.0;
					if ($scope.stateCheck.activeView === "RATE") {
						datesArray = rate.selectedRoom.dates;
						rate.selectedRoom.total = 0.0;
					}

					var stayTax = {
						excl: {}
					};

					var updateStayTaxes = function(stayTaxDayInfo) {
						_.each(stayTaxDayInfo.excl, function(taxAmount, taxId) {
							if (stayTax.excl[taxId] === undefined) {
								stayTax.excl[taxId] = parseFloat(taxAmount);
							} else {
								stayTax.excl[taxId] = _.max([stayTax.excl[taxId], parseFloat(taxAmount)]);
							}
						});
					};

					_.each(datesArray, function(dayInfo, date) {
						var taxAddonInfo = RVReservationStateService.getAddonAndTaxDetails(
								date,
								rate.id,
								ROOMS[$scope.activeRoom].stayDates[date].guests.adults,
								ROOMS[$scope.activeRoom].stayDates[date].guests.children,
								ARRIVAL_DATE,
								DEPARTURE_DATE,
								$scope.activeRoom,
								$scope.reservationData.ratesMeta[rate.id].taxes,
								dayInfo.amount),
							dayTotal = dayInfo.amount + taxAddonInfo.addon + parseFloat(taxAddonInfo.tax.excl);

						_.extend(dayInfo, {
							addon: taxAddonInfo.addon,
							inclusiveAddonsExist: taxAddonInfo.inclusiveAddonsExist,
							tax: taxAddonInfo.tax,
							total: dayTotal,
							restrictions: restrictions.dates[date]
						});

						updateStayTaxes(taxAddonInfo.stayTax);

						if ($scope.stateCheck.activeView === "RATE") {
							rate.selectedRoom.total = parseFloat(rate.selectedRoom.total) + parseFloat(dayTotal);
						} else {
							rate.total = parseFloat(rate.total) + parseFloat(dayTotal);
						}
					});

					var totalStayTaxes = 0.0;
					_.each(stayTax.excl, function(tax) {
						totalStayTaxes = parseFloat(totalStayTaxes) + parseFloat(tax);
					});


					if ($scope.stateCheck.activeView === "RATE") {
						rate.selectedRoom.total = parseFloat(rate.selectedRoom.total) + parseFloat(totalStayTaxes);
						rate.selectedRoom.restrictions = restrictions.summary;
					} else {
						rate.total = parseFloat(rate.total) + parseFloat(totalStayTaxes);
						rate.restrictions = restrictions.summary;
					}

					$scope.refreshScroll();

				});

			};

			if (updateOnly) {
				computeDetails();
				return;
			}

			if (!rate.showDays && $scope.stateCheck.taxInfo === null) {
				fetchTaxRateAddonMeta(function() {
					computeDetails();
					rate.showDays = !rate.showDays;
					$scope.refreshScroll();
				});
			} else {
				if (!rate.showDays) {
					// TODO: Do this IFF this hasn't been done before
					computeDetails();
				}
				rate.showDays = !rate.showDays;
				$scope.refreshScroll();
			}
		};

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- BOOKING

		$scope.handleNoEdit = function(event, roomId, rateId) {
			event.stopPropagation();
			ROOMS[$scope.activeRoom].rateName = $scope.reservationData.ratesMeta[rateId].name;
			$scope.reservationData.rateDetails[$scope.activeRoom] = angular.copy($scope.stateCheck.lookUp[roomId].rates[rateId].dates);
			if (!$scope.stateCheck.stayDatesMode) {
				navigateOut();
			}
		};

		$scope.handleDaysBooking = function(event) {
			event.stopPropagation();
			if (!$scope.stateCheck.rateSelected.allDays) {
				//if the dates are not all set with rates
				return false;
			} else {
				// Handle multiple rates selected
				var firstIndexOfRoomType = $scope.stateCheck.roomDetails.firstIndex,
					roomIndex;
				for (roomIndex = $scope.stateCheck.roomDetails.firstIndex; roomIndex <= $scope.stateCheck.roomDetails.lastIndex; roomIndex++) {
					if (RVReservationDataService.isVaryingRates(ROOMS[firstIndexOfRoomType].stayDates, ARRIVAL_DATE, DEPARTURE_DATE, $scope.reservationData.numNights)) {
						ROOMS[roomIndex].rateName = "Multiple Rates Selected";
					} else {
						ROOMS[roomIndex].rateName = $scope.reservationData.ratesMeta[ROOMS[firstIndexOfRoomType].stayDates[ARRIVAL_DATE].rate.id].name;
					}

					var firstRateMetaData = $scope.reservationData.ratesMeta[ROOMS[firstIndexOfRoomType].stayDates[ARRIVAL_DATE].rate.id];

					ROOMS[roomIndex].demographics.market = firstRateMetaData.market_segment_id === null ? "" : firstRateMetaData.market_segment_id;
					ROOMS[roomIndex].demographics.source = firstRateMetaData.source_id === null ? "" : firstRateMetaData.source_id;

					if (roomIndex === 0) {
						$scope.reservationData.demographics.source = ROOMS[roomIndex].demographics.source;
						$scope.reservationData.demographics.market = ROOMS[roomIndex].demographics.market;
					}

					$scope.reservationData.rateDetails[roomIndex] = angular.copy($scope.stateCheck.lookUp[ROOMS[roomIndex].roomTypeId].rates[ROOMS[firstIndexOfRoomType].stayDates[ARRIVAL_DATE].rate.id].dates);

					if ($stateParams.fromState === "rover.reservation.staycard.reservationcard.reservationdetails" || $stateParams.fromState === "STAY_CARD") {
						_.each(ROOMS[roomIndex].stayDates, function(details, date) {
							var rateId = ROOMS[roomIndex].stayDates[date].rate.id,
								roomId = ROOMS[roomIndex].roomTypeId;

							details.rate.id = rateId;
							details.rate.name = $scope.reservationData.ratesMeta[rateId].name;

							var rateAmount = Number(parseFloat($scope.stateCheck.lookUp[roomId].rates[rateId].dates[date].amount).toFixed(2));
							details.rateDetails = {
								actual_amount: rateAmount,
								modified_amount: rateAmount,
								is_discount_allowed: $scope.reservationData.ratesMeta[rateId].is_discount_allowed_on === null ? "false" : $scope.reservationData.ratesMeta[rateId].is_discount_allowed_on.toString(), // API returns true / false as a string ... Hence true in a string to maintain consistency
								is_suppressed: $scope.reservationData.ratesMeta[rateId].is_suppress_rate_on === null ? "false" : $scope.reservationData.ratesMeta[rateId].is_suppress_rate_on.toString()
							}
						});
					}
				}
				transferState();
			}
		};

		$scope.handleBooking = function(roomId, rateId, event, flags) {
			if (!!event) {
				event.stopPropagation();
			}

			// Load Meta Data on the first call to this method if it hasn't been loaded yet
			if ($scope.stateCheck.taxInfo === null) {
				fetchTaxRateAddonMeta(function() {
					$scope.handleBooking(roomId, rateId, event, flags)
				});
			} else {

				$scope.stateCheck.preferredType = parseInt($scope.stateCheck.preferredType, 10) || ""

				/**
				 * Get a list of exhausted addons for the selected rate and id 
				 */

				$scope.stateCheck.exhaustedAddons = [];
				//Check for add onthing
				if (!flags || !flags.skipAddonCheck) {
					$scope.stateCheck.exhaustedAddons = findExhaustedRateAddons(roomId, rateId);
				}

				if ($scope.stateCheck.exhaustedAddons.length > 0) {
					// run through the addon popup routine;
					$scope.stateCheck.selectedRoomRate = {
						roomId: roomId,
						rateId: rateId
					}
					alertAddonOverbooking();
					return false;
				}

				if ($scope.stateCheck.stayDatesMode) {
					// Handle StayDatesMode
					// Disable room type change if stay date mode is true
					if ($scope.stateCheck.preferredType > 0 && roomId !== $scope.stateCheck.preferredType) {
						return false;
					}

					var activeDate = $scope.stateCheck.dateModeActiveDate,
						roomIndex,
						currentRoom;

					if (!$scope.stateCheck.rateSelected.oneDay) {
						/**
						 * The first selected day must be taken as the preferredType
						 * No more selection of rooms must be allowed here
						 */
						$scope.stateCheck.preferredType = parseInt(roomId);
						// Put the selected room as the tab's room type
						TABS[$scope.activeRoom].roomTypeId = $scope.stateCheck.preferredType;

						for (roomIndex = $scope.stateCheck.roomDetails.firstIndex; roomIndex <= $scope.stateCheck.roomDetails.lastIndex; roomIndex++) {
							currentRoom = ROOMS[roomIndex];
							currentRoom.roomTypeId = roomId;
							currentRoom.rateId = [];
							currentRoom.rateId.push(rateId);
							currentRoom.stayDates[$scope.stateCheck.dateModeActiveDate].rate.id = rateId;
							currentRoom.roomTypeName = $scope.reservationData.roomsMeta[roomId].name;
							$scope.reservationData.rateDetails[i] = angular.copy($scope.stateCheck.lookUp[roomId].rates[rateId].dates);
						}
					}

					$scope.stateCheck.selectedStayDate.rate.id = rateId;

					$scope.stateCheck.selectedStayDate.roomType = {
						id: roomId
					}

					// CICO-6079

					var rateAmount = Number(parseFloat($scope.stateCheck.lookUp[roomId].rates[rateId].dates[activeDate].amount).toFixed(2));

					for (roomIndex = $scope.stateCheck.roomDetails.firstIndex; roomIndex <= $scope.stateCheck.roomDetails.lastIndex; roomIndex++) {
						currentRoom = ROOMS[roomIndex];
						currentRoom.stayDates[activeDate].rateDetails = {
							actual_amount: rateAmount,
							modified_amount: rateAmount,
							is_discount_allowed: $scope.reservationData.ratesMeta[rateId].is_discount_allowed_on === null ? "false" : $scope.reservationData.ratesMeta[rateId].is_discount_allowed_on.toString(), // API returns true / false as a string ... Hence true in a string to maintain consistency
							is_suppressed: $scope.reservationData.ratesMeta[rateId].is_suppress_rate_on === null ? "false" : $scope.reservationData.ratesMeta[rateId].is_suppress_rate_on.toString()
						};
						currentRoom.stayDates[activeDate].rate.id = rateId;

						if (!currentRoom.rateId) {
							currentRoom.rateId = [];
						}
						currentRoom.rateId.push(rateId);
					}

					// see if the done button has to be enabled
					$scope.stateCheck.rateSelected.allDays = isRateSelected().allDays;
					$scope.stateCheck.rateSelected.oneDay = isRateSelected().oneDay;

				} else {
					var i,
						roomInfo = $scope.stateCheck.lookUp[roomId],
                        isGroupReservation = !!$scope.reservationData.group.id || !!$scope.reservationData.allotment.id,
						rateInfo = roomInfo.rates[rateId];

					if (!TABS[$scope.activeRoom].roomTypeId || parseInt(TABS[$scope.activeRoom].roomTypeId) !== parseInt(roomId)) {
						TABS[$scope.activeRoom].roomTypeId = parseInt(roomId);
					}
					for (i = $scope.stateCheck.roomDetails.firstIndex; i <= $scope.stateCheck.roomDetails.lastIndex; i++) {

						_.extend(ROOMS[i], {
							roomTypeId: parseInt(roomId),
							roomTypeName: roomInfo.name,
							rateId: rateId,
							isSuppressed: rateInfo.isSuppressed,
							rateName: rateInfo.name,
							rateAvg: rateInfo.adr,
							rateTotal: rateInfo.totalAmount
						});

						$scope.reservationData.rateDetails[i] = angular.copy($scope.stateCheck.lookUp[roomId].rates[rateId].dates);

						populateStayDates(rateId, roomId, i);

						ROOMS[i].demographics.market = $scope.reservationData.ratesMeta[rateId].market_segment_id === null ? "" : $scope.reservationData.ratesMeta[rateId].market_segment_id;
						ROOMS[i].demographics.source = $scope.reservationData.ratesMeta[rateId].source_id === null ? "" : $scope.reservationData.ratesMeta[rateId].source_id;

						if (i === 0) {
							$scope.reservationData.demographics.source = ROOMS[i].demographics.source;
							$scope.reservationData.demographics.market = ROOMS[i].demographics.market;
						}
					}

					// IFF Overbooking Alert is configured to be shown
                    // NOTE: The overbooking house alert is not to be shown for group reservations. CICO-24923

					if ($scope.otherData.showOverbookingAlert && !isGroupReservation) {

						var leastHouseAvailability = $scope.getLeastHouseAvailability(),
							leastRoomTypeAvailability = $scope.getLeastAvailability(roomId, rateId),
							numberOfRooms = TABS[$scope.activeRoom].roomCount;

						if (leastHouseAvailability < 1 ||
							leastRoomTypeAvailability < numberOfRooms) {
							// Show appropriate Popup Here
							$scope.invokeApi(RVReservationBaseSearchSrv.checkOverbooking, {
								from_date: ARRIVAL_DATE,
								to_date: DEPARTURE_DATE,
								group_id: $scope.reservationData.group.id
							}, function(availability) {
								$scope.availabilityData = availability;
								ngDialog.open({
									template: '/assets/partials/reservation/alerts/availabilityCheckOverbookingAlert.html',
									scope: $scope,
									controller: 'overbookingAlertCtrl',
									closeByDocument: false,
									closeByEscape: false,
									data: JSON.stringify({
										houseFull: (leastHouseAvailability < 1),
										roomTypeId: roomId,
										isRoomAvailable: (leastRoomTypeAvailability > 0),
										activeView: function() {
											if (leastHouseAvailability < 1) {
												return 'HOUSE'
											}
											return 'ROOM'
										}(),
										isGroupRate: !!$scope.reservationData.group.id
									})
								});
							});
						} else {
							transferState();
						}
					} else {
						transferState();
					}
				}
			}
		};

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- ADDONS & OVERBOOKING

		$scope.selectAddon = function() {
			alertAddonOverbooking(true);
		};

		$scope.onResetAddonsAcknowledged = function() {
			navigateOut();
			$scope.closeDialog();
		};

		$scope.alertOverbooking = function(close) {
			var timer = 0;
			if (close) {
				$scope.closeDialog();
				timer = 1000
			}
			$timeout(transferState, timer);
		};

		$scope.getLeastAvailability = function(roomId, rateId) {
			// TODO: Make sure that the departure date's availability is not considered while picking up the minimum number
			return _.min(_.pluck(_.toArray($scope.stateCheck.lookUp[roomId].rates[rateId].dates), "availability"));
		}

		$scope.getLeastHouseAvailability = function() {
			var nights = $scope.reservationData.numNights || 1;
			return _.min(_.first(_.toArray($scope.stateCheck.house), nights));
		};

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- ROOMTYPE TAB

		$scope.showAllRooms = function() {
			$scope.stateCheck.showLessRooms = false;
			$scope.refreshScroll();
			$scope.display.roomFirstGrid = [];
			groupByRoomTypes();
		};

		$scope.isRoomTypeSelected = function(roomTypeId) {
			var chosen = false;
			_.each(TABS, function(tabData, index) {
				if (parseInt(tabData.roomTypeId, 10) === roomTypeId && $scope.activeRoom != index) {
					chosen = true;
				}
			});
			return chosen;
		};

		$scope.onRoomTypeChange = function($event) {
			var tabIndex = $scope.viewState.currentTab,
				roomType = parseInt($scope.stateCheck.preferredType, 10) || "",
				roomIndex;

			TABS[tabIndex].roomTypeId = roomType;

			for (roomIndex = $scope.stateCheck.roomDetails.firstIndex; roomIndex <= $scope.stateCheck.roomDetails.lastIndex; roomIndex++) {
				ROOMS[roomIndex].roomTypeId = roomType;
			}
			groupByRoomTypes();
			groupByRates();
			resetRates();
		};

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- RATE TAB

		$scope.changeSelectedRoom = function(rate) {
			rate.selectedRoom = _.find(rate.rooms, {
				id: parseInt(rate.selectedRoomId, 10)
			});

			if (!!rate.showDays) {
				$scope.viewRateBreakUp(rate, true);
			}
		};

		$scope.selectRate = function(selectedRate) {
			$scope.stateCheck.rateFilterText = selectedRate.name;
			_.each($scope.display.rateFirstGrid, function(rate) {
				_.extend(rate, {
					isHidden: true
				});
			});

			_.findWhere($scope.display.rateFirstGrid, {
				id: selectedRate.id
			}).isHidden = false;

			$scope.rateFiltered = true;
			$scope.refreshScroll();
		};

		$scope.hideResults = function() {
			$timeout(function() {
				$scope.isRateFilterActive = false;
			}, 300);
		};

		$scope.filterRates = function() {
			$scope.rateFiltered = false;
			if ($scope.stateCheck.rateFilterText.length > 0) {
				var re = new RegExp($scope.stateCheck.rateFilterText, "gi");
				$scope.filteredRates = $($scope.display.rateFirstGrid).filter(function() {
					return this.name.match(re);
				})
				if ($scope.filteredRates.length) {
					// CICO-11119
					$scope.isRateFilterActive = true;
				}
			} else {
				$scope.filteredRates = [];
				_.each($scope.display.rateFirstGrid, function(rate) {
					_.extend(rate, {
						isHidden: false
					});
				});

			}
			$scope.refreshScroll();
		}

		$scope.$watch('activeCriteria', function() {
			$scope.refreshScroll();
			$scope.stateCheck.rateFilterText = "";
			$scope.filterRates();
		});

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- CALENDAR VIEW

		$scope.toggleCalendar = function() {
			$scope.stateCheck.activeMode = $scope.stateCheck.activeMode === "ROOM_RATE" ? "CALENDAR" : "ROOM_RATE";
			$scope.heading = $scope.stateCheck.activeMode === "ROOM_RATE" ? "Rooms & Rates" : " Rate Calendar";
			$scope.setHeadingTitle($scope.heading);
			$("#rooms-and-rates-header .switch-button").toggleClass("on");
		};

		$scope.toggleSearchWithRestrictions = function() {
			$scope.stateCheck.calendarState.searchWithRestrictions = !$scope.stateCheck.calendarState.searchWithRestrictions;
			$scope.$broadcast('availableRateFiltersUpdated');
		};

		$scope.toggleShowOnlyAvailable = function() {
			$scope.stateCheck.calendarState.showOnlyAvailableRooms = !$scope.stateCheck.calendarState.showOnlyAvailableRooms;
			$scope.$broadcast('availableRateFiltersUpdated');
		};

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- MULTI RESERVATIONS

		$scope.changeActiveRoomType = function(tabIndex) {
			if ($scope.stateCheck.stayDatesMode) {
				return false;
			}
			$scope.activeRoom = tabIndex;
			$scope.stateCheck.preferredType = TABS[$scope.activeRoom].roomTypeId;
			$scope.viewState.currentTab = tabIndex;
			groupByRoomTypes();
			groupByRates();
		};

		$scope.getTabTitle = function(tabIndex) {
			if (tabIndex >= TABS.length) {
				return "INVALID TAB";
			}
			var roomDetail = getTabRoomDetails(tabIndex);
			if (roomDetail.firstIndex === roomDetail.lastIndex) {
				return "ROOM " + (roomDetail.firstIndex + 1);
			}
			return "ROOMS " + (roomDetail.firstIndex + 1) + "-" + (roomDetail.lastIndex + 1);
		};

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- NAVI
		// since we are going back to create reservation screen
		// mark 'isSameCard' as true on '$scope.reservationData'
		$scope.setSameCardNgo = function() {
			$scope.reservationData.isSameCard = true;
			$state.go('rover.reservation.search');
		};

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- EVENT LISTENERS
		var initEventListeners = function() {
			$scope.$on('SIDE_BAR_OCCUPANCY_UPDATE', function() {
				fetchRates();
			});

			$scope.$on('TABS_MODIFIED', function() {
				fetchRates();
			});

            var booobooboo;
			$scope.$on('resetGuestTab', function() {
				// While coming in the guest Id might be retained in reservationData.guest.id in case another reservation is created for the same guest
				$scope.invokeApi(RVReservationBaseSearchSrv.fetchUserMemberships, $scope.reservationDetails.guestCard.id || $scope.reservationData.guest.id, function(data) {
					$scope.$emit('hideLoader');
					$scope.reservationData.guestMemberships = {
						ffp: data.frequentFlyerProgram,
						hlp: data.hotelLoyaltyProgram
					}
					if ($scope.reservationData.member.isSelected && isMembershipValid()) {
						fetchRates();
					} else if ($scope.reservationData.member.isSelected) {
						ngDialog.open({
							template: '/assets/partials/reservation/alerts/rvNotMemberPopup.html',
							className: '',
							scope: $scope,
							closeByDocument: false,
							closeByEscape: false
						});
					}
				});
			});

			// 	CICO-7792 BEGIN
			$scope.$on("cardChanged", function(event, cardIds) {
				$scope.reservationData.company.id = cardIds.companyCard;
				$scope.reservationData.travelAgent.id = cardIds.travelAgent;
				fetchRates();
				// Call the availability API and rerun the init method
			});
			// 	CICO-7792 END

			$scope.$on('switchToStayDatesCalendar', function() {
				$scope.stateCheck.activeMode = $scope.stateCheck.activeMode === "ROOM_RATE" ? "CALENDAR" : "ROOM_RATE";
				$("#rooms-and-rates-header .switch-button").toggleClass("on");
			});
		}

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- END
		$scope.errorMessage = "";
		$scope.$on("FAILURE_UPDATE_RESERVATION", function(e, data) {
            $scope.errorMessage = data;
        });

		initialize();

	}
]);