admin.service('ADRatesAddRoomTypeSrv', ['$q', 'ADBaseWebSrvV2',
function($q, ADBaseWebSrvV2) {

	this.fetchRoomTypes = function() {
		var deferred = $q.defer();
		var url = "/api/room_types.json";
		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

}]);
