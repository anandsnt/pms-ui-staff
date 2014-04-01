(function() {
	var BillService = function($q,baseWebService,$rootScope) {
		var bills = {};
		var billDisplayDetails = {};


	

		//fetch bill details

		var fetchBillData = function() {
			
			var deferred = $q.defer();

			baseWebService.fetch('/guest_web/home/bill_details.json',{'reservation_id':$rootScope.reservationID}).then(function(response) {
				this.bills = response;
				deferred.resolve(this.bills);
			});
			

			return deferred.promise;
		};

		return {
			bills: bills,
			billDisplayDetails : billDisplayDetails,
			fetchBillData :fetchBillData
		}
	};

	var dependencies = [
	'$q','baseWebService','$rootScope',
	BillService
	];

	snt.factory('BillService', dependencies);
})();