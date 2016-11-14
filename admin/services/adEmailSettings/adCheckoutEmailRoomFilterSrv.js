admin.service('ADCheckoutEmailRoomFilterSrv', ['$q', 'ADBaseWebSrv', function($q, ADBaseWebSrv) {

	var mapKeyNames = function(data) {
		data.items = data.rooms.map(function(item) {
			return {
				id: item.room_id,
				item_number: item.room_number,
				item_desc: item.room_type
			}
		});
		delete data.rooms;
		return data;
	};

	this.fetchSelectedList = function(params) {
		var deferred = $q.defer(),
			url = '/admin/hotel_rooms.json';

		params.is_excluded_from_checkout_notification = true;
		ADBaseWebSrv.getJSON(url, params).then(function(data) {
			data = mapKeyNames(data);
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};


	this.fetchUnselectedList = function(params) {
		var deferred = $q.defer(),
			url = '/admin/hotel_rooms.json';

		params.is_excluded_from_checkout_notification = false;
		ADBaseWebSrv.getJSON(url, params).then(function(data) {
			data = mapKeyNames(data);
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

}]);