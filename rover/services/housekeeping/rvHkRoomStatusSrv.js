sntRover.service('RVHkRoomStatusSrv', [
	'$http',
	'$q',
	'$window',
	'BaseWebSrvV2',
	'$rootScope',
	function($http, $q, $window, BaseWebSrvV2, $rootScope) {

		this.initFilters = function() {
			return {
				"dirty": false,
				"pickup": false,
				"clean": false,
				"inspected": false,
				"out_of_order": false,
				"out_of_service": false,
				"vacant": false,
				"occupied": false,
				"stayover": false,
				"not_reserved": false,
				"arrival": false,
				"arrived": false,
				"dueout": false,
				"departed": false,
				"dayuse": false,
				"queued": false,
				"floorFilterSingle": '',
				"floorFilterStart": '',
				"floorFilterEnd": '',
				'showAllFloors': true,
				'filterByWorkTypeId': '',
				'filterByEmployeeName': ''
			};
		}

		this.currentFilters = this.initFilters();

		var that = this;


		var roomList = {};
		this.fetchRoomList = function(businessDate) {
			var deferred = $q.defer();
			var url = '/house/search.json?date=' + businessDate;

			if (roomList.hasOwnProperty('rooms') && roomList.rooms.length) {
				deferred.resolve(roomList);
			} else {
				$http.get(url)
					.success(function(response, status) {
						if (response.status == "success") {
							roomList = response.data;

							for (var i = 0, j = roomList.rooms.length; i < j; i++) {
								var room = roomList.rooms[i];

								// lets set this so that we can avoid
								room.display_room = true;

								// reduce scope search
								room.description = room.hk_status.description;

								room.is_occupied = room.is_occupied == 'true' ? true : false;
								room.is_vip = room.is_vip == 'true' ? true : false;

								// single calculate the class required
								// will require additional call from details page
								that.setRoomStatusClass(room, roomList.checkin_inspected_only);

								// set the leaveStatusClass or enterStatusClass value
								that.setReservationStatusClass(room);

								room.timeOrIn = calculateTimeOrIn(room);
								room.timeOrOut = calculateTimeOrOut(room);

								room.assigned_staff = calculateAssignedStaff(room);

								room.ooOsTitle = calculateOoOsTitle(room);
							}

							deferred.resolve(roomList);
						}
					}.bind(this))
					.error(function(response, status) {
						if (status == 401) {
							// 401- Unauthorized
							// so lets redirect to login page
							$window.location.href = '/house/logout';
						} else {
							deferred.reject(response);
						}
					});
			}

			return deferred.promise;
		}

		this.clearRoomList = function() {
			roomList = [];
		};

		// Get all floors for the current hotel.
		var hotelFloors = [];
		this.fetchFloors = function() {
			var deferred = $q.defer();
			var url = '/api/floors.json';

			if (hotelFloors.length) {
				deferred.resolve(hotelFloors);
			} else {
				BaseWebSrvV2.getJSON(url)
					.then(function(data) {
						hotelFloors = data.floors;
						deferred.resolve(hotelFloors);
					}, function(data) {
						deferred.reject(data);
					});
			};

			return deferred.promise;
		}

		// fetch all room types
		var roomTypes = [];
		this.fetchRoomTypes = function() {
			var url = 'api/room_types?exclude_pseudo=true&exclude_suite=true';
			var deferred = $q.defer();

			if (roomTypes.length) {
				deferred.resolve(roomTypes);
			} else {
				BaseWebSrvV2.getJSON(url)
					.then(function(data) {
						roomTypes = data.results;
						angular.forEach(roomTypes, function(type, i) {
							type.isSelected = false;
						});

						deferred.resolve(roomTypes);
					}, function(data) {
						deferred.reject(data);
					});
			};

			return deferred.promise;
		};


		// fetch all HK cleaning staffs
		var HKEmps = [];
		this.fetchHKEmps = function() {
			var url = "/api/work_statistics/employees_list";
			var deferred = $q.defer();

			if (HKEmps.length) {
				deferred.resolve(HKEmps);
			} else {
				BaseWebSrvV2.getJSON(url)
					.then(function(data) {
						HKEmps = data.results;
						deferred.resolve(HKEmps);
					}, function(data) {
						deferred.reject(data);
					});
			};

			return deferred.promise;
		};

		// get all all WorkTypes
		var workTypesList = [];
		this.fetchWorkTypes = function() {
			var deferred = $q.defer(),
				url = 'api/work_types';

			if (workTypesList.length) {
				deferred.resolve(workTypesList);
			} else {
				BaseWebSrvV2.getJSON(url)
					.then(function(data) {
						workTypesList = data.results;
						deferred.resolve(workTypesList);
					}.bind(this), function(data) {
						deferred.reject(data);
					});
			};

			return deferred.promise;
		};

		// get the dadwadadaw d
		this.fetchWorkAssignments = function(params) {
			var deferred = $q.defer(),
				url = 'api/work_assignments';

			BaseWebSrvV2.postJSON(url, params)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		};


		this.toggleFilter = function(item) {
			this.currentFilters[item] = !this.currentFilters[item];
		};

		this.isListEmpty = function() {
			if (roomList && roomList.rooms && roomList.rooms.length) {
				return false;
			} else {
				return true;
			}
		};


		// Moved from ctrl to srv as this is calculated only once
		// keept as msg so that it can be called from crtl if needed
		this.setRoomStatusClass = function(room, checkinInspectedOnly) {
			if (checkinInspectedOnly == "true") {
				if (room.hk_status.value == 'INSPECTED') {
					room.roomStatusClass = 'clean';
					return;
				}
				if ((room.hk_status.value == 'CLEAN' || room.hk_status.value == 'PICKUP')) {
					room.roomStatusClass = 'pickup';
					return;
				}
			} else {
				if ((room.hk_status.value == 'CLEAN' || room.hk_status.value == 'INSPECTED')) {
					room.roomStatusClass = 'clean';
					return;
				}
				if ((room.hk_status.value == 'PICKUP')) {
					room.roomStatusClass = 'pickup';
					return;
				}
			}

			if ((room.hk_status.value == 'DIRTY')) {
				room.roomStatusClass = 'dirty';
				return;
			}

			if (room.hk_status.value == 'OO' || room.hk_status.value == 'OS') {
				room.roomStatusClass = 'out';

				if (!!room.hk_status.oo_status) {
					if (roomList.checkin_inspected_only == "true") {
						if (room.hk_status.oo_status == 'INSPECTED') {
							room.roomStatusClassWithOO = 'clean';
							return;
						}
						if ((room.hk_status.oo_status == 'CLEAN' || room.hk_status.oo_status == 'PICKUP')) {
							room.roomStatusClassWithOO = 'pickup';
							return;
						}
					} else {
						if ((room.hk_status.oo_status == 'CLEAN' || room.hk_status.oo_status == 'INSPECTED')) {
							room.roomStatusClassWithOO = 'clean';
							return;
						}
						if ((room.hk_status.oo_status == 'PICKUP')) {
							room.roomStatusClassWithOO = 'pickup';
							return;
						}
					}
					if ((room.hk_status.oo_status == 'DIRTY')) {
						room.roomStatusClassWithOO = 'dirty';
						return;
					}
				};

				return;
			}
		};


		// Moved from ctrl to srv as this is calculated only once
		// keept as msg so that it can be called from crtl if needed
		this.setReservationStatusClass = function(room) {

			// room.leaveStatusClass is for first arrow. can be red(check-out), blue(inhouse) or gray(no-show)
			// room.enterStatusClass is for second arrow. can be green(check-in) or gray(no-show)
			switch (room.room_reservation_status) {
				case 'Due out':
					room.leaveStatusClass = 'check-out';
					room.enterStatusClass = 'no-show';
					break;

				case 'Stayover':
					room.leaveStatusClass = 'inhouse';
					room.enterStatusClass = 'no-show';
					break;

				case 'Departed':
					room.leaveStatusClass = 'check-out';
					room.enterStatusClass = 'no-show';
					break;

				case 'Arrival':
					room.leaveStatusClass = 'no-show';
					room.enterStatusClass = 'check-in';
					break;

				case 'Arrived':
					room.leaveStatusClass = 'no-show';
					room.enterStatusClass = 'check-in';
					break;

				case 'Due out / Arrival':
					room.leaveStatusClass = 'check-out';
					room.enterStatusClass = 'check-in';
					break;

				case 'Departed / Arrival':
					room.leaveStatusClass = 'check-out';
					room.enterStatusClass = 'check-in';
					break;

				case 'Arrived / Departed':
					room.leaveStatusClass = 'check-out';
					room.enterStatusClass = 'check-in';
					break;

				case 'Due out / Departed':
					room.leaveStatusClass = 'check-out';
					room.enterStatusClass = 'check-out';
					break;

				case 'Arrived / Day use / Due out':
					room.leaveStatusClass = 'check-out';
					room.enterStatusClass = 'no-show';
					break;

				case 'Arrived / Day use / Due out / Departed':
					room.leaveStatusClass = 'check-out';
					room.enterStatusClass = 'check-out';
					break;

				default:
					room.leaveStatusClass = 'no-show';
					room.enterStatusClass = 'no-show';
					break;
			}
		};

		// when user edit the room on details page
		// update that on the room list
		this.updateHKStatus = function(updatedRoom) {

			// disabled for now
			return;

			var newValue = updatedRoom.current_hk_status;

			var newDescription = newValue.toLowerCase();
			var fChar = newDescription[0].toUpperCase();
			var rChar = newDescription.slice(1);
			newDescription = fChar + rChar;

			var matchedRoom = _.find(roomList.rooms, function(room) {
				return parseInt(room.id) === updatedRoom.id;
			});

			matchedRoom.hk_status.value = newValue;
			matchedRoom.hk_status.description = newDescription;
			matchedRoom.description = newDescription;
			matchedRoom.roomStatusClass = this.setRoomStatusClass(matchedRoom);
		};


		/**
		 * CICO-8470 QA comment : Rooms filter for OOO/OOS does not display the correct rooms
		 * The methods setWorkStatus and setRoomStatus
		 *  just updates the property param with the value param passed into it for the room specified!
		 */
		this.setRoomStatus = function(id, property, value) {
			var matchedRoom = _.find(roomList.rooms, function(room) {
				return parseInt(room.id) === id;
			});
			matchedRoom[property] = value;
			matchedRoom.ooOsTitle = calculateOoOsTitle(matchedRoom);
		}

		this.setWorkStatus = function(id, status) {
			var matchedRoom = _.find(roomList.rooms, function(room) {
				return parseInt(room.id) === id;
			});
			matchedRoom.hk_status.description = status.description;
			matchedRoom.description = matchedRoom.hk_status.description;
			matchedRoom.hk_status.value = status.value;
			this.setRoomStatusClass(matchedRoom);
		}

		// set the arrival time or 'IN' text for arrivied
		var calculateTimeOrIn = function(room) {
			if (room.room_reservation_status.indexOf('Arrived') >= 0 && !(room.room_reservation_status.indexOf('Day use') >= 0)) {
				return 'IN'
			}
			if (room.room_reservation_status.indexOf('Arrival') >= 0) {
				return room.arrival_time;
			}
			return '';
		};

		// set the departure/latecheckout time or 'OUT' for departed
		var calculateTimeOrOut = function(room) {
			if (room.room_reservation_status.indexOf('Departed') >= 0) {
				return 'OUT'
			} else if (room.room_reservation_status.indexOf('Due out') >= 0) {
				return room.is_late_checkout == 'true' ? room.late_checkout_time : room.departure_time;
			}

			return '';
		};

		// calculate the assigned maid name and its class
		var calculateAssignedStaff = function(room) {
			if (!$rootScope.isStandAlone) {
				return false;
			};

			if (room.assignee_maid) {
				return {
					'name': angular.copy(room.assignee_maid),
					'class': 'assigned'
				}
			} else {
				return {
					'name': 'Unassigned',
					'class': 'unassigned'
				}
			}
		};

		// calculte the OO/OS title
		// in future the internal check may become common - to check only 'room_reservation_hk_status'
		var calculateOoOsTitle = function(room) {
			if ($rootScope.isStandAlone) {
				return room.room_reservation_hk_status == 2 ? 'Out of Service' :
					room.room_reservation_hk_status == 3 ? 'Out of Order' :
					false;
			} else {
				return room.hk_status.value == 'OS' ? 'Out of Service' :
					room.hk_status.value == 'OO' ? 'Out of Order' :
					false;
			}
		};
	}
]);