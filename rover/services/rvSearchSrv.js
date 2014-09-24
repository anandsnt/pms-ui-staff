sntRover.service('RVSearchSrv',['$q', 'RVBaseWebSrv','rvBaseWebSrvV2', '$vault', function($q, RVBaseWebSrv, rvBaseWebSrvV2, $vault){
	
	var self = this;
	
	this.fetch = function(dataToSend, useCache){
		var deferred = $q.defer();
		dataToSend.fakeDataToAvoidCache = new Date();
		var url =  'search.json';

		if ( useCache && !!self.data ) {
			deferred.resolve( self.data );
		} else {

		// to remove the if and keep else
			if(dataToSend.status =="PRECHECKIN"){
				var sampleUrl = '/ui/show?format=json&json_input=preckin/preckin.json';
				RVBaseWebSrv.getJSON(sampleUrl).then(function(data) {
				for(var i = 0; i < data.length; i++){
					data[i].is_row_visible = true;
				}

				self.data = data;
				deferred.resolve(data);
			},function(data){
				deferred.reject(data);
			});

			}
			else{

			}
		}		
		
		return deferred.promise;		
	};

	// update the reservation details of cached data
	this.updateRoomDetails = function(confirmation, data) {
		if ( !self.data ) {
			return;
		};

		// update room related details based on confirmation id
		for (var i = 0, j = self.data.length; i < j; i++) {
			if ( self.data[i]['confirmation'] === confirmation ) {

				// special check since the ctrl could ask to set room number to null
				if ( data.hasOwnProperty('room') ) {
					self.data[i]['room'] = data.room;
				}

				if ( data['reservation_status'] ) {
					self.data[i]['reservation_status'] = data['reservation_status'];
				}

				if ( data['roomstatus'] ) {
					self.data[i]['roomstatus'] = data['roomstatus'];
				}

				if ( data['fostatus'] ) {
					self.data[i]['fostatus'] = data['fostatus'];
				}

				if ( data['room_ready_status'] ) {
					self.data[i]['room_ready_status'] = data['room_ready_status'];
				}

				if ( data['is_reservation_queued'] ) {
					self.data[i]['is_reservation_queued'] = data['is_reservation_queued'];
				}

				if ( data['is_queue_rooms_on'] ) {
					self.data[i]['is_queue_rooms_on'] = data['is_queue_rooms_on'];
				}

				if ( data['late_checkout_time'] ) {
					self.data[i]['late_checkout_time'] = data['late_checkout_time'];
				}

				if ( data['is_opted_late_checkout'] ) {
					self.data[i]['is_opted_late_checkout'] = data['is_opted_late_checkout'];
				}
			}

			// if not then check if this room number is assigned to any other reservation
			// if so remove the room no from that reservation
			else if ( data.hasOwnProperty('room') && data['room'] === self.data[i]['room'] ) {
				self.data[i]['room'] = '';
			}
		};
	};

	// update the guest details of cached data
	this.updateGuestDetails = function(guestid, data) {
		if ( !self.data ) {
			return;
		};

		// update guest details based on the guest id(s)
		for (var i = 0, j = self.data.length; i < j; i++) {
			if ( self.data[i]['guest_detail_id'] === guestid ) {
				if ( data['firstname'] ) {
					self.data[i]['firstname'] = data['firstname'];
				}

				if ( data['lastname'] ) {
					self.data[i]['lastname'] = data['lastname'];
				};

				if ( data['location'] ) {
					self.data[i]['location'] = data['location'];
				};

				if ( typeof data['vip'] === 'boolean' ) {
					self.data[i]['vip'] = data['vip'];
				};
			};
		};
	};
	//self.searchByCCData = {};
	this.searchByCC = function(swipeData){
		var deferred = $q.defer();
		var url = '/staff/payments/search_by_cc';
		RVBaseWebSrv.postJSON(url, swipeData).then(function(data) {
			deferred.resolve(data);
			self.data = data;
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
	this.fetchReservationsToPostCharge = function(dataToSrv){
		var deferred = $q.defer();
		if(dataToSrv.refreshApi){
			var url = 'api/reservations/search_reservation';
			rvBaseWebSrvV2.postJSON(url, dataToSrv.postData).then(function(data) {
				deferred.resolve(data);
				self.reservationsList = data;
			}, function(data) {
				deferred.reject(data);
			});
		} else {
			deferred.resolve(self.reservationsList);
		}
		
		return deferred.promise;
	};

}]);