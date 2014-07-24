sntRover.controller('RVReservationRoomTypeCtrl', ['$rootScope', '$scope', 'roomRates', 'RVReservationBaseSearchSrv', '$timeout', '$state', 'ngDialog', '$sce',
	function($rootScope, $scope, roomRates, RVReservationBaseSearchSrv, $timeout, $state, ngDialog, $sce) {

		$scope.displayData = {};
		$scope.selectedRoomType = -1;
		$scope.expandedRoom = -1;
		$scope.containerHeight = 250;
		$scope.showLessRooms = true;
		$scope.showLessRates = false;

		// $scope.activeMode = "ROOM_RATE";
		$scope.stateCheck = {
			activeMode: "ROOM_RATE",
			stayDatesMode: false
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


		//scroller options
		$scope.$parent.myScrollOptions = {
			'room_types': {
				snap: false,
				scrollbars: true,
				vScroll: true,
				vScrollbar: true,
				hideScrollbar: false,
				click: true
			},
			'stayDates': {
				snap: false,
				scrollbars: true,
				scrollX: true,
				hideScrollbar: false,
				click: true
			}
		};

		var init = function() {
			BaseCtrl.call(this, $scope);

			$scope.$emit('showLoader');
			$scope.heading = 'Rooms & Rates';
			$scope.$emit('setHeading', $scope.heading);

			$scope.displayData.dates = [];
			$scope.rateFilterText = '';
			$scope.filteredRates = [];
			$scope.isRateFilterActive = true;
			$scope.rateFiltered = false;


			//interim check on page reload if the page is refreshed
			if ($scope.reservationData.arrivalDate == '' || $scope.reservationData.departureDate == '') {
				//defaulting to today's and tommorow's dates
				$scope.reservationData.arrivalDate = (new Date().toISOString().slice(0, 10).replace(/-/g, "-"));
				$scope.reservationData.departureDate = (new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10).replace(/-/g, "-"));

				$($scope.reservationData.rooms).each(function(i, d) {
					$scope.reservationData.rooms[i].numAdults = 1;
					d.numChildren = 0;
					d.numInfants = 0;
				});

			}

			//console.log("RESVOBJ", $scope.reservationData);

			//defaults and hardcoded values
			$scope.tax = roomRates.tax || 0;
			$scope.rooms = $scope.reservationData.rooms;
			$scope.activeRoom = 0;



			//Restructure rates for easy selection
			var rates = [];

			$scope.days = roomRates.results.length;

			$(roomRates.rates).each(function(i, d) {
				rates[d.id] = d;
			});

			$scope.displayData.allRates = rates;

			//TODO : Make adjustments if multiple rooms are selected and the room selection bar is displayed
			$scope.containerHeight = $(window).height() - 250;

			$scope.roomAvailability = $scope.getAvailability(roomRates);

			//Filter for rooms which are available and have rate information
			$scope.displayData.allRooms = $(roomRates.room_types).filter(function() {
				return $scope.roomAvailability[this.id] && $scope.roomAvailability[this.id].availability == true &&
					$scope.roomAvailability[this.id].rates.length > 0 && $scope.roomAvailability[this.id].level != null;
			});

			//sort the rooms by levels
			// console.log($scope.roomAvailability);


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

			//$scope.displayData.allRooms = roomRates.room_types;
			$scope.displayData.roomTypes = $scope.displayData.allRooms;

			//TODO: Handle the selected roomtype from the previous screen
			$scope.preferredType = $scope.reservationData.rooms[$scope.activeRoom].roomTypeId;
			//$scope.preferredType = 5;
			$scope.roomTypes = roomRates.room_types;
			$scope.filterRooms();
			$scope.$emit('hideLoader');
		};

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
					if ($scope.preferredType == null || $scope.preferredType == '' || typeof $scope.preferredType == 'undefined') {
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
						if (_.where(d.rooms, {
							id: $scope.preferredType
						}).length > 0) {
							d.preferredType = $scope.preferredType;
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

			//TODO:Upon selecting the Rate radio button, the view will list the different rates that are available for the selected criteria listed by rate type. Rate Types should only include the below, listed in the exact same order:
			// 			RACK
			// 			BAR
			// 			Packages
			// 			Promotions
			// $scope.displayData.availableRates.sort(function(a, b) {
			// 	var first = $scope.ratetypePriority[a.rate.rate_type.name];
			// 	var second = $scope.ratetypePriority[b.rate.rate_type.name];

			// 	if (typeof first == 'undefined') {
			// 		first = 99;
			// 	}
			// 	if (typeof second == 'undefined') {
			// 		second = 99;
			// 	}
			// 	if (first < second)
			// 		return -1;
			// 	if (first > second)
			// 		return 1;
			// 	return 0;
			// });
		}

		var populateStayDates = function(rateId) {
			_.each($scope.reservationData.rooms[$scope.activeRoom].stayDates, function(details, date) {
				details.rate.id = rateId,
				details.rate.name = $scope.displayData.allRates[rateId].name;
			});
		}

		$scope.handleBooking = function(roomId, rateId, event) {
			event.stopPropagation();
			/*	Using the populateStayDates method, the stayDates object for the active room are 
			 *	are updated with the rate and rateName information
			 */
			populateStayDates(rateId);

			$scope.reservationData.rooms[$scope.activeRoom].roomTypeId = roomId;
			$scope.reservationData.rooms[$scope.activeRoom].roomTypeName = $scope.roomAvailability[roomId].name;
			$scope.reservationData.rooms[$scope.activeRoom].rateId = rateId;
			$scope.reservationData.rooms[$scope.activeRoom].rateName = $scope.displayData.allRates[rateId].name;
			$scope.reservationData.demographics.market = $scope.displayData.allRates[rateId].market_segment.id;
			$scope.reservationData.demographics.source = $scope.displayData.allRates[rateId].source.id;
			$scope.reservationData.rooms[$scope.activeRoom].rateAvg = $scope.roomAvailability[roomId].total[rateId].average;
			$scope.reservationData.rooms[$scope.activeRoom].rateTotal = $scope.roomAvailability[roomId].total[rateId].total;

			//TODO: update the Tax Amount information
			$scope.reservationData.totalStayCost = $scope.roomAvailability[roomId].total[rateId].total;
			$scope.reservationData.totalTaxAmount = 0;

			//TODO : 7641 - Update the rateDetails array in the reservationData
			$scope.reservationData.rateDetails[$scope.activeRoom] = $scope.roomAvailability[roomId].ratedetails;

			//Navigate to the next screen
			$scope.checkOccupancyLimit();
			$state.go('rover.reservation.staycard.mainCard.addons', {
				"from_date": $scope.reservationData.arrivalDate,
				"to_date": $scope.reservationData.departureDate
			});
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

		$scope.filterRooms = function() {
			if ($scope.preferredType == null || $scope.preferredType == '' || typeof $scope.preferredType == 'undefined') {
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
						//Check if candidate rooms are available
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
				// If a room type of category Level1 is selected, show this room type plus the lowest priced room type of the level 2 category.
				// If a room type of category Level2 is selected, show this room type plus the lowest priced room type of the level 3 category.
				// If a room type of category Level3 is selected, only show the selected room type.
				$scope.displayData.roomTypes = $($scope.displayData.allRooms).filter(function() {
					return this.id == $scope.preferredType;
				});
				if ($scope.displayData.roomTypes.length > 0) {
					var level = $scope.roomAvailability[$scope.displayData.roomTypes[0].id].level;
					if (level == 1 || level == 2) {
						//Append rooms from the next level
						//Get the candidate rooms of the room to be appended
						var targetlevel = level + 1;
						var candidateRooms = $($scope.roomAvailability).filter(function() {
							return this.level == targetlevel && this.availability == true && this.rates.length > 0;
						});
						//Check if candidate rooms are available
						if (candidateRooms.length == 0) {
							//try for candidate rooms in the same level						
							candidateRooms = $($scope.roomAvailability).filter(function() {
								return this.level == level && this.id != $scope.preferredType && this.availability == true && this.rates.length > 0 && parseInt(this.averagePerNight) >= parseInt($scope.roomAvailability[$scope.preferredType].averagePerNight);
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
				$scope.selectedRoomType = $scope.preferredType;
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
								validRate = false;
							} else {
								var rateConfiguration = today[rateId].rateBreakUp;
								var numAdults = parseInt($scope.reservationData.rooms[$scope.activeRoom].numAdults);
								var numChildren = parseInt($scope.reservationData.rooms[$scope.activeRoom].numChildren);
								var stayLength = parseInt($scope.reservationData.numNights);
								// The below variable stores the days till the arrival date
								var daysTillArrival = Math.round((new Date($scope.reservationData.arrivalDate) - new Date($rootScope.businessDate)) / (1000 * 60 * 60 * 24));

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
												if (new Date(currDate) - new Date($scope.reservationData.arrivalDate) == 0) {
													validRate = false;
												}
												break;
											case 'CLOSED_DEPARTURE': // 3 CLOSED_DEPARTURE
												if (new Date(currDate) - new Date($scope.reservationData.departureDate) == 0) {
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
												if (Math.round((new Date($scope.reservationData.departureDate) - new Date(currDate)) / (1000 * 60 * 60 * 24)) < restriction.days) {
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
						if (!validRate) {
							var existingRates = roomsIn[roomId].rates;
							var afterRemoval = _.without(existingRates, rateId);
							roomsIn[roomId].rates = afterRemoval;
						}
					});
				}
			});
			return roomsIn;
		}

		$scope.getAvailability = function(roomRates) {
			var roomDetails = [];
			var rooms = [];

			var currOccupancy = parseInt($scope.reservationData.rooms[$scope.activeRoom].numAdults) +
				parseInt($scope.reservationData.rooms[$scope.activeRoom].numChildren);

			$(roomRates.room_types).each(function(i, d) {
				roomDetails[d.id] = d;
			});

			// Parse through all room-rate combinations.
			$(roomRates.results).each(function(i, d) {
				$scope.displayData.dates.push({
					str: d.date,
					obj: new Date(d.date)
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
					$(d.room_rates).each(function(i, d) {
						if ($(rooms[d.room_type_id].rates).index(rate_id) < 0) {
							rooms[d.room_type_id].rates.push(rate_id);
						}
						if (typeof rooms[d.room_type_id].ratedetails[for_date] == 'undefined') {
							rooms[d.room_type_id].ratedetails[for_date] = [];
						}
						rooms[d.room_type_id].ratedetails[for_date][rate_id] = {
							rate_id: rate_id,
							rate: $scope.calculateRate(d),
							rateBreakUp: d,
							tax: 0,
							day: new Date(for_date)
						};
						//TODO : compute total
						if (typeof rooms[d.room_type_id].total[rate_id] == 'undefined') {
							rooms[d.room_type_id].total[rate_id] = {
								total: 0,
								average: 0
							}
						}
						rooms[d.room_type_id].total[rate_id].total = parseInt(rooms[d.room_type_id].total[rate_id].total) + $scope.calculateRate(d);
						rooms[d.room_type_id].total[rate_id].average = parseFloat(rooms[d.room_type_id].total[rate_id].total / $scope.days).toFixed(2);

					})
				})

			});

			rooms = restrictionCheck(rooms);

			_.each(rooms, function(value) {
				// step3: total and average calculation
				// var value = rooms[id];

				//step4 : sort the rates within each room
				value.rates.sort(function(a, b) {
					if (value.total[a].total < value.total[b].total)
						return -1;
					if (value.total[a].total > value.total[b].total)
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
				}
			});

			return rooms;
		}

		$scope.refreshScroll = function() {
			if (typeof $scope.$parent.myScroll != 'undefined') {
				$timeout(function() {
					$scope.$parent.myScroll["room_types"].refresh();
				}, 300);
			}
		}

		$scope.calculateRate = function(rateTable) {
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
			var adults = $scope.reservationData.rooms[$scope.activeRoom].numAdults;
			var children = $scope.reservationData.rooms[$scope.activeRoom].numChildren;

			var baseRoomRate = adults >= 2 ? rateTable.double : rateTable.single;
			var extraAdults = adults >= 2 ? adults - 2 : 0;

			return baseRoomRate + (extraAdults * rateTable.extra_adult) + (children * rateTable.child);
		}

		// $scope.$watchCollection('reservationData.rooms[0]', function(newC, oldC) {
		// 	if (newC.numAdults != oldC.numAdults || newC.numChildren != oldC.numChildren) {
		// 		init();
		// 	}
		// });

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
			$scope.rateFilterText = selectedRate.rate.name;
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
			if ($scope.rateFilterText.length > 0) {
				var re = new RegExp($scope.rateFilterText, "gi");
				$scope.filteredRates = $($scope.displayData.availableRates).filter(function() {
					return this.rate.name.match(re);
				})
			} else {
				$scope.filteredRates = [];
			}
			$scope.refreshScroll();
		}

		$scope.$watch('activeCriteria', function() {
			$scope.refreshScroll();
			$scope.rateFilterText = "";
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

		$scope.toggleCalendar = function() {
			$scope.stateCheck.activeMode = $scope.stateCheck.activeMode == "ROOM_RATE" ? "CALENDAR" : "ROOM_RATE";
			$(".data-off span").toggleClass("value switch-icon");
		}
		
		init();
	}
]);