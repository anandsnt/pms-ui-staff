sntPay.service('paymentSrv', ['$q', '$http',
	function($q, $http) {

		this.submitPaymentOnBill = function(dataToSrv) {

			var timeStampInSeconds = 0;
			var incrementTimer = function() {
				timeStampInSeconds++;
			};
			var refreshIntervalId = setInterval(incrementTimer, 1000);


			var deferred = $q.defer();
			var url = 'api/reservations/' + dataToSrv.reservation_id + '/submit_payment';
			//to do
			var pollToTerminal = function(async_callback_url) {
				
			};
			return deferred.promise;
		};
	}
]);