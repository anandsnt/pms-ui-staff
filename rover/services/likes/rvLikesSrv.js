angular.module('sntRover').service('RVLikesSrv', ['$q', 'RVBaseWebSrv', function($q, RVBaseWebSrv) {

	this.fetchLikes = function(param) {
		var deferred = $q.defer();

		if (param.isRefresh === true) {
			var userId = param.userId;
			var url = '/staff/preferences/likes.json?user_id=' + userId;

			RVBaseWebSrv.getJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
		}
		return deferred.promise;
	};

	this.saveLikes = function(param) {
		var deferred = $q.defer();
		var dataToSend = param.data;
		var url = '/staff/guest_cards/' + param.userId + '/update_preferences';

		RVBaseWebSrv.postJSON(url, dataToSend).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;

	};


}]);