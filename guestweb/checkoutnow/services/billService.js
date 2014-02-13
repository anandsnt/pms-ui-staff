(function() {
	var BillService = function($q,baseWebService) {
		var bills = {};
		var billDisplayDetails = {};

		var fetchDisplayDetails = function() {
			var deferred = $q.defer();

			baseWebService.fetch('/assets/fauxDB/billDetails.json').then(function(response) {
				this.billDisplayDetails = response;
				deferred.resolve(this.billDisplayDetails);
			});
		

			return deferred.promise;
		};
		var fetchBillData = function() {
			var deferred = $q.defer();

			baseWebService.fetch('/assets/fauxDB/billData.json').then(function(response) {
				this.bills = response;
				deferred.resolve(this.bills);
			});
		

			return deferred.promise;
		};

		return {
			bills: bills,
			billDisplayDetails : billDisplayDetails,
			fetchDisplayDetails: fetchDisplayDetails,
			fetchBillData :fetchBillData
		}
	};

	var dependencies = [
		'$q','baseWebService',
		BillService
	];

	snt.factory('BillService', dependencies);
})();