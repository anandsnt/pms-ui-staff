angular.module('sntRover').service('RVDepositBalanceSrv', ['$q', 'BaseWebSrvV2', 'rvBaseWebSrvV2', '$rootScope', function($q, BaseWebSrvV2, rvBaseWebSrvV2, $rootScope) {
	this.getDepositBalanceData = function (data) {
		var deferred = $q.defer();
		var url = 'staff/reservations/' + data.reservationId + '/deposit_and_balance.json';

		BaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.getRevenueDetails = function (data) {
		var deferred = $q.defer();
		var url = 'api/posting_accounts/' + data.posting_account_id + '/deposit_and_balance';

		BaseWebSrvV2.getJSON(url).then(function (data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	/*
		* Service function to submit payment
		* @method POST
		* @param {object} data
		* @return {object} defer promise
		*/

	this.submitPaymentOnBill = function(postData) {

		// var deferred = $q.defer();
		// var url = '/api/bills/'+data.bill_id+'/submit_payment';
		// BaseWebSrvV2.postJSON(url, data.postData).then(function(data) {
		// 	deferred.resolve(data);
		// },function(data){
		// 	deferred.reject(data);
		// });
		// return deferred.promise;


		var timeStampInSeconds = 0;
			var incrementTimer = function() {
				timeStampInSeconds++;
			};
			var refreshIntervalId = setInterval(incrementTimer, 1000);


			var deferred = $q.defer();
			var url = '/api/bills/' + postData.bill_id + '/submit_payment';

			var pollToTerminal = function(async_callback_url) {
				// we will continously communicate with the terminal till 
				// the timeout set for the hotel
				if (timeStampInSeconds >= $rootScope.emvTimeout) {
					var errors = ["Request timed out. Unable to process the transaction"];

					deferred.reject(errors);
				} else {
					rvBaseWebSrvV2.getJSONWithSpecialStatusHandling(async_callback_url).then(function(data) {
						// if the request is still not proccesed
						if ((!!data.status && data.status === 'processing_not_completed') || data === "null") {
							// is this same URL ?
							setTimeout(function() {
								console.info("POLLING::-> for emv terminal response");
								pollToTerminal(async_callback_url);
							}, 5000);
						} else {
							clearInterval(refreshIntervalId);
							deferred.resolve(data);
						}
					}, function(data) {
						if (typeof data === 'undefined') {
							pollToTerminal(async_callback_url);
						} else {
							clearInterval(refreshIntervalId);
							deferred.reject(data);
						}
					});
				}
			};

			rvBaseWebSrvV2.postJSONWithSpecialStatusHandling(url, postData.postData).then(function(data) {
				// if connect to emv terminal is neeeded
				// need to poll oftently to avoid
				// timeout issues
				if (postData.is_emv_request) {
					if (!!data.status && data.status === 'processing_not_completed') {
						pollToTerminal(data.location_header);
					} else {
						clearInterval(refreshIntervalId);
						deferred.resolve(data);
					}
				} else {
					clearInterval(refreshIntervalId);
					deferred.resolve(data);
				}
			}, function(data) {
				clearInterval(refreshIntervalId);
				deferred.reject(data);
			});
			return deferred.promise;
	};
	
}]);