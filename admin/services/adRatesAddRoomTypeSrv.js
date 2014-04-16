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

	this.saveRoomTypes = function(updateData) {

		var data = updateData.room_type_ids;
		console.log(data)
		var id   = updateData.id;
		var deferred = $q.defer();
		var url = "/api/"+id+"/room_types";
		ADBaseWebSrvV2.putJSON(url,data).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
}]);
