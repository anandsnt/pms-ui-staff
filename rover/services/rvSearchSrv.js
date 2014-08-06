sntRover.service('RVSearchSrv',['$q', 'RVBaseWebSrv', '$vault', function($q, RVBaseWebSrv, $vault){
	
	var self = this;
	
	this.fetch = function(dataToSend, useCache){
		var deferred = $q.defer();
		dataToSend.fakeDataToAvoidCache = new Date();
		var url =  'search.json';

		if ( useCache && !!self.data ) {
			deferred.resolve( self.data );
		} else {
			RVBaseWebSrv.getJSON(url, dataToSend).then(function(data) {
				for(var i = 0; i < data.length; i++){
					data[i].is_row_visible = true;
				}

				self.data = data;
				deferred.resolve(data);
			},function(data){
				deferred.reject(data);
			});
		}		
		
		return deferred.promise;		
	};

	// update the room no. of cached data
	this.updateRoomDetails = function(confirmation, data) {
		if ( !self.data ) {
			return;
		};

		// update room related details based on confirmation id
		for (var i = 0, j = self.data.length; i < j; i++) {
			if ( self.data[i]['confirmation'] === confirmation ) {
				if ( data.room ) {
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
			};
		};
	};

	// update the room no. of cached data
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
	
	this.searchByCC = function(swipeData){
		var deferred = $q.defer();
		var url = '/staff/payments/search_by_cc';
		RVBaseWebSrv.postJSON(url, swipeData).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

}]);