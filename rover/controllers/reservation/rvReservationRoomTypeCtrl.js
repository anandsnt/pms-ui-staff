sntRover.controller('RVReservationRoomTypeCtrl', ['$rootScope', '$scope', 'roomRates', 'RVReservationBaseSearchSrv', '$timeout', '$state',

	function($rootScope, $scope, roomRates, RVReservationBaseSearchSrv, $timeout, $state) {

		$scope.displayData = {};
		$scope.selectedRoomType = -1;
		$scope.expandedRoom = -1;
		$scope.containerHeight = 300;
		$scope.showLess = true;

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

			// console.log("APIRETURN", roomRates);
			console.log("RESVOBJ", $scope.reservationData);

			//defaults and hardcoded values
			$scope.tax = roomRates.tax || 20;
			$scope.rooms = roomRates.rooms;
			$scope.activeRoom = 0;
			$scope.activeCriteria = "ROOM_TYPE";


			//Restructure rates for easy selection
			var rates = [];

			$scope.days = roomRates.results.length;

			$(roomRates.rates).each(function(i, d) {
				rates[d.id] = d;
			});

			$scope.displayData.allRates = rates;

			//TODO : Make adjustments if multiple rooms are selected and the room selection bar is displayed
			$scope.containerHeight = $(window).height() - 280;

			$scope.roomAvailability = $scope.getAvailability(roomRates);

			//Filter for rooms which are available and have rate information
			$scope.displayData.allRooms = $(roomRates.room_types).filter(function() {
				return $scope.roomAvailability[this.id] && $scope.roomAvailability[this.id].availability == true &&
					$scope.roomAvailability[this.id].rates.length > 0;
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
		};

		$scope.handleBooking = function(roomId, rateId, event) {
			event.stopPropagation();

			$scope.reservationData.rooms[$scope.activeRoom].roomTypeId = roomId;
			$scope.reservationData.rooms[$scope.activeRoom].roomTypeName = $scope.roomAvailability[roomId].name;
			$scope.reservationData.rooms[$scope.activeRoom].rateId = rateId;
			$scope.reservationData.rooms[$scope.activeRoom].rateName = $scope.displayData.allRates[rateId].name;
			$scope.reservationData.rooms[$scope.activeRoom].rateAvg = $scope.roomAvailability[roomId].total[rateId].average;
			$scope.reservationData.rooms[$scope.activeRoom].rateTotal = $scope.roomAvailability[roomId].total[rateId].total;

			console.log({
				rateAvg: $scope.roomAvailability[roomId].total[rateId].average,
				rateTotal: $scope.roomAvailability[roomId].total[rateId].total
			});

			//TODO: update the Tax Amount information
			$scope.reservationData.totalStayCost = $scope.roomAvailability[roomId].total[rateId].total;
			$scope.reservationData.totalTaxAmount = 0;

			//Navigate to the next screen
			$state.go('rover.reservation.mainCard.summaryAndConfirm');
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
							ratedetails: [],
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
						rooms[d.room_type_id].ratedetails.push({
							rate_id: rate_id,
							rate: $scope.calculateRate(d),
							tax: 0,
							day: new Date(for_date)
						});
					})
				})

			});


			for (var id in rooms) {
				// step3: total and average calculation
				var value = rooms[id];
				$(value.ratedetails).each(function(i, d) {
					if (typeof value.total[d.rate_id] == 'undefined') {
						value.total[d.rate_id] = {
							total: 0,
							average: 0
						}
					}
					value.total[d.rate_id].total = parseInt(value.total[d.rate_id].total) + parseInt(d.rate);
					//ASSUMPTION: use the number of days as the denominator for the average calculation
					value.total[d.rate_id].average = parseInt(value.total[d.rate_id].total / $scope.days);
				})

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
				} else{
					value.defaultRate = -1;
				}

				//step5: calculate the rate differences between the rooms
				//Put the average rate in the room object
				if (typeof value.total[value.defaultRate] != 'undefined') {
					value.averagePerNight = value.total[value.defaultRate].average;
				}
			}

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

		init();
	}
]);