(function() {
	var LateCheckOutChargesService = function($http, $q, $rootScope,baseWebService) {
		var charges = {};

		// var fetch = function() {
		// 	var deferred = $q.defer();
		// 	console.log('................');
		
		// 	$http.get('/guest_web/get_late_checkout_charges.json',{params:{'reservation_id':$rootScope.reservationID}})
		// 		.success(function(response) {
		// 			this.charges = response;
		// 			deferred.resolve(this.charges);
		// 		}.bind(this))
		// 		.error(function() {
		// 			deferred.reject();
		// 		});

		// 	return deferred.promise;
		// };
		var fetch = function() {
			var deferred = $q.defer();
<<<<<<< HEAD

			baseWebService.fetch('/guest_web/get_late_checkout_charges.json',{'reservation_id':$rootScope.reservationID}).then(function(response) {
				this.charges = response;
				deferred.resolve(this.charges);
			})
=======
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
>>>>>>> 164c4ce46bce2c95cd7118766e635eeff62fa232

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