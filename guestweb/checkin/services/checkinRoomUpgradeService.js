	(function() {
		var checkinRoomUpgradeService = function($q,$http,$rootScope) {

			var responseData = {};

	//fetch texts to be displayed

	var post = function(data) {
		var deferred = $q.defer();
		var url = '/guest_web/upgrade_room.json';
		data.application = (typeof $rootScope.application !=="undefined") ? $rootScope.application : "";
		data.url_suffix = (typeof $rootScope.urlSuffix !=="undefined") ? $rootScope.urlSuffix : "";
		$http.post(url,data).success(function(response) {
			this.responseData = response;
			deferred.resolve(this.responseData);
		}.bind(this))
		.error(function() {
			deferred.reject();
		});
		return deferred.promise;
	};

	return {
		responseData: responseData,
		post : post
	};
};

var dependencies = [
'$q','$http','$rootScope',
checkinRoomUpgradeService
];

sntGuestWeb.factory('checkinRoomUpgradeService', dependencies);
})();