(function() {
	var BillService = function($q,baseWebService) {
		var bills = {};

		var fetch = function() {
			var deferred = $q.defer();

			baseWebService.fetch('/assets/fauxDB/billDetails.json').then(function(response) {
				this.bills = response;
				deferred.resolve(this.bills);
			});
		

			return deferred.promise;
		};

		return {
			bills: bills,
			fetch: fetch
		}
	};

	var dependencies = [
		'$q','baseWebService',
		BillService
	];

	snt.factory('BillService', dependencies);
})();