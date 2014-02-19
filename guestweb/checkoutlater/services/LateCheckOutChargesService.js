(function() {
	var LateCheckOutChargesService = function($http, $q, $rootScope,baseWebService) {
		var charges = {};

		var fetch = function() {
			var deferred = $q.defer();


			// baseWebService.fetch('/guest_web/get_late_checkout_charges.json',{'reservation_id':$rootScope.reservationID}).then(function(response) {
			// 	this.charges = response;
			// 	deferred.resolve(this.charges);
			// })

			$http.get('/guest_web/get_late_checkout_charges.json',{
    		params: {'reservation_id':$rootScope.reservationID}
			})
				.success(function(response) {
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
		'$rootScope','baseWebService',
		LateCheckOutChargesService
	];

	snt.factory('LateCheckOutChargesService', dependencies);
})();