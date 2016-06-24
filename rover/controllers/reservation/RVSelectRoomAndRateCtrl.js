sntRover.controller('RVSelectRoomAndRateCtrl', [
	'$rootScope', '$scope', 'areReservationAddonsAvailable', '$stateParams', 'rates', 'ratesMeta', '$timeout', '$state', 'RVReservationBaseSearchSrv', 'RVReservationStateService', 'RVReservationDataService', 'house', 'RVSelectRoomRateSrv', 'rvPermissionSrv', 'ngDialog', '$filter', 'RVRoomRatesSrv', 'rvGroupConfigurationSrv',
	function($rootScope, $scope, areReservationAddonsAvailable, $stateParams, rates, ratesMeta, $timeout, $state, RVReservationBaseSearchSrv, RVReservationStateService, RVReservationDataService, house, RVSelectRoomRateSrv, rvPermissionSrv, ngDialog, $filter, RVRoomRatesSrv, rvGroupConfigurationSrv) {

		$scope.borrowForGroups = $stateParams.borrow_for_groups === 'true' ? true : false;

		$scope.stateCheck = {
			pagination: {
				roomType: {
					perPage: 25,
					page: 1,
					ratesList: {
						perPage: 25
					}
				},
				rate: {
					perPage: 25,
					page: 1,
					roomsList: {
						perPage: 25
					}
				}
			},
			house: house, //house availability
			baseInfo: {
				roomTypes: [],
				totalCount: rates.total_count,
				rates: [],
				maxAvblRates: rates.total_count
			},
			activeMode: $stateParams.view && $stateParams.view === 'CALENDAR' ? 'CALENDAR' : 'ROOM_RATE',
			activeView: '', // RECOMMENDED, ROOM_TYPE and RATE
			stayDatesMode: false,
			calendarState: {
				showOnlyAvailableRooms: true,
				searchWithRestrictions: true,
				calendarType: 'BEST_AVAILABLE'
			},
			roomDetails: {},
			preferredType: '',
			taxInfo: null,
			showClosedRates: false,
			rateSelected: {
				allDays: false,
				oneDay: false
			},
			selectedStayDate: '',
			dateModeActiveDate: '',
			dateButtonContainerWidth: $scope.reservationData.stayDays.length * 80,
			guestOptionsIsEditable: false,
			exhaustedAddons: [],
			showLessRooms: !$stateParams.room_type_id,
			maxRoomsToShow: 0,
			selectedRoomType: -1,
			stayDates: {}
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
			DEPARTURE_DATE = $scope.reservationData.departureDate,
			scrollPosition = 0;

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- ***************************
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- PRIVATE METHODS
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- ***************************

		var getScrollerObject = function(key) {
				var scrollerObject = $scope.$parent.myScroll && $scope.$parent.myScroll[key];
				if (_.isUndefined(scrollerObject)) {
					scrollerObject = $scope.myScroll[key];
				}
				return scrollerObject;
			},
			isMembershipValid = function() {
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

				_.each(ROOMS[$scope.stateCheck.roomDetails.firstIndex].stayDates, function(dateInfo, currDate) {
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
				var currentRoomTypeId = parseInt(TABS[roomIndex].roomTypeId, 10) || '',
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
				_.each(ROOMS[$scope.stateCheck.roomDetails.firstIndex].stayDates, function(dateConfig, date) {
					if (!!dateConfig.rate.id) {
						allSelected.oneDay = true;
					}
					if (allSelected.allDays && (date !== DEPARTURE_DATE) && !dateConfig.rate.id) {
						allSelected.allDays = false;
					}
				});
				return allSelected;
			},
			getRoomsADR = function(cb, forRate, page) {
				var occupancies = _.pluck(ROOMS[$scope.stateCheck.roomDetails.firstIndex].stayDates, 'guests');
				if (occupancies.length > 1) {
					// No need to send last day's occupancy to the rate's API
					occupancies.splice(-1, 1);
				}


				var payLoad = {
					from_date: ARRIVAL_DATE,
					to_date: DEPARTURE_DATE,
					company_id: ($scope.stateCheck.activeView == 'RECOMMENDED') ? $scope.reservationData.company.id: "",
					travel_agent_id: ($scope.stateCheck.activeView == 'RECOMMENDED') ? $scope.reservationData.travelAgent.id : "",
					group_id: $scope.reservationData.group.id || $scope.reservationData.allotment.id,
					promotion_code: ($scope.stateCheck.activeView == 'RECOMMENDED') ? $scope.reservationData.searchPromoCode : "",
					promotion_id: ($scope.stateCheck.activeView == 'RECOMMENDED') ? $scope.reservationData.promotionId : "",
					override_restrictions: $scope.stateCheck.showClosedRates,
					adults: occupancies[0].adults,
					children: occupancies[0].children,
					include_expired_promotions: !!$scope.reservationData.promotionId && $scope.stateCheck.showClosedRates,
					per_page: $scope.stateCheck.pagination.rate.roomsList.perPage,
					page: page,
					is_member: ($scope.stateCheck.activeView == 'RECOMMENDED') ? !!$scope.reservationData.member.isSelected: ""
				};

				if ($scope.stateCheck.stayDatesMode) {
					var dayOccupancy = ROOMS[$scope.stateCheck.roomDetails.firstIndex].stayDates[$scope.stateCheck.dateModeActiveDate].guests;
					payLoad['restrictions_on_date'] = $scope.stateCheck.dateModeActiveDate;
					payLoad.adults = dayOccupancy.adults;
					payLoad.children = dayOccupancy.children;
					if ($scope.stateCheck.rateSelected.oneDay) {
						payLoad.room_type_id = $scope.stateCheck.preferredType;
						payLoad.per_page = 1;
						payLoad.page = 1;
					}
				}

				if ($scope.stateCheck.activeView === "RATE") {
					payLoad.order = "LOW_TO_HIGH";
				} else if ($scope.stateCheck.activeView === "ROOM_TYPE") {
					payLoad.order = "ROOM_LEVEL"
				}

				if (!!$scope.stateCheck.preferredType) {
					payLoad['room_type_id'] = $scope.stateCheck.preferredType;
				}
				// if (forRate) {
				// 	//To fix issue when clicks on each rate in recommended or rate tab - issue only for custom group
				// 	//No need to pass these values along with rate id
				// 	//CICO-30723
				if (forRate) {
					if(typeof forRate !== "string"){
						payLoad['rate_id'] = forRate;
					}
				}


				// }

				$scope.callAPI(RVRoomRatesSrv.fetchRoomTypeADRs, {
					params: payLoad,
					successCallBack: cb
				});
			},
			fetchRoomTypesList = function(append) {
				if (!append) {
					$scope.stateCheck.pagination.roomType.page = 1;
				}
				var occupancies = _.pluck(ROOMS[$scope.stateCheck.roomDetails.firstIndex].stayDates, 'guests');
				if (occupancies.length > 1) {
					// No need to send last day's occupancy to the rate's API
					occupancies.splice(-1, 1);
				}

				var payLoad = {
					from_date: ARRIVAL_DATE,
					to_date: DEPARTURE_DATE,
					//CICO-28657 Removed all params - company id, grp id, tr ag id, etc
					group_id: $scope.reservationData.group.id || $scope.reservationData.allotment.id,
					override_restrictions: $scope.stateCheck.showClosedRates,
					adults: occupancies[0].adults,
					children: occupancies[0].children,
					include_expired_promotions: !!$scope.reservationData.promotionId && $scope.stateCheck.showClosedRates,
					per_page: $scope.stateCheck.pagination.roomType.perPage,
					page: $scope.stateCheck.pagination.roomType.page,
					is_member: !!$scope.reservationData.member.isSelected
				};

				if ($scope.stateCheck.stayDatesMode) {
					var dayOccupancy = ROOMS[$scope.stateCheck.roomDetails.firstIndex].stayDates[$scope.stateCheck.dateModeActiveDate].guests;
					payLoad['restrictions_on_date'] = $scope.stateCheck.dateModeActiveDate;
					payLoad.adults = dayOccupancy.adults;
					payLoad.children = dayOccupancy.children;
					if ($scope.stateCheck.rateSelected.oneDay) {
						payLoad.room_type_id = $scope.stateCheck.preferredType;
						payLoad.per_page = 1;
						payLoad.page = 1;
					}
				}

				if (!!$scope.stateCheck.preferredType) {
					payLoad['room_type_id'] = $scope.stateCheck.preferredType;
				}

				if ($scope.stateCheck.activeView === "ROOM_TYPE") {
					payLoad.order = "ROOM_LEVEL"
				}

				$scope.invokeApi(RVRoomRatesSrv.fetchRoomTypeADRs, payLoad, function(response) {
					if (append) {
						$scope.stateCheck.baseInfo.roomTypes = $scope.stateCheck.baseInfo.roomTypes.concat(response.results);
					} else {
						$scope.stateCheck.baseInfo.totalCount = response.total_count;
						$scope.stateCheck.baseInfo.roomTypes = response.results;
					}

					generateRoomTypeGrid();
					$scope.stateCheck.showLessRooms = false;
					$scope.$emit('hideLoader');
				});
			},
			updateMetaInfoWithCustomRates = function() {
				var customRate;

				if (!!$scope.reservationData.group.id) {
					customRate = RVReservationStateService.getCustomRateModel($scope.reservationData.group.id, $scope.reservationData
						.group.name, 'GROUP');
					if(!!ratesMeta.customRates.custom_group_taxes) {
						customRate.taxes = ratesMeta.customRates.custom_group_taxes;
					}
					$scope.reservationData.ratesMeta[customRate.id] = customRate;
				};

				if (!!$scope.reservationData.allotment.id) {
					customRate = RVReservationStateService.getCustomRateModel($scope.reservationData.allotment.id, $scope.reservationData
						.allotment.name, 'ALLOTMENT');
					$scope.reservationData.ratesMeta[customRate.id] = customRate;
				};
			},
			fetchRatesList = function(roomTypeId, rateId, page, cb) {
				var occupancies = _.pluck(ROOMS[$scope.stateCheck.roomDetails.firstIndex].stayDates, 'guests');

				var payLoad = {
					page: page,
					from_date: ARRIVAL_DATE,
					to_date: DEPARTURE_DATE,
					room_type_id: roomTypeId,
					rate_id: rateId,
					group_id: $scope.reservationData.group.id || $scope.reservationData.allotment.id,
					override_restrictions: $scope.stateCheck.showClosedRates,
					adults: occupancies[0].adults,
					children: occupancies[0].children,
					include_expired_promotions: !!$scope.reservationData.promotionId && $scope.stateCheck.showClosedRates

				};

				if ($scope.stateCheck.stayDatesMode) {
					var dayOccupancy = ROOMS[$scope.stateCheck.roomDetails.firstIndex].stayDates[$scope.stateCheck.dateModeActiveDate].guests;
					payLoad['restrictions_on_date'] = $scope.stateCheck.dateModeActiveDate;
					payLoad.adults = dayOccupancy.adults;
					payLoad.children = dayOccupancy.children;
				};

				if ($scope.stateCheck.activeView === 'ROOM_TYPE') {
					payLoad.per_page = $scope.stateCheck.pagination.roomType.ratesList.perPage;
				} else if ($scope.stateCheck.activeView === 'RATE') {
					payLoad.per_page = $scope.stateCheck.pagination.rate.perPage;
					payLoad.order = "ALPHABETICAL";
					if (!!$scope.stateCheck.preferredType && !roomTypeId) {
						payLoad.room_type_id = $scope.stateCheck.preferredType;
					}
				}
				//Add these params to API - only in Reccommended tab. CICO-28657
				if($scope.stateCheck.activeView === 'RECOMMENDED'){

					payLoad.company_id = $stateParams.company_id;
					payLoad.travel_agent_id = $stateParams.travel_agent_id;
					payLoad.group_id = $stateParams.group_id || $stateParams.allotment_id;
					payLoad.promotion_code = $stateParams.promotion_code;
					payLoad.is_member = !!$scope.reservationData.member.isSelected;
					payLoad.promotion_id = $scope.reservationData.promotionId;
				}

				$scope.callAPI(RVRoomRatesSrv.fetchRateADRs, {
					params: payLoad,
					successCallBack: cb
				});
			},
			generateRoomTypeGrid = function() {
				$scope.display.roomFirstGrid = [];

				if (!$scope.stateCheck.preferredType) {
					$scope.stateCheck.selectedRoomType = -1;
				}

				_.each($scope.stateCheck.baseInfo.roomTypes, function(roomType) {
					// var proccesedRestrictions = processRestrictions(roomType.first_restriction, roomType.multiple_restrictions, roomType.rate_id),
					// 	datesInitial = RVReservationDataService.getDatesModel(ARRIVAL_DATE, DEPARTURE_DATE);
					var proccesedRestrictions = processRestrictions( roomType.multiple_restrictions, roomType.rate_id),
						datesInitial = RVReservationDataService.getDatesModel(ARRIVAL_DATE, DEPARTURE_DATE);

					if (!$scope.reservationData.ratesMeta[roomType.rate_id]) {
						// -- Note: This should optimally come inside this condition only if a group/allotment is added in the Room & Rates screen. Else this would have been done in initialization itself.
						updateMetaInfoWithCustomRates();
					}

					var isGroupRate = ($scope.stateCheck.activeView == 'RECOMMENDED' && $scope.reservationData.group.id) ? !!$scope.reservationData.group.id : false;
					//var isAllotmentRate = ($scope.stateCheck.activeView == 'RECOMMENDED' && $scope.reservationData.allotment.id) ? !!$scope.reservationData.allotment.id : false;
					var isCorporate = ($scope.stateCheck.activeView == 'RECOMMENDED' && $scope.reservationData.ratesMeta[roomType.rate_id].account_id) ? !!$scope.reservationData.ratesMeta[roomType.rate_id].account_id : false;
					var isSuppressed = ($scope.stateCheck.activeView == 'RECOMMENDED' && $scope.reservationData.ratesMeta[roomType.rate_id].is_suppress_rate_on) ? !!$scope.reservationData.ratesMeta[roomType.rate_id].is_suppress_rate_on : false;
					var isMember = ($scope.stateCheck.activeView == 'RECOMMENDED' && $scope.reservationData.member.isSelected && $scope.reservationData.ratesMeta[roomType.rate_id].is_member) ? !!$scope.reservationData.member.isSelected && $scope.reservationData.ratesMeta[roomType.rate_id].is_member : false;
					var isPromotion = ($scope.stateCheck.activeView == 'RECOMMENDED' && !proccesedRestrictions.isPromoInvalid &&
								_.indexOf($scope.reservationData.ratesMeta[roomType.rate_id].linked_promotion_ids, $scope.reservationData.code
									.id) > -1) ? !proccesedRestrictions.isPromoInvalid &&
								_.indexOf($scope.reservationData.ratesMeta[roomType.rate_id].linked_promotion_ids, $scope.reservationData.code
									.id) > -1: false;


					_.each(roomType.restrictions, function(restrictionObject) {
					   var restrictionKey = restrictionObject.restriction_type_id;
					   restrictionObject.restrictionBgClass = "bg-"+getRestrictionClass(ratesMeta.restrictions[restrictionKey].key);
					 //  restrictionObject.restrictionBgColor = getRestrictionClass(ratesMeta.restrictions[restrictionKey].key);
					   restrictionObject.restrictionIcon = getRestrictionIcon(ratesMeta.restrictions[restrictionKey].key);
					})
					var restrictionsLength = (typeof roomType.restrictions!=="undefined") ? roomType.restrictions.length : 0;
					var roomTypeInfo = {
							isCollapsed: $scope.stateCheck.selectedRoomType != roomType.id,
							name: $scope.reservationData.roomsMeta[roomType.id].name,
							id: roomType.id,
							ratesArray: [],
							availability: roomType.availability
						},
					//Assigning 'restriction' to new param 'bestAvailableRateRestrictions' - since issue when colapse each room type
					//CICO-29156

						rateInfo = {
							id: roomType.rate_id,
							name: $scope.reservationData.ratesMeta[roomType.rate_id].name,
							adr: roomType.adr,
							dates: angular.copy(datesInitial),
							bestAvailableRateRestrictions: roomType.restrictions,
							numRestrictions: restrictionsLength,
							forRoomType: roomType.id,
							buttonClass: getBookButtonStyle(restrictionsLength, roomType.rate_id, roomType.availability),
							showDays: false,
							totalAmount: 0.0,
							isCorporate: isCorporate,
							isGroupRate: isGroupRate,
							isSuppressed: isSuppressed,
							isMember: isMember,
							isPromotion: isPromotion
						},
						rates = {};


					// _.extend(roomTypeInfo.ratesArray[0].dates[$scope.reservationData.arrivalDate], {
					// 	availability: roomType.availability
					// });
					_.extend(rateInfo.dates[$scope.reservationData.arrivalDate], {
						availability: roomType.availability
					});
					roomTypeInfo.ratesArray.push(rateInfo);
					roomTypeInfo.defaultRate = roomTypeInfo.ratesArray[0];
					$scope.display.roomFirstGrid.push(roomTypeInfo);
				});
				$scope.refreshScroll();
			},
			generateRatesGrid = function(ratesSet, append) {
				if (!append) {
					$scope.display.rateFirstGrid = [];
				}
				_.each(ratesSet, function(rate) {
					//CICO-28657 - SHOW these rates only in Recommended tab
					var isGroupRate = ($scope.stateCheck.activeView == 'RECOMMENDED' && $scope.reservationData.group.id) ? !!$scope.reservationData.group.id : false;
					var isAllotmentRate = ($scope.stateCheck.activeView == 'RECOMMENDED' && $scope.reservationData.allotment.id) ? !!$scope.reservationData.allotment.id : false;
					var isCorporate = ($scope.stateCheck.activeView == 'RECOMMENDED' && $scope.reservationData.ratesMeta[rate.id].account_id) ? !!$scope.reservationData.ratesMeta[rate.id].account_id : false;
					var isSuppressed = ($scope.reservationData.ratesMeta[rate.id].is_suppress_rate_on) ? !!$scope.reservationData.ratesMeta[rate.id].is_suppress_rate_on : false;
					var isMember = ($scope.stateCheck.activeView == 'RECOMMENDED' && $scope.reservationData.member.isSelected && $scope.reservationData.ratesMeta[rate.id].is_member) ? !!$scope.reservationData.member.isSelected && $scope.reservationData.ratesMeta[rate.id].is_member : false;
					var isPromotion = ($scope.stateCheck.activeView == 'RECOMMENDED' && _.indexOf($scope.reservationData.ratesMeta[rate.id].linked_promotion_ids, $scope.reservationData.code.id) > -1) ? _.indexOf($scope.reservationData.ratesMeta[rate.id].linked_promotion_ids, $scope.reservationData.code.id) > -1 : false;

					_.each(rate.restrictions, function(restrictionObject) {
					   var restrictionKey = restrictionObject.restriction_type_id;
					   restrictionObject.restrictionBgClass = "bg-"+getRestrictionClass(ratesMeta.restrictions[restrictionKey].key);
					  // restrictionObject.restrictionBgColor = getRestrictionClass(ratesMeta.restrictions[restrictionKey].key);
					   restrictionObject.restrictionIcon = getRestrictionIcon(ratesMeta.restrictions[restrictionKey].key);
					});

					var proccesedRestrictions = processRestrictions(rate.multiple_restrictions, rate.id),


						rateInfo = {
							isCollapsed: true,
							name: $scope.reservationData.ratesMeta[rate.id].name,
							id: rate.id,
							defaultRoomTypeId: rate.room_type_id,
							defaultADR: rate.adr,
							rooms: [],
							restriction : rate.restrictions,
							hasRoomsList: false,
							buttonClass: getBookButtonStyle(proccesedRestrictions.restrictionCount || 0, rate.id, rate.availability),
							isGroupRate: isGroupRate,
							isAllotmentRate: isAllotmentRate,
							isCorporate: isCorporate,
							isSuppressed: isSuppressed,
							isMember: isMember,
							isPromotion: isPromotion
						};

					rateInfo.rooms.push({
						id: rate.room_type_id,
						name: $scope.reservationData.roomsMeta[rate.room_type_id].name,
						availability: rate.availability,
						forRate: rate.id
					});
					$scope.display.rateFirstGrid.push(rateInfo);
				});
				$scope.refreshScroll();
			},
			goToAddonsView = function() {
				$state.go('rover.reservation.staycard.mainCard.addons', {
					'from_date': ARRIVAL_DATE,
					'to_date': DEPARTURE_DATE
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
				};
				if ($rootScope.isAddonOn && areReservationAddonsAvailable) {
					//CICO-16874
					goToAddonsView();
				} else {
					var allRatesSelected = _.reduce(_.pluck(ROOMS, 'rateId'), function(a, b) {
						return !!a && !!b;
					});
					if (allRatesSelected) {
						if (!$scope.reservationData.guest.id && !$scope.reservationData.company.id && !$scope.reservationData.travelAgent.id && !$scope.reservationData.group.id) {
							$scope.$emit('PROMPTCARD');
							$scope.$watch('reservationData.guest.id', navigate);
							$scope.$watch('reservationData.company.id', navigate);
							$scope.$watch('reservationData.travelAgent.id', navigate);
						} else {
							navigate();
						}
					} else {
						var roomIndexWithoutRate = _.findIndex(ROOMS, {
							rateId: ''
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
				$scope.stateCheck.stayDates = angular.copy(ROOMS[$scope.stateCheck.roomDetails.firstIndex].stayDates);
			},
			navigateOut = function() {
				if ($scope.viewState.identifier !== 'REINSTATE' &&
					($stateParams.fromState === 'rover.reservation.staycard.reservationcard.reservationdetails' || $stateParams.fromState === 'STAY_CARD')) {
					saveAndGotoStayCard();
				} else {
					$scope.computeTotalStayCost();
					enhanceStay();
				}
			},
			initScrollers = function() {
				$scope.setScroller('room_types', {
					preventDefault: false,
					probeType: 3
				});
				$scope.setScroller('stayDates', {
					scrollX: true,
					scrollY: false
				});
				$timeout(function() {
					getScrollerObject('room_types').on('scroll', function() {
						var sc = $scope.stateCheck,
							roomsCount = $scope.display.roomFirstGrid.length,
							ratesCount = $scope.display.rateFirstGrid.length;
						if (this.y < (scrollPosition - 10) && Math.abs(this.y - this.maxScrollY) < Math.abs(this.maxScrollY / 4)) {
							if (!sc.showLessRooms &&
								sc.activeView === 'ROOM_TYPE' &&
								sc.baseInfo.totalCount > roomsCount) {
								sc.pagination.roomType.page++;
								fetchRoomTypesList(true); // The param tells the method to append the response to the existing list
							} else if (sc.activeView === 'RATE' && sc.baseInfo.maxAvblRates > ratesCount) {
								sc.pagination.rate.page++;
								fetchRatesList(null, null, sc.pagination.rate.page, function(response) {
									$scope.stateCheck.baseInfo.maxAvblRates = response.total_count;
									generateRatesGrid(response.results, true);
									$scope.refreshScroll();
								});
							}
						}
						scrollPosition = this.y;
					});
				}, 3000);
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
					};
				} else if ($scope.reservationData && $scope.reservationData.confirmNum && $scope.reservationData.reservationId) {
					$rootScope.setPrevState = {
						title: $filter('translate')('STAY_CARD'),
						name: 'rover.reservation.staycard.reservationcard.reservationdetails',
						param: {
							confirmationId: $scope.reservationData.confirmNum,
							id: $scope.reservationData.reservationId,
							isrefresh: true
						}
					};
				} else {
					$rootScope.setPrevState = {
						title: $filter('translate')('CREATE_RESERVATION'),
						callback: 'setSameCardNgo',
						scope: $scope
					};
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
							$scope.reservationData.rooms[roomIndex].isSuppressed = $scope.reservationData.rooms[roomIndex].isSuppressed ||
								currentRateSuppressed;
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

				$scope.stateCheck.stayDates = angular.copy(ROOMS[$scope.stateCheck.roomDetails.firstIndex].stayDates);

				_.each($scope.stateCheck.stayDates, function(dayInfo) {
					dayInfo.amount = dayInfo.rateDetails && dayInfo.rateDetails.modified_amount || null;
				});

				if (RVReservationDataService.isVaryingRates(ROOMS[$scope.stateCheck.roomDetails.firstIndex].stayDates, ARRIVAL_DATE, DEPARTURE_DATE, $scope.reservationData.numNights) || RVReservationDataService.isVaryingOccupancy(ROOMS[$scope.stateCheck.roomDetails.firstIndex].stayDates, ARRIVAL_DATE, DEPARTURE_DATE, $scope.reservationData.numNights)) {
					$scope.stateCheck.stayDatesMode = true;
					$scope.stateCheck.rateSelected.allDays = isRateSelected().allDays;
					$scope.stateCheck.rateSelected.oneDay = isRateSelected().oneDay;
				}

				// activate room type default view based on reservation settings
				if ($scope.otherData.defaultRateDisplayName === 'Recommended') {
					$scope.stateCheck.activeView = 'RECOMMENDED';
				} else if ($scope.otherData.defaultRateDisplayName === 'By Rate') {
					$scope.stateCheck.activeView = 'RATE';
				} else {
					if($stateParams.travel_agent_id || $stateParams.company_id
						 || $stateParams.group_id || $stateParams.allotment_id
						 || $stateParams.promotion_code || $stateParams.is_member == "true"){
						$scope.stateCheck.activeView = 'RECOMMENDED';
					} else {
						// By default RoomType
						$scope.stateCheck.activeView = 'ROOM_TYPE';
					}
				}

				if (!!$scope.reservationData.code && !!$scope.reservationData.code.id) {
					$scope.stateCheck.promotionValidity = evaluatePromotion();
				}

				setBackButton();

				if ($scope.stateCheck.activeView === 'ROOM_TYPE') {
					$scope.stateCheck.baseInfo.roomTypes = rates.results;
					generateRoomTypeGrid();
				} else if ($scope.stateCheck.activeView === 'RATE' || $scope.stateCheck.activeView === 'RECOMMENDED') {
					$scope.stateCheck.baseInfo.rates = rates.results;
					generateRatesGrid($scope.stateCheck.baseInfo.rates);
				}
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
					timer = 1500;
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
						$scope.handleBooking($scope.stateCheck.selectedRoomRate.roomId, $scope.stateCheck.selectedRoomRate.rateId,
							false, {
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
			fetchTaxRateAddonMeta = function(rateId, callback) {
				if (!callback) {
					callback = function() {
						console.log('No call back for tax and rate addon meta fetching');
					};
				}

				$scope.invokeApi(RVReservationBaseSearchSrv.fetchTaxRateAddonMeta, {
					from_date: ARRIVAL_DATE,
					to_date: DEPARTURE_DATE,
					rate_id: rateId
				}, function(response) {
					$scope.stateCheck.taxInfo = true;
					RVReservationStateService.metaData.taxDetails = angular.copy(response.taxInfo);
					RVReservationStateService.updateRateAddonsMeta(response.rateAddons);
					callback();
					$scope.$emit('hideLoader');
				});
			},
			haveAddonsChanged = function(entireSet, associatedAddons) {
				// TODO: Clear this up... fromState should have only the name of this state
				if ($stateParams.fromState === 'rover.reservation.staycard.reservationcard.reservationdetails' ||
					$stateParams.fromState === 'STAY_CARD') {
					return associatedAddons && associatedAddons.length > 0;
				} else {
					var extraAddons = [];
					_.each(entireSet, function(addon) {
						if (!_.find(associatedAddons, {
							id: addon.id
						})) {
							extraAddons.push(addon.id);
						}
					});
					return extraAddons.length > 0;
				}
			},
			transferState = function() {
				updateSupressedRatesFlag();
				// Set flag for suppressed rates
				$scope.reservationData.isRoomRateSuppressed = _.reduce(_.pluck(ROOMS, 'isSuppressed'), function(a, b) {
					return a || b;
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
						});
					});

					//Go through the existingReservationAddons and retain those of which arent having the new rate
					//in their excluded list. Leave the rest
					_.each(existingReservationAddons, function(addon) {
						if (!addon.allow_rate_exclusion || (addon.allow_rate_exclusion && _.indexOf(addon.excluded_rate_ids,
							currentRate) < 0)) {
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
			populateStayDates = function(stayDetails, rateId, roomIndex) {
				_.each(ROOMS[roomIndex].stayDates, function(details, date) {
					details.rate.id = rateId;
					var dayInfo = stayDetails[date],
						calculatedAmount = dayInfo && dayInfo.amount || stayDetails[ARRIVAL_DATE].amount;
					calculatedAmount = Number(parseFloat(calculatedAmount).toFixed(2));
					details.rateDetails = {
						actual_amount: calculatedAmount,
						modified_amount: calculatedAmount,
						is_discount_allowed: $scope.reservationData.ratesMeta[rateId].is_discount_allowed_on === null ? 'false' : $scope
							.reservationData.ratesMeta[rateId].is_discount_allowed_on.toString(), // API returns true / false as a string ... Hence true in a string to maintain consistency
						is_suppressed: $scope.reservationData.ratesMeta[rateId].is_suppress_rate_on === null ? 'false' : $scope.reservationData
							.ratesMeta[rateId].is_suppress_rate_on.toString()
					};
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
				if ( $scope.borrowForGroups ) {
					RVReservationStateService.setReservationFlag('borrowForGroups', true);
				}
				$scope.saveReservation(staycardDetails.name, staycardDetails.param);
			},
			getBookButtonStyle = function(numRestrictions, rateId, roomsCount) {

				var isRoomAvailable = roomsCount !== undefined && roomsCount > 0;

				if (!!$scope.reservationData.ratesMeta[rateId].account_id && numRestrictions > 0 && !isRoomAvailable) {
					return 'red';
				}

				if (!$scope.stateCheck.stayDatesMode) {
					if (numRestrictions > 0 || !isRoomAvailable) {
						return 'brand-colors';
					} else {
						return 'green';
					}
				} else { //Staydates mode
					if (numRestrictions > 0 || !isRoomAvailable) {
						return 'white brand-text';
					} else {
						return 'white green-text';
					}
				}
			}, // reset Page
			reInitialize = function() {
				$scope.stateCheck.roomDetails = getCurrentRoomDetails();

				$scope.stateCheck.pagination.roomType.page = 1;
				$scope.stateCheck.pagination.rate.page = 1;

				if ($scope.stateCheck.activeView === "RATE" || $scope.stateCheck.activeView === "RECOMMENDED") {
					$scope.stateCheck.rateFilterText = "";
					var isReccommendedTabApiRequired = false;
					if($scope.stateCheck.activeView === "RATE"){
						isReccommendedTabApiRequired = true;
					} else if(($scope.stateCheck.activeView === "RECOMMENDED") && ($stateParams.travel_agent_id || $stateParams.company_id
						 || $stateParams.group_id || $stateParams.allotment_id
						 || $stateParams.promotion_code || $stateParams.is_member == "true")){
						isReccommendedTabApiRequired = true;
					}
					if(isReccommendedTabApiRequired){
						fetchRatesList(null, null, $scope.stateCheck.pagination.rate.page, function(response) {
							$scope.stateCheck.baseInfo.maxAvblRates = response.total_count;
							generateRatesGrid(response.results);
							$scope.refreshScroll();
						});
					} else {
						generateRatesGrid([]);
					}

				} else if ($scope.stateCheck.activeView === "ROOM_TYPE") {
					fetchRoomTypesList();
				}
				scrollTop();
			};

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- ***************************
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- PUBLIC METHODS
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- ***************************

		$scope.refreshScroll = function() {
			$timeout(function() {
				$scope.refreshScroller('room_types');
				$scope.$parent && $scope.$parent.myScroll['room_types'] && $scope.$parent.myScroll['room_types'].refresh();
			}, 700);
		};

		var scrollTop = function() {
			$scope.$parent && $scope.$parent.myScroll['room_types'] && $scope.$parent.myScroll['room_types'].scrollTo(0, 0);
		};



		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- PERMISSIONS

		$scope.restrictIfOverbook = function(roomId, rateId) {
			var canOverbookHouse = rvPermissionSrv.getPermissionValue('OVERBOOK_HOUSE'),
				canOverbookRoomType = rvPermissionSrv.getPermissionValue('OVERBOOK_ROOM_TYPE');


			if (!!$scope.reservationData.group.id || !!$scope.reservationData.allotment.id) {
				// CICO-26707 Skip house avbl check for group/allotment reservations
				canOverbookHouse = true;
				//CICO-24923 TEMPORARY : Dont let overbooking of Groups from Room and Rates
				if ($scope.getLeastAvailability(roomId, rateId) < 1) {
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
			// reset Page
			$scope.stateCheck.pagination.roomType.page = 1;
			$scope.stateCheck.pagination.rate.page = 1;

			if ($scope.stateCheck.activeView === "RATE" || $scope.stateCheck.activeView === "RECOMMENDED") {
				// Reset search
				$scope.stateCheck.rateFilterText = "";
				fetchRatesList(null, null, $scope.stateCheck.pagination.rate.page, function(response) {
					generateRatesGrid(response.results);
					$scope.refreshScroll();
				});
			} else if ($scope.stateCheck.activeView === "ROOM_TYPE") {
				fetchRoomTypesList();
			}

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
				$scope.refreshScroller('stayDates');
			}, 150);

			reInitialize();
		};

		$scope.showStayDateDetails = function(selectedDate) {
			// by pass departure stay date from stay dates manipulation
			if (selectedDate === DEPARTURE_DATE) {
				return false;
			}
			$scope.stateCheck.dateModeActiveDate = selectedDate;
			$scope.stateCheck.selectedStayDate = ROOMS[$scope.stateCheck.roomDetails.firstIndex].stayDates[selectedDate];
			reInitialize();
		};

		$scope.toggleEditGuestOptions = function() {
			$scope.stateCheck.guestOptionsIsEditable = !$scope.stateCheck.guestOptionsIsEditable;
		};

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
				$scope.preferredType = '';
				// TODO : Reset other stuff as well
				$scope.stateCheck.rateSelected.oneDay = false;
				$scope.stateCheck.rateSelected.allDays = false;
				var roomIndex = $scope.stateCheck.roomDetails.firstIndex;
				for (; roomIndex <= $scope.stateCheck.roomDetails.lastIndex; roomIndex++) {
					_.each(ROOMS[roomIndex].stayDates, function(stayDate) {
						stayDate.rate = {
							id: ''
						};
					});
				}
			};
			fetchRoomTypesList();
		};

		$scope.setActiveView = function(view) {
			$scope.stateCheck.activeView = view;
			reInitialize();
		};

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- COMPUTE TAX AND DAY BREAKUP
		/* This is method is shared betweent the views */
		var computeDetails = function(secondary, cb) {
			// secondary may either be a room or a rate within which the dates is updated
			RVSelectRoomRateSrv.houseAvailability = $scope.stateCheck.house;
			RVSelectRoomRateSrv.isGroupReservation = !!$scope.reservationData.group.id || !!$scope.reservationData.allotment.id;

			var occupancies = _.pluck(ROOMS[$scope.stateCheck.roomDetails.firstIndex].stayDates, 'guests'),
				payLoad = {
					from_date: ARRIVAL_DATE,
					to_date: DEPARTURE_DATE,
					group_id: $scope.reservationData.group.id || $scope.reservationData.allotment.id,
					promotion_id: $scope.reservationData.promotionId,
					include_expired_promotions: !!$scope.reservationData.promotionId && $scope.stateCheck.showClosedRates,
					adults: occupancies[0].adults,
					children: occupancies[0].children
				};

			if ($scope.stateCheck.activeView === 'RATE' || $scope.stateCheck.activeView === 'RECOMMENDED') {
				payLoad.room_type_id = secondary.id;
				payLoad.rate_id = secondary.forRate;
			} else if ($scope.stateCheck.activeView === 'ROOM_TYPE') {
				payLoad.rate_id = secondary.id;
				payLoad.room_type_id = secondary.forRoomType;
			}

			if ($scope.reservationData.code && //------------------------------------------------------------------- Place INVALID PROMO to be set IFF
				$scope.reservationData.code.id && //---------------------------------------------------------------- a) A promotion has been entered [AND]
				!_.reduce($scope.stateCheck.promotionValidity, function(a, b) { //---------------------------------  b) The entered promo has expired [AND]
					return a && b;
				}) &&
				_.indexOf($scope.reservationData.ratesMeta[payLoad.rate_id].linked_promotion_ids, $scope.reservationData.code.id) > -1) { //------  c) rate is linked to the promo
				RVSelectRoomRateSrv.promotionValidity = $scope.stateCheck.promotionValidity;
			} else {
				RVSelectRoomRateSrv.promotionValidity = null; //---------------------------------------------------  ELSE set this as NULL
			}



			if (!secondary.dates) {
				secondary.dates = angular.copy(RVReservationDataService.getDatesModel(ARRIVAL_DATE, DEPARTURE_DATE));
			}



			if ($scope.stateCheck.stayDatesMode) {
				var dayOccupancy = ROOMS[$scope.stateCheck.roomDetails.firstIndex].stayDates[$scope.stateCheck.dateModeActiveDate].guests;
				payLoad['restrictions_on_date'] = $scope.stateCheck.dateModeActiveDate;
				payLoad.adults = dayOccupancy.adults;
				payLoad.children = dayOccupancy.children;
				if ($scope.stateCheck.rateSelected.oneDay) {
					payLoad.room_type_id = $scope.stateCheck.preferredType;
				}
			};

			$scope.invokeApi(RVSelectRoomRateSrv.getRateDetails, payLoad, function(rateDetails) {
				$scope.$emit('hideLoader');
				var datesArray = secondary.dates;
				secondary.total = 0.0;
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
					dayInfo.amount = rateDetails.amounts[date];
					var taxAddonInfo = RVReservationStateService.getAddonAndTaxDetails(
							date,
							payLoad.rate_id,
							ROOMS[$scope.stateCheck.roomDetails.firstIndex].stayDates[date].guests.adults,
							ROOMS[$scope.stateCheck.roomDetails.firstIndex].stayDates[date].guests.children,
							ARRIVAL_DATE,
							DEPARTURE_DATE,
							$scope.activeRoom,
							$scope.reservationData.ratesMeta[payLoad.rate_id].taxes,
							dayInfo.amount),
						// CICO-27226 Round day-wise totals
						dayTotal = Number(parseFloat(dayInfo.amount).toFixed(2)) +
						Number(parseFloat(taxAddonInfo.addon).toFixed(2)) +
						Number(parseFloat(taxAddonInfo.tax.excl).toFixed(2));

					_.extend(dayInfo, {
						addon: taxAddonInfo.addon,
						inclusiveAddonsExist: taxAddonInfo.inclusiveAddonsExist,
						tax: taxAddonInfo.tax,
						total: dayTotal,
						restrictions: rateDetails.dates[date]
					});
					updateStayTaxes(taxAddonInfo.stayTax);

					secondary.total = parseFloat(secondary.total) + parseFloat(dayTotal);

				});
				var totalStayTaxes = 0.0;
				_.each(stayTax.excl, function(tax) {
					totalStayTaxes = parseFloat(totalStayTaxes) + parseFloat(tax);
				});
				secondary.total = parseFloat(secondary.total) + parseFloat(totalStayTaxes);
				secondary.restrictions = rateDetails.summary;
				cb && cb();
				$scope.refreshScroll();
			});
		};

		/* This method is shared by both the views*/
		$scope.viewRateBreakUp = function(secondary, updateOnly) {
			// secondary can either be a Room or a Rate based on the primary view selected
			var toggle = function() {
				secondary.showDays = !secondary.showDays;
				$scope.refreshScroll();
			};

			if (updateOnly) {
				computeDetails(secondary);
				return;
			}

			// NOTE: Total is computed and added to the secondary object ONLY on the first expansion
			if (!secondary.showDays && !secondary.total) {
				fetchTaxRateAddonMeta(secondary.forRate || secondary.id, function() {
					computeDetails(secondary, toggle);
				});
			} else {
				$timeout(toggle, 300);
			}
		};

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- BOOKING

		$scope.handleNoEdit = function(event, roomId, rateId) {
			event.stopPropagation();
			ROOMS[$scope.stateCheck.roomDetails.firstIndex].rateName = $scope.reservationData.ratesMeta[rateId].name;
			$scope.reservationData.rateDetails[$scope.activeRoom] = angular.copy(ROOMS[$scope.stateCheck.roomDetails.firstIndex].stayDates);
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
				var isGroupReservation = !!$scope.reservationData.group.id || !!$scope.reservationData.allotment.id,
					firstIndexOfRoomType = $scope.stateCheck.roomDetails.firstIndex,
					roomIndex, lastFetchedGroup;

				if (isGroupReservation) {
					lastFetchedGroup = angular.copy(rvGroupConfigurationSrv.lastFetchedGroup);
				}

				for (roomIndex = $scope.stateCheck.roomDetails.firstIndex; roomIndex <= $scope.stateCheck.roomDetails.lastIndex; roomIndex++) {
					if (RVReservationDataService.isVaryingRates(ROOMS[firstIndexOfRoomType].stayDates, ARRIVAL_DATE, DEPARTURE_DATE,
						$scope.reservationData.numNights)) {
						ROOMS[roomIndex].rateName = 'Multiple Rates Selected';
					} else {
						ROOMS[roomIndex].rateName = $scope.reservationData.ratesMeta[ROOMS[firstIndexOfRoomType].stayDates[ARRIVAL_DATE]
							.rate.id].name;
					}

					var firstRateMetaData = $scope.reservationData.ratesMeta[ROOMS[firstIndexOfRoomType].stayDates[ARRIVAL_DATE].rate
						.id];

					if (isGroupReservation) {
						if (lastFetchedGroup.id === $scope.reservationData.group.id && $scope.viewState.identifier === "CREATION") {
							// In case of a group reservation; copy the group's demographics to the reservation
							var groupDemographics = lastFetchedGroup.demographics;

							ROOMS[i].demographics.market = groupDemographics.market_segment_id === null ? '' : groupDemographics.market_segment_id;
							ROOMS[i].demographics.source = groupDemographics.source_id === null ? '' : groupDemographics.source_id;
							ROOMS[i].demographics.origin = groupDemographics.booking_origin_id === null ? '' : groupDemographics.booking_origin_id;
							ROOMS[i].demographics.reservationType = groupDemographics.reservation_type_id === null ? '' : groupDemographics.reservation_type_id;
							ROOMS[i].demographics.segment = groupDemographics.segment_id === null ? '' : groupDemographics.segment_id;

							if (i === 0) {
								$scope.reservationData.demographics = angular.copy(ROOMS[i].demographics);
							}
						}
					} else {

						ROOMS[roomIndex].demographics.market = firstRateMetaData.market_segment_id === null ? '' : firstRateMetaData.market_segment_id;
						ROOMS[roomIndex].demographics.source = firstRateMetaData.source_id === null ? '' : firstRateMetaData.source_id;
						ROOMS[roomIndex].demographics.origin = firstRateMetaData.booking_origin_id === null ? '' : firstRateMetaData.booking_origin_id;

						if (roomIndex === 0) {
							$scope.reservationData.demographics.source = ROOMS[roomIndex].demographics.source;
							$scope.reservationData.demographics.market = ROOMS[roomIndex].demographics.market;
							$scope.reservationData.demographics.origin = ROOMS[roomIndex].demographics.origin;
						}
					}

					$scope.reservationData.rateDetails[roomIndex] = angular.copy(ROOMS[$scope.stateCheck.roomDetails.firstIndex].stayDates);

					if ($stateParams.fromState === 'rover.reservation.staycard.reservationcard.reservationdetails' || $stateParams.fromState ===
						'STAY_CARD') {
						_.each(ROOMS[roomIndex].stayDates, function(details, date) {
							var rateId = ROOMS[roomIndex].stayDates[date].rate.id,
								roomId = ROOMS[roomIndex].roomTypeId;

							details.rate.id = rateId;
							details.rate.name = $scope.reservationData.ratesMeta[rateId].name;

							var rateAmount = Number(parseFloat($scope.stateCheck.stayDates[date].amount).toFixed(2));

							details.rateDetails = {
								actual_amount: rateAmount,
								modified_amount: rateAmount,
								is_discount_allowed: $scope.reservationData.ratesMeta[rateId].is_discount_allowed_on === null ? 'false' : $scope
									.reservationData.ratesMeta[rateId].is_discount_allowed_on.toString(), // API returns true / false as a string ... Hence true in a string to maintain consistency
								is_suppressed: $scope.reservationData.ratesMeta[rateId].is_suppress_rate_on === null ? 'false' : $scope.reservationData
									.ratesMeta[rateId].is_suppress_rate_on.toString()
							};
						});
					}
				}
				transferState();
			}
		};

		/* This method is shared between the RATE and ROOM TYPE views */
		$scope.handleBooking = function(roomId, rateId, event, flags, afterFetch) {
			if (!!event) {
				event.stopPropagation();
			}

			var secondary, roomInfo, rateInfo;
			if ($scope.stateCheck.activeView === 'ROOM_TYPE') {
				var roomType = _.find($scope.display.roomFirstGrid, {
					id: roomId
				});
				secondary = _.find(roomType.ratesArray, {
					id: rateId
				});
				roomInfo = roomType;
				rateInfo = secondary;

			} else if ($scope.stateCheck.activeView === 'RATE' || $scope.stateCheck.activeView === 'RECOMMENDED') {
				var rate = _.find($scope.display.rateFirstGrid, {
					id: rateId
				});
				secondary = _.find(rate.rooms, {
					id: roomId
				});
				roomInfo = secondary;
				rateInfo = rate;
			}

			// Load Meta Data on the first call to this method if it hasn't been loaded yet
			if (!afterFetch) {
				fetchTaxRateAddonMeta(rateId, function() {
					computeDetails(secondary, function() {
						$scope.handleBooking(roomId, rateId, event, flags, true);
					});
				});
			} else {

				$scope.stateCheck.preferredType = parseInt($scope.stateCheck.preferredType, 10) || '';

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
					};
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
							$scope.reservationData.rateDetails[i] = angular.copy(ROOMS[$scope.stateCheck.roomDetails.firstIndex].stayDates);
						}
					}

					$scope.stateCheck.selectedStayDate.rate.id = rateId;

					$scope.stateCheck.selectedStayDate.roomType = {
						id: roomId
					};

					var amount = secondary.dates[activeDate].amount,
						rateAmount = Number(parseFloat(amount).toFixed(2));

					$scope.stateCheck.stayDates[$scope.stateCheck.dateModeActiveDate].amount = rateAmount;

					for (roomIndex = $scope.stateCheck.roomDetails.firstIndex; roomIndex <= $scope.stateCheck.roomDetails.lastIndex; roomIndex++) {
						currentRoom = ROOMS[roomIndex];
						currentRoom.stayDates[activeDate].rateDetails = {
							actual_amount: rateAmount,
							modified_amount: rateAmount,
							is_discount_allowed: $scope.reservationData.ratesMeta[rateId].is_discount_allowed_on === null ? 'false' : $scope
								.reservationData.ratesMeta[rateId].is_discount_allowed_on.toString(), // API returns true / false as a string ... Hence true in a string to maintain consistency
							is_suppressed: $scope.reservationData.ratesMeta[rateId].is_suppress_rate_on === null ? 'false' : $scope.reservationData
								.ratesMeta[rateId].is_suppress_rate_on.toString()
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
					var isGroupReservation = !!$scope.reservationData.group.id || !!$scope.reservationData.allotment.id,
						i, lastFetchedGroup;

					if (isGroupReservation) {
						lastFetchedGroup = angular.copy(rvGroupConfigurationSrv.lastFetchedGroup);
					}

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

						populateStayDates(secondary.dates, rateId, i);

						$scope.reservationData.rateDetails[i] = angular.copy(ROOMS[$scope.stateCheck.roomDetails.firstIndex].stayDates);

						if (isGroupReservation) {
							if (lastFetchedGroup.id === $scope.reservationData.group.id && $scope.viewState.identifier === "CREATION") {
								// In case of a group reservation; copy the group's demographics to the reservation
								var groupDemographics = lastFetchedGroup.demographics;

								console.log(groupDemographics);

								ROOMS[i].demographics.market = groupDemographics.market_segment_id === null ? '' : groupDemographics.market_segment_id;
								ROOMS[i].demographics.source = groupDemographics.source_id === null ? '' : groupDemographics.source_id;
								ROOMS[i].demographics.origin = groupDemographics.booking_origin_id === null ? '' : groupDemographics.booking_origin_id;
								ROOMS[i].demographics.reservationType = groupDemographics.reservation_type_id === null ? '' : groupDemographics.reservation_type_id;
								ROOMS[i].demographics.segment = groupDemographics.segment_id === null ? '' : groupDemographics.segment_id;

								if (i === 0) {
									$scope.reservationData.demographics = angular.copy(ROOMS[i].demographics);
								}
							}
						} else {
							ROOMS[i].demographics.market = $scope.reservationData.ratesMeta[rateId].market_segment_id === null ? '' : $scope
								.reservationData.ratesMeta[rateId].market_segment_id;
							ROOMS[i].demographics.source = $scope.reservationData.ratesMeta[rateId].source_id === null ? '' : $scope.reservationData
								.ratesMeta[rateId].source_id;
							ROOMS[i].demographics.origin = $scope.reservationData.ratesMeta[rateId].booking_origin_id === null ? '' : $scope.reservationData
								.ratesMeta[rateId].booking_origin_id;

							if (i === 0) {
								$scope.reservationData.demographics.source = ROOMS[i].demographics.source;
								$scope.reservationData.demographics.market = ROOMS[i].demographics.market;
								$scope.reservationData.demographics.origin = ROOMS[i].demographics.origin;
							}
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
								group_id: $scope.reservationData.group.id || $scope.reservationData.allotment.id
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
												return 'HOUSE';
											}
											return 'ROOM';
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
				timer = 1000;
			}
			$timeout(transferState, timer);
		};

		$scope.getLeastAvailability = function(roomId, rateId) {
			var secondary;
			var availabilityCount = 0;
			if ($scope.stateCheck.activeView === 'ROOM_TYPE') {
				var roomType = _.find($scope.display.roomFirstGrid, {
					id: roomId
				});
				secondary = _.find(roomType.ratesArray, {
					id: rateId
				});
			} else if ($scope.stateCheck.activeView === 'RATE' || $scope.stateCheck.activeView === 'RECOMMENDED') {

				var rate = _.find($scope.display.rateFirstGrid, {
					id: rateId
				});

				secondary = _.find(rate.rooms, {
					id: roomId
				});

			}
			//CICO-30938 - fixing undefined issue in console
			if(secondary !== undefined)
				availabilityCount = _.min(_.pluck(_.toArray(secondary.dates), 'availability'));
			return availabilityCount;

		};

		$scope.getLeastHouseAvailability = function() {
			var nights = $scope.reservationData.numNights || 1;
			return _.min(_.first(_.toArray($scope.stateCheck.house), nights));
		};

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- ROOMTYPE TAB

		$scope.showAllRooms = function() {
			$scope.stateCheck.showLessRooms = false;
			$scope.refreshScroll();
			$scope.stateCheck.pagination.roomType.page = 1;
			fetchRoomTypesList();
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
				roomType = parseInt($scope.stateCheck.preferredType, 10) || '',
				roomIndex;

			TABS[tabIndex].roomTypeId = roomType;

			for (roomIndex = $scope.stateCheck.roomDetails.firstIndex; roomIndex <= $scope.stateCheck.roomDetails.lastIndex; roomIndex++) {
				ROOMS[roomIndex].roomTypeId = roomType;
			}
			$scope.stateCheck.pagination.roomType.page = 1;
			fetchRoomTypesList();
			resetRates();
		};

		var processRestrictions = function( hasMultipleRestrictions, rateId) {

			var restrictionCount = 0,
				//isHouseFull = $scope.stateCheck.stayDatesMode ? ($scope.stateCheck.house[$scope.stateCheck.dateModeActiveDate] < 1) : ($scope.getLeastHouseAvailability() < 1),
				//isGroupReservation = !!$scope.reservationData.group.id || !!$scope.reservationData.allotment.id,
				isPromoInvalid = $scope.reservationData.code && $scope.reservationData.code.id && !_.reduce($scope.stateCheck.promotionValidity, function(a, b) {
					return a && b;
				});

			// if (hasMultipleRestrictions) {
			// 	restrictionCount = 2;
			// } else if (firstRestriction !== null) {
			// 	restrictionCount = 1;
			// }

			// if (!isGroupReservation && isHouseFull && (!firstRestriction || firstRestriction.restriction_type_id != 99)) {
			// 	restrictionCount = restrictionCount ? restrictionCount + 1 : 1;
			// 	if (restrictionCount === 1) {
			// 		firstRestriction = {
			// 			restriction_type_id: 99,
			// 			days: null
			// 		};
			// 	}
			// }

			// if (isPromoInvalid &&
			// 	(!firstRestriction || firstRestriction.restriction_type_id != 98)) {
			// 	if (_.indexOf($scope.reservationData.ratesMeta[rateId].linked_promotion_ids, $scope.reservationData.code
			// 		.id) > -1) {
			// 		restrictionCount = restrictionCount ? restrictionCount + 1 : 1;
			// 		if (restrictionCount === 1) {
			// 			firstRestriction = {
			// 				restriction_type_id: 98,
			// 				days: null
			// 			};
			// 		}
			// 	}
			// }

			return {
			//	firstRestriction: firstRestriction,
				//restrictionCount: restrictionCount,
				isPromoInvalid: isPromoInvalid
			};
		};

		$scope.showRoomsList = function(rate, append) {
			if (!rate.isCollapsed && !append) {
				rate.isCollapsed = true;
			} else {
				var pageToFetch;
				if (!rate.hasRoomsList || !append) {
					rate.rooms = [];
					pageToFetch = 1;
				} else {
					pageToFetch = (rate.rooms.length / $scope.stateCheck.pagination.rate.roomsList.perPage) + 1;
				}
				getRoomsADR(function(response) {
					rate.totalRoomsCount = response.total_count;
					rate.hasRoomsList = true;
					_.each(response.results, function(room) {
						_.each(room.restrictions, function(restrictionObject) {
						   var restrictionKey = restrictionObject.restriction_type_id;
						   restrictionObject.restrictionBgClass = "bg-"+getRestrictionClass(ratesMeta.restrictions[restrictionKey].key);
						   //restrictionObject.restrictionBgColor = getRestrictionClass(ratesMeta.restrictions[restrictionKey].key);
						   restrictionObject.restrictionIcon = getRestrictionIcon(ratesMeta.restrictions[restrictionKey].key);
						})
						var datesInitial = RVReservationDataService.getDatesModel(ARRIVAL_DATE, DEPARTURE_DATE);
						var proccesedRestrictions = processRestrictions( room.multiple_restrictions, rate.id),
							roomInfo = {
								id: room.id,
								name: $scope.reservationData.roomsMeta[room.id].name,
								availability: room.availability,
								showDays: false,
								adr: room.adr,
								dates: angular.copy(datesInitial),
								forRate: rate.id,
								numRestrictions: proccesedRestrictions.restrictionCount || 0,
								restriction: room.restrictions,
								buttonClass: getBookButtonStyle(proccesedRestrictions.restrictionCount || 0, rate.id, room.availability)
							};
						_.extend(roomInfo.dates[$scope.reservationData.arrivalDate], {
							availability: room.availability
						});
						rate.rooms.push(roomInfo);
						$timeout(function() {
							if (!append) {
								rate.isCollapsed = false;
							} //else keep it open just refresh the scroll
							$scope.refreshScroll();
						}, 100);
					});
				}, rate.id, pageToFetch);
			}
		};

		$scope.showRatesList = function(room, showMoreRates) {
			if ( $scope.borrowForGroups ) {
				return;
			}

			var toggle = function() {
				room.isCollapsed = !room.isCollapsed;
				$scope.refreshScroll();
			};
			//Only one best available rate for a room type
			//CICO-29156
			var bestAvailableRateOfSelectedRoom = room.ratesArray[0].id;
			if (!room.totalRatesCount || showMoreRates) {
				// Need to get the rates list before making it visible
				var pageToFetch = 1;
				if (showMoreRates) {
					pageToFetch = (room.ratesArray.length / $scope.stateCheck.pagination.roomType.ratesList.perPage) + 1;
				}
				fetchRatesList(room.id, null, pageToFetch, function(response) {
					var datesInitial = RVReservationDataService.getDatesModel(ARRIVAL_DATE, DEPARTURE_DATE);
					room.totalRatesCount = response.total_count;

					if (!showMoreRates) {
						room.ratesArray = [];
					}
					_.each(response.results, function(rate) {

						if (!$scope.reservationData.ratesMeta[rate.id]) {
							// -- Note: This should optimally come inside this condition only if a group/allotment is added in the Room & Rates screen. Else this would have been done in initialization itself.
							updateMetaInfoWithCustomRates();
						}
						_.each(rate.restrictions, function(restrictionObject) {
						   var restrictionKey = restrictionObject.restriction_type_id;
						   restrictionObject.restrictionBgClass = "bg-"+getRestrictionClass(ratesMeta.restrictions[restrictionKey].key);
						  // restrictionObject.restrictionBgColor = getRestrictionClass(ratesMeta.restrictions[restrictionKey].key);
						   restrictionObject.restrictionIcon = getRestrictionIcon(ratesMeta.restrictions[restrictionKey].key);
						})

						proccesedRestrictions = processRestrictions( rate.multiple_restrictions, rate.id);
						var isGroupRate = ($scope.stateCheck.activeView == 'RECOMMENDED' && $scope.reservationData.group.id) ? !!$scope.reservationData.group.id : false;
						var isAllotmentRate = ($scope.stateCheck.activeView == 'RECOMMENDED' && $scope.reservationData.allotment.id) ? !!$scope.reservationData.allotment.id : false;
						var isCorporate = ($scope.stateCheck.activeView == 'RECOMMENDED' && $scope.reservationData.ratesMeta[rate.id].account_id) ? !!$scope.reservationData.ratesMeta[rate.id].account_id : false;
						var isSuppressed = ($scope.stateCheck.activeView == 'RECOMMENDED' && $scope.reservationData.ratesMeta[rate.id].is_suppress_rate_on) ? !!$scope.reservationData.ratesMeta[rate.id].is_suppress_rate_on : false;
						var isMember = ($scope.stateCheck.activeView == 'RECOMMENDED' && $scope.reservationData.member.isSelected && $scope.reservationData.ratesMeta[rate.id].is_member) ? !!$scope.reservationData.member.isSelected && $scope.reservationData.ratesMeta[rate.id].is_member : false;
						var isPromotion = ($scope.stateCheck.activeView == 'RECOMMENDED' && !proccesedRestrictions.isPromoInvalid && _.indexOf($scope.reservationData.ratesMeta[rate.id].linked_promotion_ids, $scope.reservationData.code.id) > -1) ? !proccesedRestrictions.isPromoInvalid && _.indexOf($scope.reservationData.ratesMeta[rate.id].linked_promotion_ids, $scope.reservationData.code.id) > -1 : false;

						var restrictionsLength = (typeof rate.restrictions!=="undefined") ? rate.restrictions.length : 0;

						var rateInfo = {
							id: rate.id,
							name: $scope.reservationData.ratesMeta[rate.id].name,
							adr: rate.adr,
							dates: angular.copy(datesInitial),
							totalAmount: 0.0,
							restriction: rate.restrictions,
							numRestrictions: restrictionsLength,
							forRoomType: rate.room_type_id,
							buttonClass: getBookButtonStyle(proccesedRestrictions.restrictionCount || 0, rate.id, room.availability),
							showDays: false,
							isGroupRate: isGroupRate,
							isAllotmentRate: isAllotmentRate,
							isCorporate: isCorporate,
							isSuppressed: isSuppressed,
							isMember: isMember,
							isPromotion: isPromotion
						};
						if(bestAvailableRateOfSelectedRoom === rate.id){
							rateInfo.bestAvailableRateRestrictions = rate.restrictions
						}

						_.extend(rateInfo.dates[$scope.reservationData.arrivalDate], {
							availability: rate.availability
						});
						room.ratesArray.push(rateInfo);
					});
				});
				room.defaultRate = room.ratesArray[0];

				if (!showMoreRates) {
					$timeout(toggle, 300);
				}

				$scope.refreshScroll();
			} else {
				toggle();
			}
		};

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- RATE TAB
		///


		$scope.rateAutoCompleteOptions = {
			delay: 500,
			minLength: 0,
			position: {
				my: "left top",
				at: "left bottom",
				of: "input#find-rates",
				collision: 'fit'
			},
			source: function(request, response) {
				var re = new RegExp(request.term, 'gi'),
					filteredRates = $($scope.reservationData.ratesMeta).filter(function() {
						return this.name.match(re);
					}),
					results = [];

				_.each(filteredRates, function(rate) {
					results.push({
						label: rate.name,
						value: rate.name,
						id: rate.id
					});
				});
				response(results);
			},
			select: function(event, ui) {

				// Reset Pagination
				$scope.stateCheck.pagination.rate.page = 1;
				// Populate with the selected
				fetchRatesList(null, ui.item.id, 1, function(response) {
					$scope.stateCheck.baseInfo.maxAvblRates = response.total_count;
					generateRatesGrid(response.results);
					$scope.refreshScroll();
				});
			}
		};

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
			// Reset Pagination
			$scope.stateCheck.pagination.rate.page = 1;
			// Populate with the selected
			fetchRatesList(null, selectedRate.id, 1, function(response) {
				$scope.stateCheck.baseInfo.maxAvblRates = response.total_count;
				generateRatesGrid(response.results);
				$scope.refreshScroll();
			});
		};

		$scope.hideResults = function() {
			$timeout(function() {
				$scope.isRateFilterActive = false;
			}, 300);
		};

		$scope.filterRates = function() {
			$scope.rateFiltered = false;
			if ($scope.stateCheck.rateFilterText.length > 0) {
				var re = new RegExp($scope.stateCheck.rateFilterText, 'gi');
				$scope.filteredRates = $($scope.reservationData.ratesMeta).filter(function() {
					return this.name.match(re);
				});
				if ($scope.filteredRates.length) {
					// CICO-11119
					$scope.isRateFilterActive = true;
				}
			} else {
				$scope.filteredRates = [];
				fetchRatesList(null, null, 1, function(response) {
					generateRatesGrid(response.results);
					$scope.refreshScroll();
				});
			}
			$scope.refreshScroll();
		};

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- CALENDAR VIEW

		$scope.toggleCalendar = function() {
			$scope.stateCheck.activeMode = $scope.stateCheck.activeMode === 'ROOM_RATE' ? 'CALENDAR' : 'ROOM_RATE';
			$scope.heading = $scope.stateCheck.activeMode === 'ROOM_RATE' ? 'Rooms & Rates' : ' Rate Calendar';
			$scope.setHeadingTitle($scope.heading);
			$('#rooms-and-rates-header .switch-button').toggleClass('on');
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
			reInitialize();
		};

		$scope.getTabTitle = function(tabIndex) {
			if (tabIndex >= TABS.length) {
				return 'INVALID TAB';
			}
			var roomDetail = getTabRoomDetails(tabIndex);
			if (roomDetail.firstIndex === roomDetail.lastIndex) {
				return 'ROOM ' + (roomDetail.firstIndex + 1);
			}
			return 'ROOMS ' + (roomDetail.firstIndex + 1) + '-' + (roomDetail.lastIndex + 1);
		};

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- NAVI
		// since we are going back to create reservation screen
		// mark 'isSameCard' as true on '$scope.reservationData'
		$scope.setSameCardNgo = function() {
			$scope.reservationData.isSameCard = true;
			$state.go('rover.reservation.search');
		};

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- EVENT LISTENER
		var initEventListeners = function() {
			$scope.$on('SIDE_BAR_OCCUPANCY_UPDATE', function() {
				reInitialize();
			});

			$scope.$on('TABS_MODIFIED', function() {
				reInitialize();
			});

			$scope.$on('resetGuestTab', function() {
				// While coming in the guest Id might be retained in reservationData.guest.id in case another reservation is created for the same guest
				$scope.invokeApi(RVReservationBaseSearchSrv.fetchUserMemberships, $scope.reservationDetails.guestCard.id ||
					$scope.reservationData.guest.id,
					function(data) {
						$scope.$emit('hideLoader');
						$scope.reservationData.guestMemberships = {
							ffp: data.frequentFlyerProgram,
							hlp: data.hotelLoyaltyProgram
						};
						if ($scope.reservationData.member.isSelected && isMembershipValid()) {
							reInitialize();
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
			$scope.$on('cardChanged', function(event, cardIds) {
				$scope.reservationData.company.id = cardIds.companyCard;
				$scope.reservationData.travelAgent.id = cardIds.travelAgent;
				reInitialize();
				// Call the availability API and rerun the init method
			});
			// 	CICO-7792 END

			$scope.$on('switchToStayDatesCalendar', function() {
				$scope.stateCheck.activeMode = $scope.stateCheck.activeMode === 'ROOM_RATE' ? 'CALENDAR' : 'ROOM_RATE';
				$('#rooms-and-rates-header .switch-button').toggleClass('on');
			});
		};

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --- END
		$scope.errorMessage = '';
		$scope.$on('FAILURE_UPDATE_RESERVATION', function(e, data) {
			$scope.errorMessage = data;
		});

		var restrictionsArray = [
			{"key": "CLOSED", "name": "CLOSED" },
			{"key": "CLOSED_ARRIVAL", "name": "CLOSED TO ARRIVAL"},
			{"key": "CLOSED_DEPARTURE", "name": "CLOSED TO DEPARTURE"},
			{"key": "MIN_STAY_LENGTH", "name": "MIN LENGTH OF STAY"},
			{"key": "MAX_STAY_LENGTH", "name": "MAX LENGTH OF STAY"},
			{"key": "MIN_STAY_THROUGH", "name": "MIN STAY THROUGH"},
			{"key": "MIN_ADV_BOOKING", "name": "MIN ADVANCED BOOKING"},
			{"key": "MAX_ADV_BOOKING", "name": "MAX ADVANCED BOOKING"}

		];




		_.each(restrictionsArray, function(restrictionObject) {
		   var restrictionKey = restrictionObject.key;
		   restrictionObject.restrictionBgClass = "bg-"+getRestrictionClass(restrictionKey);
		   //restrictionObject.restrictionBgColor = getRestrictionClass(restrictionKey);
		   restrictionObject.restrictionIcon = getRestrictionIcon(restrictionKey);
		});
		$scope.legendRestrictionsArray = restrictionsArray;
		initialize();

	}
]);