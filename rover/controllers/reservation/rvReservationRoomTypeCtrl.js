sntRover.controller('RVReservationRoomTypeCtrl', ['$rootScope', '$scope', 'roomRates', 'RVReservationBaseSearchSrv', '$timeout', '$state',
	function($rootScope, $scope, roomRates, RVReservationBaseSearchSrv, $timeout, $state) {

		$scope.displayData = {};
		$scope.selectedRoomType = -1;
		$scope.expandedRoom = -1;
		$scope.containerHeight = 300;
		$scope.showLessRooms = true;
		$scope.showLessRates = true;
		$scope.activeCriteria = "ROOM_TYPE";
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
			}
		};

		var init = function() {
			$scope.$emit('showLoader');
			$scope.heading = 'Rooms & Rates';
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
			$scope.rooms = roomRates.rooms;
			$scope.activeRoom = 0;



			//Restructure rates for easy selection
			var rates = [];

			$scope.days = roomRates.results.length;

			$(roomRates.rates).each(function(i, d) {
				rates[d.id] = d;
			});

			$scope.displayData.allRates = rates;

			//TODO : Make adjustments if multiple rooms are selected and the room selection bar is displayed
			$scope.containerHeight = $(window).height() - 300;

			$scope.roomAvailability = $scope.getAvailability(roomRates);

			//Filter for rooms which are available and have rate information
			$scope.displayData.allRooms = $(roomRates.room_types).filter(function() {
				return $scope.roomAvailability[this.id] && $scope.roomAvailability[this.id].availability == true &&
					$scope.roomAvailability[this.id].rates.length > 0 && $scope.roomAvailability[this.id].level != null;
			});

			//sort the rooms by levels
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
			$scope.preferredType = $scope.reservationData.rooms[$scope.activeRoom].roomType;
			//$scope.preferredType = 5;
			$scope.roomTypes = roomRates.room_types;
			$scope.filterRooms();

			//CICO-5253 > Rate Types Reservartion
			//Get the rates for which rooms are available $scope.displayData.allRooms
			$scope.ratesMaster = [];
			$scope.displayData.availableRates = [];
			rateDisplayEnabler();
			$scope.$emit('hideLoader');
		};

		var rateDisplayEnabler = function() {
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
					d.rooms.sort(function(a, b) {
						if (a.total[d.rate.id].average < b.total[d.rate.id].average)
							return -1;
						if (a.total[d.rate.id].average > b.total[d.rate.id].average)
							return 1;
						return 0;
					});
					$scope.displayData.availableRates.push(d);
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
			$scope.displayData.availableRates.sort(function(a, b) {
				var first = $scope.ratetypePriority[a.rate.rate_type.name];
				var second = $scope.ratetypePriority[b.rate.rate_type.name];

				if (typeof first == 'undefined') {
					first = 99;
				}
				if (typeof second == 'undefined') {
					second = 99;
				}
				if (first < second)
					return -1;
				if (first > second)
					return 1;
				return 0;
			});

		}

		$scope.handleBooking = function(roomId, rateId, event) {
			event.stopPropagation();

			$scope.reservationData.rooms[$scope.activeRoom].roomTypeId = roomId;
			$scope.reservationData.rooms[$scope.activeRoom].roomTypeName = $scope.roomAvailability[roomId].name;
			$scope.reservationData.rooms[$scope.activeRoom].rateId = rateId;
			$scope.reservationData.rooms[$scope.activeRoom].rateName = $scope.displayData.allRates[rateId].name;
			$scope.reservationData.rooms[$scope.activeRoom].rateAvg = $scope.roomAvailability[roomId].total[rateId].average;
			$scope.reservationData.rooms[$scope.activeRoom].rateTotal = $scope.roomAvailability[roomId].total[rateId].total;

			//TODO: update the Tax Amount information
			$scope.reservationData.totalStayCost = $scope.roomAvailability[roomId].total[rateId].total;
			$scope.reservationData.totalTaxAmount = 0;

			//Navigate to the next screen
			// $state.go('rover.reservation.mainCard.summaryAndConfirm');
			$state.go('rover.reservation.mainCard.addons');
		}


		$scope.setSelectedType = function(val) {
			$scope.selectedRoomType = $scope.selectedRoomType == val.id ? -1 : val.id;
			$scope.refreshScroll();
		}

		$scope.filterRooms = function() {
			if ($scope.preferredType == null || $scope.preferredType == '' || typeof $scope.preferredType == 'undefined') {
				$scope.displayData.roomTypes = $scope.displayData.allRooms;
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
							return this.level == targetlevel;
						});
						//Check if candidate rooms are available
						if (candidateRooms.length == 0) {
							//try for candidate rooms in the same level						
							candidateRooms = $($scope.roomAvailability).filter(function() {
								return this.level == level && this.id != $scope.preferredType;
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
			$scope.refreshScroll();
		}

		$scope.getAvailability = function(roomRates) {
			var roomDetails = [];
			var rooms = [];
			$(roomRates.room_types).each(function(i, d) {
				roomDetails[d.id] = d;
			});
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
							averagePerNight: 0
						};
					}
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
						rooms[d.room_type_id].total[rate_id].average = rooms[d.room_type_id].total[rate_id].total / $scope.days;

					})
				})

			});


			for (var id in rooms) {
				// step3: total and average calculation
				var value = rooms[id];

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
			}
			//console.log(rooms);
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
		});

		$scope.highlight = function(text, search) {
			if (!search) {
				return text;
			}
			return text.replace(new RegExp(search, 'gi'), '<span class="highlight">$&</span>');
		};

		init();
	}
]);