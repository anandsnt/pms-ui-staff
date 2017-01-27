(function() {
	var checkinRoomUpgradeOptionsService = function($q, $http, $rootScope) {

	var responseData = {};

	// fetch texts to be displayed

	var fetch = function(data) {

		var deferred = $q.defer();
		var url = '/guest_web/upgrade_options.json';

		data.application = (typeof $rootScope.application !== "undefined") ? $rootScope.application : "";
		data.url_suffix = (typeof $rootScope.urlSuffix !== "undefined") ? $rootScope.urlSuffix : "";
		$http.get(url, {
			params: data
		}).then(function(response) {
			this.responseData = response.data;
			deferred.resolve(this.responseData);
		}, function() {
			deferred.reject();
		});
		return deferred.promise;
	};


	return {
		responseData: responseData,
		fetch: fetch
	};
};

var dependencies = [
'$q', '$http', '$rootScope',
checkinRoomUpgradeOptionsService
];

sntGuestWeb.factory('checkinRoomUpgradeOptionsService', dependencies);
})();