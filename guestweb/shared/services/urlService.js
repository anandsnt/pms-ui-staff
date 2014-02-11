(function() {
	var UrlService = function($http, $q) {
		var urls = {};

		var fetch = function() {
			var _this = this;
			var deferred = $q.defer();

			$http.get('assets/fauxDB/urls.json')
				.success(function(response) {
					_this.urls = response;
					deferred.resolve(_this.urls);
				})
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