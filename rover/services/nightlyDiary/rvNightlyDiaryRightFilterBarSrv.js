angular.module('sntRover').service('RVNightlyDiaryRightFilterBarSrv',
	['$q',
	'BaseWebSrvV2',
	function($q, BaseWebSrvV2) {
		var that = this;
		
		/*
         * Fetch room type list
         * @param {data} object
         * return object
         */
		that.fetchRoomType = function(params) {
			var deferred = $q.defer(), 
				url = '/api/room_types.json?exclude_pseudo=true&exclude_suite=true';

			BaseWebSrvV2.getJSON(url, params).then(function(response) {
				deferred.resolve(response);
			}, function(error) {
				deferred.reject(error);
			});
			return deferred.promise;
		};
		
		/*
         * Fetch Floor list
         * @param {data} object
         * return object
         */
		that.fetchFloorList = function(params) {
			var deferred = $q.defer(), 
				url = '/api/floors.json';
				
			BaseWebSrvV2.getJSON(url, params).then(function(response) {
				deferred.resolve(response);
			}, function(error) {
				deferred.reject(error);
			});
			return deferred.promise;
		};
}]);