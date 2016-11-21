angular.module('sntRover').service('RVNightlyDiaryRoomNumberSearchSrv',
	['$q',
	'BaseWebSrvV2',
	function($q, BaseWebSrvV2) {
		var that = this;
		/*
		 * To fetch the rooms list
		 * on room number search.
		 * return object.
		 */
		this.fetchRoomSearchResults = function (data) {
			var deferred = $q.defer(),
				url = '/api/nightly_diary/room_number_search';
			BaseWebSrvV2.getJSON(url, data).then(function(response) {
				deferred.resolve(response);
			},function(error){
				deferred.reject(error);
			});
			return deferred.promise;
		};
}]);