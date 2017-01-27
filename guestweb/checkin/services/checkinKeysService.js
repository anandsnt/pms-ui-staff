(function() {
	var checkinKeysService = function($q, $http, $rootScope) {

		var responseData = {};

		var checkin = function(url, data) {

			var deferred = $q.defer();

			data.application = (typeof $rootScope.application !== "undefined") ? $rootScope.application : "WEB";
			data.url_suffix = (typeof $rootScope.urlSuffix !== "undefined") ? $rootScope.urlSuffix : "WEB";
			$http.post(url, data).then(function(response) {
					this.responseData = response.data;
					deferred.resolve(this.responseData);
				}, function() {
					deferred.reject();
				});
			return deferred.promise;
		};

		var fetchNoOfKeysData =  function(data) {
				var deferred = $q.defer();
				// var url = '/guest_web/reservations/'+data.reservation_id+'.json';
				var url = '/guest_web/zest_web_keys/' + data.reservation_id + '.json';

				$http.get(url, {params: data}).then(function(response) {
					deferred.resolve(response.data);
				}, function() {
					deferred.reject();
				});
				return deferred.promise;
		};

		var saveNoKeys = function(data) {
			var url = '/guest_web/zest_web_keys/' + data.reservation_id + '.json';
			var deferred = $q.defer();

			data.application = (typeof $rootScope.application !== "undefined") ? $rootScope.application : "WEB";
			data.url_suffix = (typeof $rootScope.urlSuffix !== "undefined") ? $rootScope.urlSuffix : "WEB";
			$http.put(url, data).then(function(response) {
					this.responseData = response.data;
					deferred.resolve(this.responseData);
				}, function() {
					deferred.reject();
				});
			return deferred.promise;
		};


		return {
			responseData: responseData,
			checkin: checkin,
			fetchNoOfKeysData: fetchNoOfKeysData,
			saveNoKeys: saveNoKeys
		};
	};

	var dependencies = [
		'$q', '$http', '$rootScope',
		checkinKeysService
	];

	sntGuestWeb.factory('checkinKeysService', dependencies);
})();