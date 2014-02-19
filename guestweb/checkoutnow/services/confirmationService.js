(function() {
	var confirmationService = function($rootScope,$q,baseWebService) {
		var details = {};
		
		var fetch = function() {
			var deferred = $q.defer();
            var url = ''

			switch(hotelNamesEnum[$rootScope.hotelName]){

				case 1:
                    url = '/assets/fauxDB/confirmationPageDetails.json';
					break;
                case 2:
                    
                    url = '/assets/fauxDB/confirmationPageDetailsForAnotherHotel.json';
                    break;

				default:
                    url = '/assets/fauxDB/confirmationPageDetailsForAnotherHotel.json';
                    break;

			}
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

