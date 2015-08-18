sntRover.controller('RVWorkManagementCtrl', ['$rootScope', '$scope', 'employees', 'workTypes', 'shifts', 'floors', '$timeout',
	function($rootScope, $scope, employees, workTypes, shifts, floors, $timeout) {

		BaseCtrl.call(this, $scope);

		$scope.setHeading = function(headingText) {
			$scope.heading = headingText;
			$scope.setTitle(headingText);
		};

		$scope.setHeading("Work Management");

		$scope.$emit("updateRoverLeftMenu", "workManagement");

		$scope.workTypes = workTypes;

		$scope.employeeList = employees;

		$scope.shifts = shifts;

		$scope.floors = floors;


		// Arrived / Day Use / Due Out / Departed,Due out / Arrival,Departed / Arrival,Arrived / Departed,Due out / Departed,Arrived,Stayover,Departed,Not Defined

		$scope.reservationStatus = {
			"Due out": "check-out",
			"Departed": "check-out",
			"Stayover": "inhouse",
			"Not Reserved": "no-show",
			"Arrival": "check-in",
			"Arrived": "check-in",
			"Not Defined": "no-show",
			"Day Use": "check-out",
			"Due out / Arrival": "check-out",
			"Departed / Arrival": "check-out",
			"Arrived / Departed": "check-in",
			"Due out / Departed": "check-out",
			"Arrived / Day use / Due out": "check-in",
			"Arrived / Day use / Due out / Departed": "check-in"
		};

		$scope.arrivalClass = {
			"Arrival": "check-in",
			"Arrived": "check-in",
			"Due out": "no-show",
			"Departed": "no-show",
			"Stayover": "no-show",
			"Not Reserved": "no-show",
			"Not Defined": "no-show",
			"Day Use": "check-in",
			"Due out / Arrival": "check-in",
			"Departed / Arrival": "check-in",
			"Arrived / Departed": "check-in",
			"Due out / Departed": "no-show",
			"Arrived / Day use / Due out": "check-in",
			"Arrived / Day use / Due out / Departed": "check-in"
		};

		// CICO-12517: Changed "no-show" to "check-out"
		// since we want the count to go up anyway.
		// @CHANGED_FOR: 'Arrival', 'Arrived', 'Not Reserved', 'Not Defined'
		// @LINK: https://stayntouch.atlassian.net/browse/CICO-12517?focusedCommentId=42716&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-42716
		$scope.departureClass = {
			"Arrival": "check-out",
			"Arrived": "check-out",
			"Due out": "check-out",
			"Departed": "check-out",
			"Stayover": "inhouse",
			"Not Reserved": "check-out",
			"Not Defined": "check-out",
			"Day Use": "check-out",
			"Due out / Arrival": "check-out",
			"Departed / Arrival": "check-out",
			"Arrived / Departed": "check-out",
			"Due out / Departed": "check-out",
			"Arrived / Day use / Due out": "check-out",
			"Arrived / Day use / Due out / Departed": "check-out"
		};

		$scope.printWorkSheet = function() {
			window.print();
		};

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
		};

		// so this functionality has alterred a little
		// we now have a new argument - allUnassigned
		// if the user choose the option to view all rooms - showAllRooms
		// we will be using this new argument to create the filterRooms
		// the else case is just as before, no change
		$scope.filterUnassignedRooms = function(filter, rooms, allUnassigned, alreadyAssigned) {
			var filteredRooms = [];
			var filterObject = {};

			if ( filter.showAllRooms ) {
				// create an array of room ids that have been assigned
				var _rooms           = {},
					_assignedRoomIds = [],
					_unassigned      = [],
					_foundMatch;

				var i = j = k = l = 0;

				// loop through 'alreadyAssigned' list and push the room
				// ids to '_assignedRoomIds' array
				_.each(alreadyAssigned, function(each) {
					for (k = 0, l = each.rooms.length; k < l; k++) {
						_assignedRoomIds.push( each.rooms[k].id );
					};
				});

				// loop through 'allUnassigned', within that
				// loop through '_unassigned', within that
				// if the that ith room hasnt been assigned already
				// push that ith room into 'filteredRooms'
				for (i = 0, j = allUnassigned.length; i < j; i++) {
					_unassigned = allUnassigned[i]['unassigned'];
					for (k = 0, l = _unassigned.length; k < l; k++) {

						_foundMatch = _.find(_assignedRoomIds, function(id) {
							return id === _unassigned[k].id;
						});

						// only push this room in
						// if it has not been assigned already
						if ( !_foundMatch ) {
							filteredRooms.push( angular.copy(_unassigned[k]) );
						};
					};
				};
			} else {

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
										if (secondSplit[1].toString() && secondSplit[1].toString().toUpperCase() === "PM") {
											returnString = parseInt(returnString) + 12;
										} else {
											returnString = (parseInt(returnString) + 12) % 12;
										}
										if (returnString.toString().length < 2) {
											returnString = "0" + returnString.toString();
										}
										return returnString + ":" + secondSplit[0];
									} else {
										return "00:00";
									}
								};

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
			};

			return filteredRooms;
		};
	}
]);
