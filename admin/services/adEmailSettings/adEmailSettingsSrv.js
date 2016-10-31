admin.service('ADEmailSettingsSrv', ['$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function($q, ADBaseWebSrv, ADBaseWebSrvV2) {

	var mapKeyNames = function(data){
		data.items = data.rooms.map(item => ({
				id: item.id,
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
		var url = '/api/floors/44.json';

		ADBaseWebSrvV2.getJSON(url, params).then(function(data) {
			data = mapKeyNames(data);
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};


	this.fetchUnselectedList = function(params) {
		var deferred = $q.defer();

		var url = '/api/floors/rooms';

		ADBaseWebSrvV2.getJSON(url, params).then(function(data) {
			data = mapKeyNames(data);
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

}]);