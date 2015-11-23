(function() {
	var LateCheckOutChargesService = function($http, $q, $rootScope) {
	var charges = {};

    var fetchLateCheckoutOptions = function() {
		var deferred = $q.defer();
		var url = '/guest_web/get_late_checkout_charges.json',
		parameters = {'reservation_id':$rootScope.reservationID};
		$http.get(url,{
			params: parameters
		}).success(function(response) {
			this.charges = response;
			deferred.resolve(this.charges);
		}.bind(this))
		.error(function() {
			deferred.reject();
		});
		return deferred.promise;
	};

	var postNewCheckoutOption = function(url,data) {

		var deferred = $q.defer();
		$http.post(url, data).success(function(response){
			deferred.resolve(response);
		}).error(function(){
			deferred.reject();
		});
		return deferred.promise;
	};


return {
	charges: charges,
	fetchLateCheckoutOptions: fetchLateCheckoutOptions,
	postNewCheckoutOption:postNewCheckoutOption
};
};

var dependencies = [
'$http',
'$q',
'$rootScope',
LateCheckOutChargesService
];

sntGuestWeb.factory('LateCheckOutChargesService', dependencies);
})();