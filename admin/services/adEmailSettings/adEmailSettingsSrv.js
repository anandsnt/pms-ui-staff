admin.service('ADEmailSettingsSrv', ['$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function($q, ADBaseWebSrv, ADBaseWebSrvV2) {
	/**
	 * To fetch the saved account receivable status
	 */
	this.fetchSelectedCheckinRoomExclusionList = function(params) {

		var deferred = $q.defer();
		var url = '/api/floors/44.json';

		ADBaseWebSrvV2.getJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};


	this.fetchUnselectedCheckinRoomExclusionList = function(params) {
		var deferred = $q.defer();

		var url = '/api/floors/rooms';

		ADBaseWebSrvV2.getJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
	 * [processSelectedRooms remove the unselected item]
	 * @param  {[type]} roomIds [description]
	 * @return {[type]}         [description]
	 */
	this.processSelectedRooms = function(roomIds, currentPageList) {

		var selectedRooms = _.where(currentPageList, {
				isSelected: true
			}),
			currentPageRoomIds = _.pluck(selectedRooms, 'id');

		roomIds = _.union(roomIds, currentPageRoomIds);

		_.each(currentPageList, function(room) {
			_.each(roomIds, function(roomId, key) {
				if (room.id === roomId && !room.isSelected) {
					roomIds.splice(key, 1);
				}
			});
		});
		return roomIds;
	};

	/**
	 * [handleCurrentSelectedPage on page change, mark already selected item as selected]
	 * @param  {[type]} alreadyChosenRoomIds [description]
	 * @return {[type]}                      [description]
	 */
	this.handleCurrentSelectedPage = function(alreadyChosenRoomIds, currentPageList) {
		_.each(currentPageList, function(room) {
			_.each(alreadyChosenRoomIds, function(roomId, key) {
				if (room.id === roomId) {
					room.isSelected = true;
				}
			});
		});
		return currentPageList;
	};

}]);