(function() {
	var confirmationService = function($q,baseWebService) {
		var details = {};

		var fetch = function() {
			var deferred = $q.defer();

			baseWebService.fetch('/assets/fauxDB/confirmationPageDetails.json').then(function(response) {
				this.details = response;
				deferred.resolve(this.details);
			});


			return deferred.promise;
		};

		return {
			details: details,
			fetch: fetch
		}
	};

	var dependencies = [
		'$q','baseWebService',
		confirmationService
	];

	snt.factory('confirmationService', dependencies);
})();

