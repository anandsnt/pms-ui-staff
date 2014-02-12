(function() {
	var UrlService = function($http, $q,baseWebService) {
		var urls = {};

		var fetch = function() {
			var deferred = $q.defer();


			baseWebService.fetch('assets/fauxDB/urls.json').then(function(response) {
					this.urls = response;
					deferred.resolve(this.urls);
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
		'$q','baseWebService',
		UrlService
	];

	snt.factory('UrlService', dependencies);
})();