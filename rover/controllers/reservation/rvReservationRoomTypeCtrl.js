sntRover.controller('RVReservationRoomTypeCtrl', ['$rootScope','$scope', 'roomRates', 'RVReservationBaseSearchSrv',
	function( $rootScope, $scope, roomRates, RVReservationBaseSearchSrv) {

		$scope.displayData = {};
		$scope.selectedRoomType = -1;
		$scope.expandedRoom = -1;
		$scope.displayData.stay = [];

		var init = function() {

			//defaults and hardcoded values
			$scope.tax = roomRates.tax || 20;
			$scope.rooms = roomRates.rooms;
			$scope.activeRoom = 0;
			$scope.activeCriteria = "ROOM_TYPE";


			$scope.roomAvailability = $scope.getAvailability(roomRates);

			$scope.displayData.allRooms = $(roomRates.room_types).filter(function() {
				return $scope.roomAvailability[this.id].availability == true &&
					$scope.roomAvailability[this.id].rates.length > 0;
			});

			$scope.displayData.roomTypes = $scope.displayData.allRooms;

			var rates = [];

			$(roomRates.rates).each(function(i, d) {
				rates[d.id] = d;
			});

			$scope.displayData.allRates = rates;

			var dates = $scope.getStayDays();

			$(dates).each(function(i, d) {
				$scope.displayData.stay.push({
					"date": d
				});
			});
		};


		$scope.handleBooking = function(roomId,rateId,event){
			$scope.reservationData.rooms[$scope.activeRoom = 0].roomType = roomId;
			$scope.reservationData.rooms[$scope.activeRoom = 0].rateName = rateId;
			//TODO: Navigate to the next screen
			event.stopPropagation();
		}


		$scope.setSelectedType = function(val) {
			$scope.selectedRoomType = $scope.selectedRoomType == val.id ? -1 : val.id;
		}

		$scope.filterRooms = function() {
			if ($scope.selectedRoomType == null) {
				//show all rooms
				$scope.displayData.roomTypes = $scope.displayData.allRooms;
			} else {
				// TODO: If a room type of category Level1 is selected, show this room type plus the lowest priced room type of the level 2 category.
				// TODO: If a room type of category Level2 is selected, show this room type plus the lowest priced room type of the level 3 category.
				// TODO: If a room type of category Level3 is selected, only show the selected room type.

				$scope.displayData.roomTypes = $($scope.displayData.allRooms).filter(function() {
					return this.id == $scope.selectedRoomType;
				});
			}
		}


		$scope.getStayDays = function() {
			var dates = [];
			startDate = new Date($scope.reservationData.arrivalDate);
			stopDate = new Date($scope.reservationData.departureDate);

			var currentDate = startDate;

			while (currentDate <= stopDate) {
				dates.push(currentDate)
				currentDate = new Date(Date.parse(currentDate) + 86400000);
			}
			return dates;
		}

		$scope.getAvailability = function(roomRates) {
			var rooms = [];
			//step1: check for room availability in the date range
			$(roomRates.results).each(function(i, d) {
				var for_date = d.date;
				$(d.room_types).each(function(i, d) {
					if (typeof rooms[d.id] == "undefined") {
						rooms[d.id] = {
							availability: true,
							days: [],
							rates: [],
							ratedetails: [],
							total:[],
							defaultRate: 0
						};
					}
					if (d.availability < 1) {
						rooms[d.id].availability = false;
					}
				});

				$(d.rates).each(function(i, d) {
					var rate_id = d.id;
					$(d.room_rates).each(function(i, d) {
						if ($(rooms[d.room_type_id].rates).index(rate_id) < 0) {
							rooms[d.room_type_id].rates.push(rate_id);
						}
						rooms[d.room_type_id].ratedetails.push({
							rate_id: rate_id,
							rate: 100.00,
							tax: 100.00 * $scope.tax / 100,
							day: new Date(for_date)
						});
						rooms[d.room_type_id].days.push(for_date);
					})
				})

			});

			for (var id in rooms) {
				var value = rooms[id];
				$(value.ratedetails).each(function(i,d){					
					if(typeof value.total[id] == 'undefined'){
						value.total[d.rate_id] = {
							total:0,
							average:0
						}
					}
					value.total[id].total = parseInt(value.total[id].total) + parseInt(d.rate);
					value.total[id].average = parseInt( value.total[id].total / 6); 
				})
				//TODO: Caluculate the default ID

				value.defaultRate = $(value.rates).first().length > 0 ? $(value.rates).first()[0] : -1;
			}

			console.log(rooms);
			return rooms;
		}


		init();
	}
]);