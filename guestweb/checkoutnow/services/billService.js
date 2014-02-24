(function() {
	var BillService = function($q,baseWebService,$rootScope) {
		var bills = {};
		var billDisplayDetails = {};


		//fetch texts to be displayed

		var fetchDisplayDetails = function() {
			
			var deferred = $q.defer();

			baseWebService.fetch('/assets/fauxDB/billDisplayDetails.json').then(function(response) {
				this.billDisplayDetails = response;
				deferred.resolve(this.billDisplayDetails);
			});
			

			return deferred.promise;
		};

		//fetch bill details

		var fetchBillData = function() {
			
			var deferred = $q.defer();

			baseWebService.fetch('/guest_web/home/bill_details.json',{'reservation_id':$rootScope.reservationID}).then(function(response) {
				this.bills = response;
				deferred.resolve(this.bills);

				console.log(response)
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
	'$q','baseWebService','$rootScope',
	BillService
	];

	snt.factory('BillService', dependencies);
})();