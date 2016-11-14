admin.service('ADEmailSettingsSrv', ['$q', 'ADBaseWebSrv', function($q, ADBaseWebSrv) {

	var mapKeyNames = function(data) {
		data.items = data.rooms.map(item => ({
			id: item.room_id,
			item_number: item.room_number,
			item_desc: item.room_type
		}));
		delete data.rooms;
		return data;
	};
	/**
	 * To fetch the saved account receivable status
	 */
	this.fetchSelectedList = function(params) {

		var deferred = $q.defer();
		var url = '/admin/hotel_rooms.json';

		ADBaseWebSrv.getJSON(url, params).then(function(data) {
			data = mapKeyNames(data);
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};


	this.fetchUnselectedList = function(params) {
		var deferred = $q.defer();

		var url = '/admin/hotel_rooms.json';

		ADBaseWebSrv.getJSON(url, params).then(function(data) {
			data = mapKeyNames(data);
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

}]);