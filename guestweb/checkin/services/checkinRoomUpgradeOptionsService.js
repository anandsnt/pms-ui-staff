(function() {
	var checkinRoomUpgradeOptionsService = function($q, $http, $rootScope, $window) {

	var responseData = {};

	// fetch texts to be displayed

	var fetch = function(data) {

		var deferred = $q.defer();
		var url = '/guest_web/upgrade_options.json';

		data.application = (typeof $rootScope.application !== "undefined") ? $rootScope.application : "";
		data.url_suffix = (typeof $rootScope.urlSuffix !== "undefined") ? $rootScope.urlSuffix : "";
		$http.get(url, {
			params: data
		}).success(function(response) {
			this.responseData = response;
			deferred.resolve(this.responseData);
		}.bind(this))
		.error(function() {
			deferred.reject();
		});
		return deferred.promise;
	};

	var sendGoogleAnalyticsEvents = function (params) {
		if ($rootScope.trackingID && $rootScope.trackingID.length > 0) {
			$window.ga('send', {
				hitType: 'event',
				eventCategory: params.eventCategory,
				eventAction: params.eventAction,
				eventLabel: params.eventLabel
			});
		}
	};


	return {
		responseData: responseData,
		fetch: fetch,
		sendGoogleAnalyticsEvents: sendGoogleAnalyticsEvents
	};
};

var dependencies = [
'$q', '$http', '$rootScope', '$window',
checkinRoomUpgradeOptionsService
];

sntGuestWeb.factory('checkinRoomUpgradeOptionsService', dependencies);
})();