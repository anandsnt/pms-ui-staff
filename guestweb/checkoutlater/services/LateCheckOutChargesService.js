(function() {
	var LateCheckOutChargesService = function($http, $q, $rootScope) {
	var charges = {};
	
    var fetch = function() {
	// return deferred.promise;
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

return {
	charges: charges,
	fetch: fetch
}
};

var dependencies = [
'$http',
'$q',
'$rootScope',
LateCheckOutChargesService
];

snt.factory('LateCheckOutChargesService', dependencies);
})();