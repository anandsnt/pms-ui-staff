(function() {
	var UrlService = function($http, $q) {
		var urls = {};

		var fetch = function() {
			var deferred = $q.defer();

			$http.get('assets/fauxDB/urls.json')
				.success(function(response) {
					this.urls = response;
					deferred.resolve(this.urls);
				}.bind(this))
				.error(function() {
					deferred.reject();
				});

			return deferred.promise;
		};

		return {
			urls: urls,
			fetch: fetch
		}
	};

	var dependencies = [
		'$http',
		'$q',
		UrlService
	];

	snt.factory('UrlService', dependencies);
})();