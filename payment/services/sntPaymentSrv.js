sntPay.service('sntPaymentSrv', ['$q', '$http',
	function($q, $http) {

		this.submitPayment = function(dataToSrv) {

			//TO DO polling


			var deferred = $q.defer();
			var url = 'api/reservations/' + dataToSrv.reservation_id + '/submit_payment';
			$http.post(url,dataToSrv.postData).success(function(response) {
					deferred.resolve(response);
				}.bind(this))
				.error(function(error) {
					deferred.reject(error);
				});
			return deferred.promise;
		};
	}
]);