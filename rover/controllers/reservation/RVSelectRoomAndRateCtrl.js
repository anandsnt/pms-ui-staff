sntRover.controller('RVSelectRoomAndRateCtrl', [
	'$rootScope', '$scope', 'sortOrder', 'areReservationAddonsAvailable', '$stateParams', 'rates', 'ratesMeta', '$timeout', '$state', 'RVReservationBaseSearchSrv', 'RVReservationStateService', 'RVReservationDataService', 'house', 'RVSelectRoomRateSrv', 'rvPermissionSrv', 'ngDialog', 'rateAddons',
	function($rootScope, $scope, sortOrder, areReservationAddonsAvailable, $stateParams, rates, ratesMeta, $timeout, $state, RVReservationBaseSearchSrv, RVReservationStateService, RVReservationDataService, house, RVSelectRoomRateSrv, rvPermissionSrv, ngDialog, rateAddons) {

		$scope.stateCheck = {
			sortOrder: sortOrder.value,
			house: house,
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
			showLessRates: false,
			selectedRoomType: -1,
			addonLookUp: {}
		};

		$scope.display = {
			roomFirstGrid: [],
			rateFirstGrid: []
		};

		$scope.restrictionColorClass = {
			'CLOSED': 'red',
			'CLOSED_ARRIVAL': 'red',
			'CLOSED_DEPARTURE': 'red',
			'MIN_STAY_LENGTH': 'blue',
			'MAX_STAY_LENGTH': 'grey',
			'MIN_STAY_THROUGH': 'purple',
			'MIN_ADV_BOOKING': 'green',
			'MAX_ADV_BOOKING': 'grey',
			'DEPOSIT_REQUESTED': 'grey',
			'CANCEL_PENALTIES': 'grey',
			'LEVELS': 'grey',
			'RATE_NOT_CONFIGURED': 'red'
		};

		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- ***************************
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- PRIVATE METHODS
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- ***************************

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
			getTabRoomDetails = function(roomIndex) {
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
			isRateSelected = function() {
				// Have to check if all the days have rates and enable the DONE button
				var allSelected = {
					allDays: true,
					oneDay: false
				};
				_.each($scope.reservationData.rooms[$scope.activeRoom].stayDates, function(staydateconfig, date) {
					if (staydateconfig.rate.id !== null && staydateconfig.rate.id !== "") {
						allSelected.oneDay = true;
					}
					if (allSelected.allDays && (date !== $scope.reservationData.departureDate) && (staydateconfig.rate.id === null || staydateconfig.rate.id === "")) {
						allSelected.allDays = false;
					}
				});
				return allSelected;
			},
			fetchRates = function() {
				var occupancies = _.pluck($scope.reservationData.rooms[$scope.activeRoom].stayDates, "guests");
				if (occupancies.length > 1) {
					// No need to send last day's occupancy to the rate's API 
					occupancies.splice(-1, 1)
				}
				$scope.invokeApi(RVReservationBaseSearchSrv.fetchRates, {
					from_date: $scope.reservationData.arrivalDate,
					to_date: $scope.reservationData.departureDate,
					company_id: $scope.reservationData.company.id,
					travel_agent_id: $scope.reservationData.travelAgent.id,
					group_id: $scope.reservationData.group.id,
					allotment_id: $scope.reservationData.allotment.id,
					promotion_code: $scope.reservationData.searchPromoCode,
					promotion_id: $scope.reservationData.promotionId,
					override_restrictions: $scope.stateCheck.showClosedRates,
					'adults[]': _.pluck(occupancies, "adults"),
					'children[]': _.pluck(occupancies, "children"),
					'include_expired_promotions': $scope.reservationData.searchPromoCode && $scope.stateCheck.showClosedRates
				}, function(rates) {
					$scope.stateCheck.baseInfo = rates;
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
								name: $scope.reservationData.roomsMeta[currentRoomType].name,
								rates: {},
								availability: null,
								level: $scope.reservationData.roomsMeta[currentRoomType].level
							};
						}

						roomTypes[currentRoomType].rates[currentRate] = {
							name: $scope.reservationData.ratesMeta[currentRate].name,
							id: currentRate,
							adr: 0.0,
							totalAmount: 0.0,
							isSuppressed: false,
							isCorporate: !!rate.isCorporate,
							isGroupRate: !!rate.isGroupRate,
							isAllotmentRate: !!rate.isAllotmentRate,
							dates: {},
							showDays: false,
							numRestrictions: roomType.restriction_count || 0,
							restriction: roomType.first_restriction,
							forRoomType: currentRoomType,
							isPromotion: $scope.reservationData.code &&
								$scope.reservationData.code.id &&
								_.indexOf(ratesMeta[currentRate].linked_promotion_ids, $scope.reservationData.code.id) > -1
						}

						var minHouseAvailability;

						//for every day
						_.each(roomType.dates, function(date, index) {
							if (index < roomType.dates.length - 1) {
								var currentDay = date.date;
								if (minHouseAvailability === undefined) {
									minHouseAvailability = $scope.stateCheck.house[currentDay];
								}
								minHouseAvailability = Math.min(minHouseAvailability, $scope.stateCheck.house[currentDay]);

								roomTypes[currentRoomType].rates[currentRate].totalAmount = parseFloat(roomTypes[currentRoomType].rates[currentRate].totalAmount) +
									date.amount +
									($scope.stateCheck.addonLookUp[currentDay][currentRate] || 0.0);

								roomTypes[currentRoomType].rates[currentRate].dates[currentDay] = {
									obj: new tzIndependentDate(currentDay),
									availability: date.availability,
									amount: date.amount
								}
							}
							// Assign Least Availability on the room level
							roomTypes[currentRoomType].availability = roomTypes[currentRoomType].availability === null ? date.availability : Math.min(roomTypes[currentRoomType].availability, date.availability);
						});

						if (minHouseAvailability < 1) {
							roomTypes[currentRoomType].rates[currentRate].numRestrictions += 1;
							roomTypes[currentRoomType].rates[currentRate].restriction = roomTypes[currentRoomType].rates[currentRate].numRestrictions > 1 ? {
								key: '',
								value: 'MULTIPLE RESTRICTIONS APPLY'
							} : {
								key: '',
								value: 'NO HOUSE AVAILABILITY'
							};
						}

						roomTypes[currentRoomType].rates[currentRate].adr = roomTypes[currentRoomType].rates[currentRate].totalAmount / ($scope.reservationData.numNights || 0);

					});
				});

				// BookKeeping for lookup	
				$scope.stateCheck.lookUp = roomTypes;

				// Sorting
				var roomTypesArray = [];
				_.each(roomTypes, function(roomType) {
					roomType.ratesArray = [];
					_.each(roomType.rates, function(rate) {
						roomType.ratesArray.push(rate);
					});
					// ****************************************************************************************************************** STEP 1a : Sort rates based on the preference
					if ($scope.stateCheck.sortOrder === "HIGH_TO_LOW") {
						roomType.ratesArray.sort(RVReservationDataService.sortRatesDesc);
					} else {
						roomType.ratesArray.sort(RVReservationDataService.sortRatesAsc);
					}
					// ****************************************************************************************************************** STEP 1b : Bring Corporate rates on top

					//[CICO-7792] Bring the corporate rates to the top
					/*  https://stayntouch.atlassian.net/browse/CICO-7792
					 *	If both a Travel Agent and a Company are linked to the reservation,
					 *	both with active, valid contracts,
					 *	display the Company first, then the Travel Agent.
					 */
					if (!!$scope.reservationDetails.companyCard.id || !!$scope.reservationDetails.travelAgent.id) {
						roomType.ratesArray.sort(RVReservationDataService.raiseCorpRates);
					}

					// ****************************************************************************************************************** STEP 1c : Bring Member rates to top
					if (!!$scope.reservationData.member.isSelected) {
						roomType.ratesArray.sort(RVReservationDataService.raiseMemberRates);
					}
					// ****************************************************************************************************************** STEP 1d : Bring Promotion rates to the top
					if (!!$scope.reservationData.code) {
						roomType.ratesArray.sort(RVReservationDataService.raisePromoRates);
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
					//------------------------------------------------------------------- [ sort the rooms on increasing adr and then on the levels ]
					// always list roomtypes within a level in increasing order of their default rates
					// ****************************************************************************************************************** STEP 2a : sort rooms by ascending 'default rate's ADR'
					roomTypesArray.sort(RVReservationDataService.sortRoomTypesAscADR);
					//sort the rooms by levels
					// ****************************************************************************************************************** STEP 2b : sort rooms by ascending 'Levels'
					roomTypesArray.sort(RVReservationDataService.sortRoomTypesAscLevels);
					//CICO-7792 : Bring contracted rates to the top
					// ****************************************************************************************************************** STEP 2c : Bring the roomtypes with contracted rates to top
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
							if ($scope.display.roomFirstGrid.length === 0) {
								$scope.display.roomFirstGrid.push(roomType);
							} else if ($scope.display.roomFirstGrid.length === 1) {
								// ------------------------------------------------------------------- [ as the rooms are in sorted order by now, put the next best room here. This will remain as the next option unless a room in next level is available ]
								$scope.display.roomFirstGrid.push(roomType);
							} else if ($scope.display.roomFirstGrid.length === 2) {
								// ------------------------------------------------------------------- [ as the rooms are in sorted order by now, just put the next level's room here ]
								if (roomType.level > $scope.display.roomFirstGrid[1].level && (roomType.level - $scope.display.roomFirstGrid[0].level < 2)) {
									$scope.display.roomFirstGrid[1] = roomType;
								}
							}
						});
					} else {
						$scope.display.roomFirstGrid = roomTypesArray;
					}
				} else {
					$scope.reservationData.tabs[$scope.activeRoom].roomTypeId = $scope.stateCheck.preferredType;
					// If a room type of category Level1 is selected, show this room type plus the lowest priced room type of the level 2 category.
					// If a room type of category Level2 is selected, show this room type plus the lowest priced room type of the level 3 category.
					// If a room type of category Level3 is selected, only show the selected room type.
					$scope.display.roomFirstGrid = _.filter(roomTypesArray, function(roomType) {
						return roomType.id === parseInt($scope.stateCheck.preferredType, 10) ||
							!$scope.reservationData.group.id && $scope.viewState.identifier === "CREATION" && hasContractedRate(roomType.ratesArray); // In case of group skip this check
					});

					if ($scope.reservationData.tabs.length < 2 && // Not showing other room types in case of multiple reservations
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
								isCorporate: rate.isCorporate,
								isGroupRate: rate.isGroupRate,
								isAllotmentRate: rate.isAllotmentRate
							};
						}
						rates[rate.id].rooms.push({
							id: room.id,
							name: room.name,
							adr: rate.adr,
							dates: rate.dates,
							availability: room.availability
						});
					})
				});

				// Make the first room as the selected room ! Note this has to change later
				_.each(rates, function(rate) {
					if (rate.rooms) {
						_.each(rate.rooms, function(room) {
							if (!rate.selectedRoom) {
								rate.selectedRoom = room;
								rate.selectedRoomId = room.id;
							}
						});
					}
				});

				$scope.display.rateFirstGrid = rates;
				$scope.refreshScroll();
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
			initialize = function() {
				$scope.activeRoom = $scope.viewState.currentTab;
				$scope.stateCheck.preferredType = $scope.reservationData.tabs[$scope.activeRoom].roomTypeId;

				if (!!$scope.reservationData.group.id) {
					var customRate = RVReservationStateService.getCustomRateModel($scope.reservationData.group.id, $scope.reservationData.group.name, 'GROUP');
					ratesMeta[customRate.id] = customRate;
				};

				if (!!$scope.reservationData.allotment.id) {
					var customRate = RVReservationStateService.getCustomRateModel($scope.reservationData.allotment.id, $scope.reservationData.allotment.name, 'ALLOTMENT');
					ratesMeta[customRate.id] = customRate;
				};

				$scope.reservationData.ratesMeta = ratesMeta;

				$scope.stateCheck.roomDetails = getCurrentRoomDetails();
				// activate room type default view based on reservation settings
				if ($scope.otherData.defaultRateDisplayName === 'Recommended') {
					$scope.stateCheck.activeView = "RECOMMENDED";
				} else if ($scope.otherData.defaultRateDisplayName === 'By Rate') {
					$scope.stateCheck.activeView = "RATE";
				} else {
					// By default RoomType
					$scope.stateCheck.activeView = "ROOM_TYPE";
				}

				$scope.stateCheck.addonLookUp = RVReservationStateService.getAddonAmounts(rateAddons, $scope.reservationData.arrivalDate, $scope.reservationData.departureDate, $scope.reservationData.rooms[$scope.activeRoom].stayDates);

				groupByRoomTypes();
				groupByRates();

				//--
				if (!$scope.stateCheck.dateModeActiveDate) {
					var arrival = $scope.reservationData.arrivalDate;
					if ($scope.reservationData.midStay) {
						// checking if midstay and handling the expiry condition
						if (new tzIndependentDate($scope.reservationData.departureDate) > new tzIndependentDate($rootScope.businessDate)) {
							$scope.stateCheck.dateModeActiveDate = $rootScope.businessDate;
							$scope.stateCheck.selectedStayDate = $scope.reservationData.rooms[$scope.stateCheck.roomDetails.firstIndex].stayDates[$rootScope.businessDate];
						} else {
							$scope.stateCheck.dateModeActiveDate = arrival;
							$scope.stateCheck.selectedStayDate = $scope.reservationData.rooms[$scope.stateCheck.roomDetails.firstIndex].stayDates[arrival];
						}
					} else {
						$scope.stateCheck.dateModeActiveDate = arrival;
						$scope.stateCheck.selectedStayDate = $scope.reservationData.rooms[$scope.stateCheck.roomDetails.firstIndex].stayDates[arrival];
					}
				}

				//--
				initScrollers();
			},
			/**
			 * [findExhaustedRateAddons description]
			 * @param  {[type]} roomId [description]
			 * @param  {[type]} rateId [description]
			 * @return {[type]}        [description]
			 */
			findExhaustedRateAddons = function(roomId, rateId) {

				var arrival = $scope.reservationData.arrivalDate,
					departure = $scope.reservationData.departureDate,
					exhaustedRateAddons = [],
					updateExhaustedAddonsList = function(addon) {
						// Need to see the applicable count based on the amount_type
						var applicableCount = RVReservationStateService.getApplicableAddonsCount(
							addon.amountType,
							addon.postType,
							parseInt(addon.postFrequency, 10),
							parseInt($scope.reservationData.tabs[$scope.viewState.currentTab].numAdults, 10),
							parseInt($scope.reservationData.tabs[$scope.viewState.currentTab].numChildren, 10),
							parseInt($scope.reservationData.numNights, 10)
						) * parseInt($scope.reservationData.tabs[$scope.viewState.currentTab].roomCount, 10);


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
						if (forDate === arrival || forDate !== departure) {
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
			/**
			 * [alertAddonOverbooking description]
			 * @param  {[type]} close [description]
			 * @return {[type]}       [description]
			 */
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
					from_date: $scope.reservationData.arrivalDate,
					to_date: $scope.reservationData.departureDate
				}, function(response) {
					$scope.stateCheck.taxInfo = true;
					RVReservationStateService.metaData.taxDetails = angular.copy(response);
					RVReservationStateService.metaData.rateAddons = angular.copy(rateAddons); // the rate addons are resolved when we come inside this screen
					callback();
					$scope.$emit('hideLoader');
				});
			},
			/**
			 * [haveAddonsChanged description]
			 * @param  {[type]} entireSet        [description]
			 * @param  {[type]} associatedAddons [description]
			 * @return {[type]}                  [description]
			 */
			haveAddonsChanged = function(entireSet, associatedAddons) {
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
			/**
			 * [transferState description]
			 * @return {[type]} [description]
			 */
			transferState = function() {
				// Check if there has been a rateChange
				if (!!RVReservationStateService.bookMark.lastPostedRate) {
					// Identify if there are extra addons added other than those of the associated rate's
					var firstRoom = $scope.reservationData.rooms[0],
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
			/**
			 * [populateStayDates description]
			 * @param  {[type]} rateId    [description]
			 * @param  {[type]} roomId    [description]
			 * @param  {[type]} roomIndex [description]
			 * @return {[type]}           [description]
			 */
			populateStayDates = function(rateId, roomId, roomIndex) {
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
			};;

		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- ***************************
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- PUBLIC METHODS
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- ***************************

		$scope.refreshScroll = function() {
			$timeout(function() {
				$scope.refreshScroller('room_types');
			}, 100);
		};

		$scope.getBookButtonStyle = function(roomId, rateId) {
			if (!$scope.stateCheck.stayDatesMode) {
				return 'green'
			} else { //Staydates mode
				return 'white green-text'
			}
		};

		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- PERMISSIONS

		$scope.restrictIfOverbook = function(roomId, rateId) {
			var canOverbookHouse = rvPermissionSrv.getPermissionValue('OVERBOOK_HOUSE'),
				canOverbookRoomType = rvPermissionSrv.getPermissionValue('OVERBOOK_ROOM_TYPE');

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
		};

		$scope.getAllRestrictions = function(roomId, rateId) {
			var restrictions = [];
			return restrictions;
		};

		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- RESTRICTIONS
		$scope.toggleClosedRates = function() {
			$scope.stateCheck.showClosedRates = !$scope.stateCheck.showClosedRates;
			fetchRates();
		};

		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- STAY DATES MODE
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
		};

		$scope.showStayDateDetails = function(selectedDate) {
			// by pass departure stay date from stay dates manipulation
			if (selectedDate === $scope.reservationData.departureDate) {
				return false;
			}
			$scope.stateCheck.dateModeActiveDate = selectedDate;
			$scope.stateCheck.selectedStayDate = $scope.reservationData.rooms[$scope.stateCheck.roomDetails.firstIndex].stayDates[selectedDate];
		};


		$scope.toggleEditGuestOptions = function() {
			$scope.stateCheck.guestOptionsIsEditable = !$scope.stateCheck.guestOptionsIsEditable;
		}


		$scope.updateDayOccupancy = function(occupants) {
			$scope.reservationData.rooms[$scope.stateCheck.roomDetails.firstIndex].stayDates[$scope.stateCheck.dateModeActiveDate].guests[occupants] =
				parseInt($scope.stateCheck.selectedStayDate.guests[occupants]);
			/**
			 * CICO-8504
			 * In case of multiple rates selected, the side bar and the reservation summary need to showcase the first date's occupancy!
			 *
			 */
			if ($scope.reservationData.arrivalDate === $scope.stateCheck.dateModeActiveDate) {
				var occupancy = $scope.reservationData.rooms[$scope.stateCheck.roomDetails.firstIndex].stayDates[$scope.stateCheck.dateModeActiveDate].guests,
					roomIndex = $scope.stateCheck.roomDetails.firstIndex;
				for (; roomIndex <= $scope.stateCheck.roomDetails.lastIndex; roomIndex++) {
					$scope.reservationData.rooms[roomIndex].numAdults = occupancy.adults;
					$scope.reservationData.rooms[roomIndex].numChildren = occupancy.children;
					$scope.reservationData.rooms[roomIndex].numInfants = occupancy.infants;
				}
			}

			if (!$scope.checkOccupancyLimit($scope.stateCheck.dateModeActiveDate)) {
				$scope.preferredType = "";
				// TODO : Reset other stuff as well
				$scope.stateCheck.rateSelected.oneDay = false;
				$scope.stateCheck.rateSelected.allDays = false;
				var roomIndex = $scope.stateCheck.roomDetails.firstIndex;
				for (; roomIndex <= $scope.stateCheck.roomDetails.lastIndex; roomIndex++) {
					_.each($scope.reservationData.rooms[roomIndex].stayDates, function(stayDate) {
						stayDate.rate = {
							id: ""
						};
					});
				}
			};
			fetchRates();
		};


		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- COMPUTE TAX AND DAY BREAKUP

		/**
		 * [viewRateBreakUp description]
		 * @param  {[type]} rate       [description]
		 * @param  {[type]} updateOnly [description]
		 * @return {[type]}            [description]
		 */
		$scope.viewRateBreakUp = function(rate, updateOnly) {

			var computeDetails = function() {
				$scope.invokeApi(RVSelectRoomRateSrv.getRestrictions, {
					from_date: $scope.reservationData.arrivalDate,
					to_date: $scope.reservationData.departureDate,
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
								$scope.reservationData.rooms[$scope.activeRoom].stayDates[date].guests.adults,
								$scope.reservationData.rooms[$scope.activeRoom].stayDates[date].guests.children,
								$scope.reservationData.arrivalDate,
								$scope.reservationData.departureDate,
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
					$scope.refreshScroller();
				});
			} else {
				if (!rate.showDays) {
					// TODO: Do this IFF this hasn't been done before
					computeDetails();
				}
				rate.showDays = !rate.showDays;
				$scope.refreshScroller();
			}
		};

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- BOOKING

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
					if (RVReservationDataService.isVaryingRates($scope.reservationData.rooms[firstIndexOfRoomType].stayDates, $scope.reservationData.arrivalDate, $scope.reservationData.departureDate, $scope.reservationData.numNights)) {
						$scope.reservationData.rooms[roomIndex].rateName = "Multiple Rates Selected";
					} else {
						$scope.reservationData.rooms[roomIndex].rateName = $scope.displayData.allRates[$scope.reservationData.rooms[firstIndexOfRoomType].stayDates[$scope.reservationData.arrivalDate].rate.id].name;
					}

					$scope.reservationData.rateDetails[roomIndex] = angular.copy($scope.stateCheck.lookUp[$scope.reservationData.rooms[roomIndex].roomTypeId].rates[$scope.reservationData.rooms[firstIndexOfRoomType].stayDates[$scope.reservationData.arrivalDate].rate.id].dates);

					if ($stateParams.fromState === "rover.reservation.staycard.reservationcard.reservationdetails" || $stateParams.fromState === "STAY_CARD") {
						_.each($scope.reservationData.rooms[roomIndex].stayDates, function(details, date) {
							var rateId = $scope.reservationData.rooms[roomIndex].stayDates[date].rate.id,
								roomId = $scope.reservationData.rooms[roomIndex].roomTypeId;

							details.rate.id = rateId;
							details.rate.name = $scope.displayData.allRates[rateId].name;

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
				navigateOut();
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
						$scope.reservationData.tabs[$scope.activeRoom].roomTypeId = $scope.stateCheck.preferredType;

						for (roomIndex = $scope.stateCheck.roomDetails.firstIndex; roomIndex <= $scope.stateCheck.roomDetails.lastIndex; roomIndex++) {
							currentRoom = $scope.reservationData.rooms[roomIndex];
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
						currentRoom = $scope.reservationData.rooms[roomIndex];
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

						$scope.reservationData.rateDetails[i] = angular.copy($scope.stateCheck.lookUp[roomId].rates[rateId].dates);

						populateStayDates(rateId, roomId, i);
					}

					// IFF Overbooking Alert is configured to be shown
					if ($scope.otherData.showOverbookingAlert) {

						var leastHouseAvailability = $scope.getLeastHouseAvailability(roomId, rateId),
							leastRoomTypeAvailability = $scope.getLeastAvailability(roomId, rateId),
							numberOfRooms = $scope.reservationData.tabs[$scope.activeRoom].roomCount;

						if (leastHouseAvailability < 1 ||
							leastRoomTypeAvailability < numberOfRooms) {
							// Show appropriate Popup Here
							$scope.invokeApi(RVReservationBaseSearchSrv.checkOverbooking, {
								from_date: $scope.reservationData.arrivalDate,
								to_date: $scope.reservationData.departureDate,
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

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- ADDONS & OVERBOOKING

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
			return _.min(_.pluck(_.toArray($scope.stateCheck.lookUp[roomId].rates[rateId].dates), "availability"));
		}

		$scope.getLeastHouseAvailability = function() {
			return _.min(_.toArray($scope.stateCheck.house));
		};

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- ROOMTYPE TAB

		$scope.showAllRooms = function() {
			$scope.stateCheck.showLessRooms = false;
			$scope.refreshScroll();
			$scope.display.roomFirstGrid = [];
			groupByRoomTypes();
		};

		$scope.isRoomTypeSelected = function(roomTypeId) {
			var chosen = false;
			_.each($scope.reservationData.tabs, function(tabData, index) {
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

			$scope.reservationData.tabs[tabIndex].roomTypeId = roomType;

			for (roomIndex = $scope.stateCheck.roomDetails.firstIndex; roomIndex <= $scope.stateCheck.roomDetails.lastIndex; roomIndex++) {
				$scope.reservationData.rooms[roomIndex].roomTypeId = roomType;
			}
			groupByRoomTypes();
			groupByRates();
		};

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- RATE TAB

		/**
		 * Hande selection of room  in rate view
		 * @param  {[type]} rate [description]
		 * @return {[type]}      [description]
		 */
		$scope.changeSelectedRoom = function(rate) {
			rate.selectedRoom = _.find(rate.rooms, {
				id: parseInt(rate.selectedRoomId, 10)
			});

			if (!!rate.showDays) {
				$scope.viewRateBreakUp(rate, true);
			}
		};

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- CALENDAR VIEW

		/**
		 * Toggle between ROOM_RATE & CALENDAR views
		 * @return {[type]} [description]
		 */
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

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- MULTI RESERVATIONS

		$scope.changeActiveRoomType = function(tabIndex) {
			if ($scope.stateCheck.stayDatesMode) {
				return false;
			}
			$scope.activeRoom = tabIndex;
			$scope.stateCheck.preferredType = $scope.reservationData.tabs[$scope.activeRoom].roomTypeId;
			$scope.viewState.currentTab = tabIndex;
			groupByRoomTypes();
			groupByRates();
		};

		$scope.getTabTitle = function(tabIndex) {
			if (tabIndex >= $scope.reservationData.tabs.length) {
				return "INVALID TAB";
			}
			var roomDetail = getTabRoomDetails(tabIndex);
			if (roomDetail.firstIndex === roomDetail.lastIndex) {
				return "ROOM " + (roomDetail.firstIndex + 1);
			}
			return "ROOMS " + (roomDetail.firstIndex + 1) + "-" + (roomDetail.lastIndex + 1);
		};

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- END

		initialize();

	}
]);