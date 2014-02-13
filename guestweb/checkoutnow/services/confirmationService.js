(function() {
	var confirmationService = function($rootScope,$q,baseWebService) {
		var details = {};
		
		var fetch = function() {
			var deferred = $q.defer();

			switch(hotelNamesEnum[$rootScope.hotelName]){

				case 1:
					baseWebService.fetch('/assets/fauxDB/confirmationPageDetails.json').then(function(response) {
					this.details = response;
					deferred.resolve(this.details);
				    });
					break;
                case 2:
                    baseWebService.fetch('/assets/fauxDB/confirmationPageDetailsForAnotherHotel.json').then(function(response) {
                    this.details = response;
                    deferred.resolve(this.details);
                    });
                    break;

				default:
					baseWebService.fetch('/assets/fauxDB/confirmationPageDetails.json.json').then(function(response) {
				    this.details = response;
				    deferred.resolve(this.details);
			         });
					break;

			}
			

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

