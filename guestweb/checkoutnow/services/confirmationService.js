(function() {
	var confirmationService = function($rootScope,$q,baseWebService) {
		var details = {};
		
		var fetch = function() {
			var deferred = $q.defer();
            var url = '/assets/fauxDB/confirmationPageDetails.json';
	
            baseWebService.fetch(url).then(function(response) {
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
		'$rootScope',
		'$q','baseWebService',
		confirmationService
	];

	snt.factory('confirmationService', dependencies);
})();

