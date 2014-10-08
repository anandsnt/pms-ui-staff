sntRover.service('RVHkRoomStatusSrv', [
	'$http',
	'$q',
	'$window',
	'BaseWebSrvV2',
	function($http, $q, $window, BaseWebSrvV2) {

		this.roomList = {};
		
		this.initFilters = function(){
			return {	
					"dirty" : false,
					"pickup": false,
					"clean" : false,
					"inspected" : false,
					"out_of_order" : false,
					"out_of_service" : false,
					"vacant" : false,
					"occupied" : false,
					"stayover" : false,
					"not_reserved" : false,
					"arrival" : false,
					"arrived" : false,
					"dueout" : false,
					"departed" : false,
					"dayuse": false,
					"queued": false,
					"floorFilterSingle": '',
					"floorFilterStart": '',
					"floorFilterEnd": '',
					'showAllFloors': true,
					'filterByWorkType': '',
					'filterByEmployee': ''
				};
		}

		this.currentFilters = this.initFilters();
		
		var that = this;
		this.fetch = function(businessDate) {
			var deferred = $q.defer();
			var url = '/house/search.json?date='+ businessDate;
			
			$http.get(url)
				.success(function(response, status) {
					if(response.status == "success"){
					    this.roomList = response.data;

					    for (var i = 0, j = this.roomList.rooms.length; i < j; i++) {
					    	var room = this.roomList.rooms[i];

					    	// lets set this so that we can avoid
					    	room.display_room = true;

					    	// reduce scope search
					    	room.description = room.hk_status.description
					    	
					    	room.is_occupied = room.is_occupied == 'true' ? true : false;
					    	room.is_vip = room.is_vip == 'true' ? true : false;

					    	// single calculate the class required
					    	// will require additional call from details page
					    	room.roomStatusClass = that.setRoomStatusClass(room);

					    	// set the leaveStatusClass or enterStatusClass value
					    	that.setReservationStatusClass(room);
					    }

					    deferred.resolve(this.roomList);
					}else{
					}
					
				}.bind(this))
				.error(function(response, status) {
				    if(status == 401){ 
				    	// 401- Unauthorized
		    			// so lets redirect to login page
						$window.location.href = '/house/logout' ;
		    		}else{
		    			deferred.reject(response);
		    		}
				});

			return deferred.promise;
		}

		// Get all floors for the current hotel. 
		this.fetch_floors = function(){
			var deferred = $q.defer();
			var url = '/api/floors.json';
			
			$http.get(url)
				.success(function(response, status) {
					if(response.floors){
					    this.floorList = response.floors;
					    deferred.resolve(this.floorList);
					}else{
					}
					
					
				}.bind(this))
				.error(function(response, status) {
				    if(status == 401){ 
				    	// 401- Unauthorized
		    			// so lets redirect to login page
						$window.location.href = '/house/logout' ;
		    		}else{
		    			deferred.reject(response);
		    		}
				});

			return deferred.promise;
		}

		// fetch all room types
		var that = this;
		this.allRoomTypes = {};
		this.fetchAllRoomTypes = function(){
			var url =  'api/room_types?exclude_pseudo=true&exclude_suite=true';	
			var deferred = $q.defer();

			BaseWebSrvV2.getJSON(url)
				.then(function(data) {
					angular.forEach(data.results, function(roomType, i) {
						roomType.isSelected = false;
						that.allRoomTypes[roomType.id] = roomType;
					});
					deferred.resolve(that.allRoomTypes);
				}, function(data){
					deferred.reject(data);
				});

			return deferred.promise;
		};


		// fetch all HK cleaning staffs
		var HKMaids = [];
		this.fetchHKMaids = function() {
			var url = "/api/work_statistics/employees_list";
			var deferred = $q.defer();

			if ( HKMaids.length ) {
				deferred.resolve(HKMaids);
			} else {
				BaseWebSrvV2.getJSON(url)
					.then(function(data) {
						HKMaids = data.results;
						deferred.resolve(HKMaids);
					}, function(data){
						deferred.reject(data);
					});
			};

			return deferred.promise;
		};

		// get all all WorkTypes
		var workTypesList = [];
		this.getWorkTypes = function() {
			var deferred = $q.defer(),
				url = 'api/work_types';

			if ( workTypesList.length ) {
				deferred.resolve(workTypesList);
			} else {
				BaseWebSrvV2.getJSON(url)
					.then(function(data) {
						workTypesList = data.results;
						deferred.resolve(workTypesList);
					}.bind(this), function(data){
						deferred.reject(data);
					});
			};

			return deferred.promise;
		};



		this.toggleFilter = function(item) {
			this.currentFilters[item] = !this.currentFilters[item];
		};

		this.isListEmpty = function() {
			if( this.roomList && this.roomList.rooms && this.roomList.rooms.length ) {
				return false;
			} else {
				return true;
			}
		};

		// Moved from ctrl to srv as this is calculated only once
		// keept as msg so that it can be called from crtl if needed
		this.setRoomStatusClass = function(room){
			if(this.roomList.checkin_inspected_only == "true"){
				if(room.hk_status.value == 'INSPECTED') {
					return 'clean';
				}
				if((room.hk_status.value == 'CLEAN' || room.hk_status.value == 'PICKUP')) {
					return 'pickup';
				}
			} else {
				if((room.hk_status.value == 'CLEAN' || room.hk_status.value == 'INSPECTED')) {
					return 'clean';
				}
				if((room.hk_status.value == 'PICKUP')) {
					return 'pickup';
				}
			}

			if( (room.hk_status.value == 'DIRTY') ) {
				return 'dirty';
			}

			if( room.hk_status.value == 'OO' || room.hk_status.value == 'OS' ) {
				return 'out';
			}

			return '';
		};

		// Moved from ctrl to srv as this is calculated only once
		// keept as msg so that it can be called from crtl if needed
		this.setReservationStatusClass = function(room) {

			// room.leaveStatusClass is for first arrow. can be red(check-out), blue(inhouse) or gray(no-show)
			// room.enterStatusClass is for second arrow. can be green(check-in) or gray(no-show)
			switch(room.room_reservation_status) {
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
					room.enterStatusClass = 'check-out';
					break;

				case 'Arrived / Day Use / Due out / Departed':
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
			var newValue = updatedRoom.current_hk_status;

			var newDescription = newValue.toLowerCase();
			var fChar          = newDescription[0].toUpperCase();
			var rChar          = newDescription.slice(1);
			newDescription     = fChar + rChar;

			var matchedRoom = _.find(this.roomList.rooms, function(room) {
				return parseInt(room.id) === updatedRoom.id;
			});

			matchedRoom.hk_status.value       = newValue;
			matchedRoom.hk_status.description = newDescription;
			matchedRoom.description           = newDescription;
			matchedRoom.roomStatusClass       = this.setRoomStatusClass(matchedRoom);
		};
	}
]);