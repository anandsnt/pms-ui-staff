(function() {
	var checkinAddonService = function($q, $http, $rootScope) {

		var getAddonList = function() {

			var deferred = $q.defer();
			var url = '/sample_json/zestweb_v2/addon_list.json';

			$http.get(url).success(function(response) {
					deferred.resolve(response);
				})
				.error(function() {
					deferred.reject();
				});
			return deferred.promise;
		};

		return {
			getAddonList: getAddonList
		};
	};

	var dependencies = [
		'$q', '$http', '$rootScope',
		checkinAddonService
	];

	sntGuestWeb.factory('checkinAddonService', dependencies);
})();