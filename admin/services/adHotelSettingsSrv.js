admin.service('ADHotelSettingsSrv', ['$http', '$q', 'ADBaseWebSrvV2',
function($http, $q, ADBaseWebSrvV2) {

	/*
    * Service function to fetch the room key delivery data
    * @return {object} room key delivery data
    */
	this.fetch = function(){
		var deferred = $q.defer();
		//var url = '/admin/get_room_key_delivery_settings.json';
		var url = '/api/hotel_settings';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
	/*
    * Service function to update room key delivery settings
    * @return {object} status of update
    */
	this.update = function(data){
		var deferred = $q.defer();
		var url = '/api/hotel_settings/change_settings';

		ADBaseWebSrvV2.postJSON(url,data).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};


}]);
