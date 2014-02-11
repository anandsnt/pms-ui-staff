(function() {
	var UserService = function($http, $q) {
		var user = {};

		var fetch = function() {
			var _this = this;
			var deferred = $q.defer();

			$http.get('assets/fauxDB/userDetails.json')
				.success(function(response) {
					_this.user = response;
					deferred.resolve(_this.user);
				})
				.error(function() {
					deferred.reject();
				});

			return deferred.promise;
		};

		return {
			user: user,
			fetch: fetch
		}
	};

	var dependencies = [
		'$http',
		'$q',
		UserService
	];

	snt.factory('UserService', dependencies);
})();