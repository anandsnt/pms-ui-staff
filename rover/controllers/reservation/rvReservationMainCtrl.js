sntRover.controller('RVReservationMainCtrl', ['$scope', '$rootScope', 'baseData', 'ngDialog', '$filter',
	function($scope, $rootScope, baseData, ngDialog, $filter) {
		BaseCtrl.call(this, $scope);

		var title = $filter('translate')('RESERVATION_TITLE');
		$scope.setTitle(title);


		$scope.initReservationData = function() {
			$scope.hideSidebar = false;
			// intialize reservation object
			$scope.reservationData = {
				arrivalDate: '',
				departureDate: '',
				checkinTime: {
					hh: '',
					mm: '00',
					ampm: 'AM'
				},
				checkoutTime: {
					hh: '',
					mm: '00',
					ampm: 'AM'
				},
				numNights: 1, // computed value, ensure to keep it updated
				roomCount: 1, // Hard coded for now,
				rooms: [{
					numAdults: 1,
					numChildren: 0,
					numInfants: 0,
					roomTypeId: '',
					roomTypeName: '',
					rateId: '',
					rateName: '',
					rateAvg: 0,
					rateTotal: 0,
					addons: []
				}],
				totalTaxAmount: 0,
				totalStayCost: 0,
				guest: {
					id: null, // if new guest, then it is null, other wise his id
					firstName: '',
					lastName: '',
					email: '',
					city: '',
					loyaltyNumber: '',
					sendConfirmMailTo: ''
				},
				company: {
					id: null, // if new company, then it is null, other wise his id
					name: '',
					corporateid: '', // Add different fields for company as in story
				},
				travelAgent: {
					id: null, // if new , then it is null, other wise his id
					name: '',
					iataNumber: '', // Add different fields for travelAgent as in story
				},
				paymentType: {
					type: {},
					ccDetails: { //optional - only if credit card selected
						number: '',
						expMonth: '',
						expYear: '',
						nameOnCard: ''
					}
				},
				demographics: {
					market: '',
					source: '',
					reservationType: '',
					origin: ''
				},
				promotion: {
					promotionCode: '',
					promotionType: ''
				},
				reservationId: '',
				confirmNum: ''
			}
		};


		$scope.otherData = {
			markets: baseData.demographics.markets,
			sources: baseData.demographics.sources,
			origins: baseData.demographics.origins,
			reservationTypes: baseData.demographics.reservationTypes,
			promotionTypes: [{
				value: "v1",
				description: "The first"
			}, {
				value: "v2",
				description: "The Second"
			}],
			maxAdults: '',
			maxChildren: '',
			maxInfants: '',
			roomTypes: [],
			fromSearch: false,
			recommendedRateDisplay: '',
			defaultRateDisplayName: ''
		};

		//setting the main header of the screen
		$scope.heading = "Reservations";

		$scope.checkOccupancyLimit = function() {
			//Recompute the cost of addons and update the Total Stay cost
			$scope.computeTotalStayCost();

			var roomIndex = 0;
			var activeRoom = $scope.reservationData.rooms[roomIndex].roomTypeId;
			var currOccupancy = parseInt($scope.reservationData.rooms[roomIndex].numChildren) +
				parseInt($scope.reservationData.rooms[roomIndex].numAdults);

			var getMaxOccupancy = function(roomId) {
				var max = -1;
				var name = "";
				$($scope.otherData.roomTypes).each(function(i, d) {
					if (roomId == d.id) {
						max = d.max_occupancy;
						name = d.name;
					}
				});
				return {
					max: max,
					name: name
				};
			};

			var roomPref = getMaxOccupancy(activeRoom);

			if (typeof activeRoom == 'undefined' || activeRoom == null || activeRoom == "" || roomPref.max == null || roomPref.max >= currOccupancy) {
				return true;
			}

			ngDialog.open({
				template: '/assets/partials/reservation/alerts/occupancy.html',
				className: 'ngdialog-theme-default',
				scope: $scope,
				closeByDocument: false,
				closeByEscape: false,
				data: JSON.stringify({
					roomType: roomPref.name,
					roomMax: roomPref.max
				})
			});
			return true;
		};

		$scope.computeTotalStayCost = function() {
			var currentRoom = $scope.reservationData.rooms[0];

			//Calculate Addon Addition for the room
			var addOnCumulative = 0;
			$($scope.reservationData.rooms[0].addons).each(function(i, addon) {
				console.log(addon.amountType.value, addon.postType.value);
				//Amount_Types
				// 1   ADULT   
				// 2   CHILD   
				// 3   PERSON  
				// 4   FLAT
				// The Amount Type is available in the amountType object of the selected addon
				// ("AT", addon.amountType.value)

				//Post Types
				// 1   STAY   
				// 2   NIGHT  
				// The Post Type is available in the postType object of the selected addon
				// ("PT", addon.postType.value)

				//TODO: IN CASE OF DATA ERRORS MAKE FLAT STAY AS DEFAULT

				var baseRate = parseFloat(addon.quantity) * parseFloat(addon.price);

				var finalRate = baseRate;
				// Function to compute the amount per day of the selected addon 
				var amountPerday = (function getAmountPerDay() {
					//TODO: calculate rate based on the amount type
					if (addon.amountType.value == "PERSON") {
						// Calculate the total number of occupants and multiply with base rate
						// Total number of occupants doesnt count the infants!
						return baseRate * parseInt(currentRoom.numAdults + currentRoom.numChildren);
					} else if (addon.amountType.value == "CHILD") {
						//TODO : Calculate the total number of occupants and multiply with base rate
						return baseRate * parseInt(currentRoom.numChildren);
					} else if (addon.amountType.value == "ADULT") {
						//TODO : Calculate the total number of occupants and multiply with base rate
						return baseRate * parseInt(currentRoom.numAdults);
					}
					//fallback should happen if amount type is flat
					return baseRate;
				})();
				if (addon.postType.value == "NIGHT") {
					console.log("//TODO:Got to calculate based on amount type and then mutiply with nights");
					finalRate = parseFloat(amountPerday) * parseInt($scope.reservationData.numNights);
				} else {
					console.log("//TODO:Rate is incl of all days");
					finalRate = amountPerday;
				}
				addOnCumulative += parseInt(finalRate);
				addon.effectivePrice = finalRate;
			});
			//TODO: Extend for multiple rooms
			$scope.reservationData.totalStayCost = parseFloat(currentRoom.rateTotal) + parseFloat(addOnCumulative);
		}

		$scope.initReservationData();
	}
]);