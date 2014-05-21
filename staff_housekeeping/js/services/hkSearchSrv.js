hkRover.service('HKSearchSrv',['$http', '$q', '$window', function($http, $q, $window){

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
				"dayuse": false
				};
	}

	this.currentFilters = this.initFilters();
	
	this.fetch = function(){
		var deferred = $q.defer();
		var url = '/house/search.json';
		
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
				    	room.roomStatusClass = this.setRoomStatusClass(room);
				    }

				    deferred.resolve(this.roomList);
				}else{
					console.log( 'Server request failed' );
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
			if(room.hk_status.value == 'INSPECTED' && !room.is_occupied) {
				return 'room-clean';
			}
			if((room.hk_status.value == 'CLEAN' || room.hk_status.value == 'PICKUP') && !room.is_occupied) {
				return 'room-pickup';
			}
		}
		else {
			if((room.hk_status.value == 'CLEAN' || room.hk_status.value == 'INSPECTED') && !room.is_occupied) {
				return 'room-clean';
			}
			if((room.hk_status.value == 'PICKUP') && !room.is_occupied) {
				return 'room-pickup';
			}
		}

		if((room.hk_status.value == 'DIRTY') && !room.is_occupied) {
			return 'room-dirty';
		}
		if(room.hk_status.value == 'OO' || room.hk_status.value == 'OS'){
			return 'room-out';
		}
		return '';
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

}]);