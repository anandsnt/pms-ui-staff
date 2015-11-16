(function() {
var BillService = function($q,baseWebService,$rootScope,$http) {
	var bills = {};
	var billDisplayDetails = {};

	//fetch bill details
	var fetchBillData = function() {
		var deferred = $q.defer();
		var url = '/guest_web/home/bill_details.json',
		parameters = {'reservation_id':$rootScope.reservationID};
		$http.get(url,{
			params: parameters
		}).success(function(response) {
			this.bills = response;
			deferred.resolve(this.bills);
		}.bind(this))
		.error(function() {
			deferred.reject();
		});
		return deferred.promise;
	};

	return {
		bills: bills,
		billDisplayDetails : billDisplayDetails,
		fetchBillData :fetchBillData
	};
};

var dependencies = [
'$q','baseWebService','$rootScope','$http',
BillService
];

sntGuestWeb.factory('BillService', dependencies);
})();