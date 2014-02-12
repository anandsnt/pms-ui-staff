(function() {
	var UserService = function($http, $q,baseWebService) {
		var user = {};

		var fetch = function() {
			var deferred = $q.defer();

			baseWebService.fetch('assets/fauxDB/userDetails.json').then(function(response) {
					this.user = response;
					deferred.resolve(this.user);
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
		'$q','baseWebService',
		UserService
	];

	snt.factory('UserService', dependencies);
})();