(function() {
	var UserService = function($http, $q) {
		var user = {};

		var fetch = function() {
			var deferred = $q.defer();

			$http.get('assets/fauxDB/userDetails.json')
				.success(function(response) {
					this.user = response;
					deferred.resolve(this.user);
				}.bind(this))
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