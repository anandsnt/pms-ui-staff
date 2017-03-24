(function() {
	var checkinAddonService = function($q, $http, $rootScope) {

		var getAddonList = function() {

			var deferred = $q.defer();
			//var url = '/sample_json/zestweb_v2/addon_list.json';
			var url = '/api/upsell_addons?for_zest_web=true';
			$http.get(url).success(function(response) {
					deferred.resolve(response);
				})
				.error(function() {
					deferred.reject();
				});
			return deferred.promise;
		};

		var updateAddon = function(params) {

			var deferred = $q.defer();
			var url = '/api/reservations/update_package';

			params.id = $rootScope.reservationID;
			$http.post(url, params).success(function(response) {
					deferred.resolve(response);
				})
				.error(function() {
					deferred.reject();
				});
			return deferred.promise;
		};

		var deleteAddon = function(params) {

			var deferred = $q.defer();
			var url = '/api/reservations/delete_package';

			params.id = $rootScope.reservationID;
			$http.post(url, params).success(function(response) {
					deferred.resolve(response);
				})
				.error(function() {
					deferred.reject();
				});
			return deferred.promise;
		};

		var fetchAlreadyAddedAddons = function() {
			var deferred = $q.defer();
			var url = "/api/reservations/" + $rootScope.reservationID + "/addons_list";
			$http.get(url).success(function(response) {
					if (response.status === "success") {
						deferred.resolve(response.data);
					} else {
						deferred.reject();
					}

				})
				.error(function() {
					deferred.reject();
				});
			return deferred.promise;
		}

		return {
			getAddonList: getAddonList,
			updateAddon: updateAddon,
			deleteAddon: deleteAddon,
			fetchAlreadyAddedAddons: fetchAlreadyAddedAddons
		};
	};

	var dependencies = [
		'$q', '$http', '$rootScope',
		checkinAddonService
	];

	sntGuestWeb.factory('checkinAddonService', dependencies);
})();