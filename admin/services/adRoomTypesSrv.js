admin.service('ADRoomTypesSrv', ['$http', '$q', 'ADBaseWebSrv','ADBaseWebSrvV2', 'ADDailyWorkAssignmentSrv',
	function($http, $q, ADBaseWebSrv,ADBaseWebSrvV2, ADDailyWorkAssignmentSrv) {
		/**
		 * To fetch the list of room types
		 * @return {object} room types list json
		 */
		this.fetch = function() {

			var deferred = $q.defer();
			var url = '/admin/room_types.json';

			ADBaseWebSrv.getJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		this.fetchRoomClasses = function () {
	        var deferred = $q.defer(),
	        url = '/admin/room_classes';
	        ADBaseWebSrvV2.getJSON(url).then(function (data) {
	            deferred.resolve(data);
	            }, function (data) {
	                deferred.reject(data);
	            });
	            return deferred.promise;
    	};
    	/*
		 * To get the available room types for suite
		 * @return array available room types for suite
		 */
    	this.fetchRoomTypesAvailableForSuite = function () {
	        var deferred = $q.defer(),
	        url = '/admin/room_types/available_for_suite';
	        ADBaseWebSrvV2.getJSON(url).then(function (data) {
	            deferred.resolve(data);
	            }, function (data) {
	                deferred.reject(data);
	            });
	            return deferred.promise;
    	};

		/*
		 * To get the details of the selected room type
		 * @param {array} selected room type id
		 * @return {object} selected room type details
		 */
		this.getRoomTypeDetails = function(data) {
			var deferred = $q.defer();
			var id = data.id;
			var url = '/admin/room_types/' + id + '/edit.json';

			ADBaseWebSrv.getJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};
		/*
		 * To update room types data
		 * @param {array} data of the modified room type
		 * @return {object} status of updated room type
		 */
		this.updateRoomTypes = function(data) {

			var deferred = $q.defer();
			var url = '/admin/room_types/' + data.room_type_id;
			ADBaseWebSrv.putJSON(url, data).then(function(data) {
				deferred.resolve(data);
				ADDailyWorkAssignmentSrv.resetRoomTypesList();
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};
		this.deleteRoomTypes = function(data) {
			var deferred = $q.defer();
			var url = '/admin/room_types/' + data.roomtype_id;
			ADBaseWebSrv.deleteJSON(url).then(function(data) {
			deferred.resolve(data);
			},function(errorMessage){
			deferred.reject(errorMessage);
			});
		return deferred.promise;
		};
		/*
		 * To import room
		 * @return {object} status of import
		 */
		this.importFromPms = function() {
			var deferred = $q.defer();
			var url = '/admin/rooms/import';

			ADBaseWebSrv.getJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};


		/*
		 * To create room type
		 * @param {array} data of the  room type
		 * @return {object} status
		 */
		this.createRoomType = function(data) {

			var deferred = $q.defer();
			var url = '/admin/room_types/';
			ADBaseWebSrv.postJSON(url, data).then(function(data) {
				deferred.resolve(data);
				ADDailyWorkAssignmentSrv.resetRoomTypesList();
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};
	}
]);