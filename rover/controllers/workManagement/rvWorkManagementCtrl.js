sntRover.controller('RVWorkManagementCtrl', ['$rootScope', '$scope', 'employees', 'workTypes', 'shifts', 'floors', '$timeout',
	function($rootScope, $scope, employees, workTypes, shifts, floors, $timeout) {

		$scope.setHeading = function(headingText) {
			$scope.heading = headingText;
			$scope.setTitle(headingText);
		}

		$scope.setHeading("Work Management");

		$scope.workTypes = workTypes;

		$scope.employeeList = employees;

		$scope.shifts = shifts;

		$scope.floors = floors;

		$scope.reservationStatus = {
			"Due out": "check-out",
			"Departed": "check-out",
			"Stayover": "inhouse",
			"Not Reserved": "no-show",
			"Arrival": "check-in",
			"Arrived": "check-in",
			"Not Defined": "no-show"
		}

		$scope.arrivalClass = {
			"Arrival": "check-in",
			"Arrived": "check-in",
			"Due out": "no-show",
			"Departed": "no-show",
			"Stayover": "no-show",
			"Not Reserved": "no-show",
			"Not Defined": "no-show"
		}

		$scope.departureClass = {
			"Arrival": "no-show",
			"Arrived": "no-show",
			"Due out": "check-out",
			"Departed": "check-out",
			"Stayover": "inhouse",
			"Not Reserved": "no-show",
			"Not Defined": "no-show"
		}

		$scope.stayoverClass = {
			"Arrival": "inhouse",
			"Arrived": "inhouse",
			"Due out": "check-out",
			"Departed": "check-out",
			"Stayover": "inhouse",
			"Not Reserved": "no-show",
			"Not Defined": "no-show"
		}

		$scope.printWorkSheet = function() {
			window.print();
		}

		$scope.addDuration = function(augend, addend) {
			if (!addend) {
				return augend;
			}
			var existing = augend.split(":"),
				current = addend.split(":"),
				sumMinutes = parseInt(existing[1]) + parseInt(current[1]),
				sumHours = (parseInt(existing[0]) + parseInt(current[0]) + parseInt(sumMinutes / 60)).toString();

			return (sumHours.length < 2 ? "0" + sumHours : sumHours) +
				":" +
				((sumMinutes % 60).toString().length < 2 ? "0" + (sumMinutes % 60).toString() : (sumMinutes % 60).toString());
		}

		$scope.filterUnassignedRooms = function(filter, rooms) {
			$scope.$emit('showLoader');
			var filteredRooms = [];

			var filterObject = {};
			//build the approp. filterObject 
			if (filter.selectedFloor) {
				filterObject.floor_number = filter.selectedFloor;
			}
			if (filter.selectedReservationStatus) {
				filterObject.reservation_status = filter.selectedReservationStatus;
			}
			if (filter.vipsOnly) {
				filterObject.is_vip = true;
			}
			if (filter.selectedFOStatus) {
				filterObject.fo_status = filter.selectedFOStatus;
			}
			if (!$.isEmptyObject(filterObject)) {
				filteredRooms = _.where(rooms, filterObject);
			} else {
				filteredRooms = rooms;
			}

			// time filtering on $scope.multiSheetState.unassignedFiltered
			if (!!filter.checkin.before.hh || !!filter.checkin.after.hh || !!filter.checkout.after.hh || !!filter.checkout.after.hh) {
				filteredRooms = _.filter(filteredRooms, function(room) {
					if ((!!room.checkin_time && (!!filter.checkin.before.hh || !!filter.checkin.after.hh)) ||
						(!!room.checkout_time && (!!filter.checkout.before.hh || !!filter.checkout.after.hh))) {
						var cib = filter.checkin.before,
							cia = filter.checkin.after,
							cob = filter.checkout.before,
							coa = filter.checkout.after,
							get24hourTime = function(time) { //time is in "12:34 pm" format 
								if (time) {
									var firstSplit = time.toString().split(':');
									var secondSplit = firstSplit[1].split(' ');
									var returnString = firstSplit[0];
									if (secondSplit[1].toString() && secondSplit[1].toString().toUpperCase() == "PM") {
										returnString = parseInt(returnString) + 12;
									} else {
										returnString = (parseInt(returnString) + 12) % 12;
									}
									if (returnString.toString().length < 2) {
										returnString = "0" + returnString.toString();
									}
									return returnString + ":" + secondSplit[0];
								} else {
									return "00:00"
								}
							}

						if (!!cia.hh && !!cib.hh) { // CASE 1 & 2
							return ((get24hourTime(room.checkin_time) >= get24hourTime(cia.hh + ':' + (cia.mm || '00') + " " + cia.am)) &&
								(get24hourTime(room.checkin_time) <= get24hourTime(cib.hh + ':' + (cib.mm || '00') + " " + cib.am)));
						} else if (!!cia.hh) { // CASE 1 : Arrival After
							return get24hourTime(room.checkin_time) >= get24hourTime(cia.hh + ':' + (cia.mm || '00') + " " + cia.am);
						} else if (!!cib.hh) { // CASE 2 : Arrival Before
							return get24hourTime(room.checkin_time) <= get24hourTime(cib.hh + ':' + (cib.mm || '00') + " " + cib.am);
						}

						if (!!coa.hh && !!cob.hh) { // CASE 3 & 4
							return ((get24hourTime(room.checkout_time) >= get24hourTime(coa.hh + ':' + (coa.mm || '00') + " " + coa.am)) &&
								(get24hourTime(room.checkout_time) <= get24hourTime(cob.hh + ':' + (cob.mm || '00') + " " + cob.am)));
						} else if (!!coa.hh) { // CASE 3 : Departure After
							return get24hourTime(room.checkout_time) >= get24hourTime(coa.hh + ':' + (coa.mm || '00') + " " + coa.am);
						} else if (!!cob.hh) { // CASE 4 : Departure Before
							return get24hourTime(room.checkout_time) <= get24hourTime(cob.hh + ':' + (cob.mm || '00') + " " + cob.am);
						}
					}
				});
			}

			$timeout(function() {
				$scope.$emit('hideLoader');
			}, 800);
			return filteredRooms;



		}
	}
]);