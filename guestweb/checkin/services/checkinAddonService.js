(function() {
	var checkinAddonService = function($q, $http, $rootScope) {

		var getAddonList = function() {

			var deferred = $q.defer();
			var url = '/api/upsell_addons';
			var params = {'for_zest_web':true};
			params.application = (typeof $rootScope.application !== "undefined") ? $rootScope.application : "WEB";
			params.url_suffix = (typeof $rootScope.urlSuffix !== "undefined") ? $rootScope.urlSuffix : "";
			$http.get(url,{params:params}).success(function(response) {
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

			params.application = (typeof $rootScope.application !== "undefined") ? $rootScope.application : "WEB";
			params.url_suffix = (typeof $rootScope.urlSuffix !== "undefined") ? $rootScope.urlSuffix : "";
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
			params.application = (typeof $rootScope.application !== "undefined") ? $rootScope.application : "WEB";
			params.url_suffix = (typeof $rootScope.urlSuffix !== "undefined") ? $rootScope.urlSuffix : "";
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
		};

		var getExistingAddonsList = function() {

			var deferred = $q.defer();
			var url = '/staff/staycards/reservation_addons';
			var params = {
				'reservation_id': $rootScope.reservationID,
				'is_zest_product': true
			};
			$http.get(url, {params: params}).success(function(response) {
					if (response.status === 'success') {
						deferred.resolve(response.existing_packages);
					} else {
						deferred.reject();
					}

				})
				.error(function() {
					deferred.reject();
				});
			return deferred.promise;
		};

		return {
			getAddonList: getAddonList,
			updateAddon: updateAddon,
			deleteAddon: deleteAddon,
			fetchAlreadyAddedAddons: fetchAlreadyAddedAddons,
			getExistingAddonsList: getExistingAddonsList
		};
	};

	var dependencies = [
		'$q', '$http', '$rootScope',
		checkinAddonService
	];

	sntGuestWeb.factory('checkinAddonService', dependencies);
})();