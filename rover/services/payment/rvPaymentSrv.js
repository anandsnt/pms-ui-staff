angular.module('sntRover').service('RVPaymentSrv',['$http', '$q', 'RVBaseWebSrv','rvBaseWebSrvV2','$rootScope', function($http, $q, RVBaseWebSrv,RVBaseWebSrvV2,$rootScope){


	var that =this;

	var paymentsData = {};

	this.renderPaymentScreen = function(data){
		var deferred = $q.defer();
		var url = '/staff/payments/addNewPayment.json';

		// removing the caching part, as the direct bill option is
		// needed conditionaly only based on param -> direct_bill

		// if(!isEmpty(paymentsData) && !(data && data.direct_bill)){
		// 	deferred.resolve(paymentsData)
		// }else{
			RVBaseWebSrv.getJSON(url,data).then(function(data) {
			    paymentsData = data;
			    deferred.resolve(data);
			},function(data){
				deferred.reject(data);
			});
		// };

		return deferred.promise;
	};
    this.fetchAvailPayments = function(data){
		var deferred = $q.defer();
		var url = '/staff/payments/addNewPayment.json';
		RVBaseWebSrv.getJSON(url,data).then(function(data) {
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});
		return deferred.promise;
	};
	this.savePaymentDetails = function(data){
		var deferred = $q.defer();
		var url = 'staff/reservation/save_payment';
		RVBaseWebSrv.postJSON(url, data).then(function(data) {
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});
		return deferred.promise;
	};
	this.saveGuestPaymentDetails = function(data){
		var deferred = $q.defer();
		var url = 'staff/payments/save_new_payment';
		RVBaseWebSrv.postJSON(url, data).then(function(data) {
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});
		return deferred.promise;
	};
	this.setAsPrimary = function(data){
		var deferred = $q.defer();

		var url = '/staff/payments/setCreditAsPrimary';
		RVBaseWebSrv.postJSON(url, data).then(function(data) {
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});
		return deferred.promise;
	};
	this.deletePayment = function(data){
		var deferred = $q.defer();
		var url = '/staff/payments/deleteCreditCard';
		RVBaseWebSrv.postJSON(url, data).then(function(data) {
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});
		return deferred.promise;
	};
	this.getPaymentList = function(reservationId){
		var deferred = $q.defer();
		var url = '/staff/staycards/get_credit_cards.json?reservation_id='+reservationId;
		RVBaseWebSrv.getJSON(url).then(function(data) {
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});
		return deferred.promise;
	};
	this.mapPaymentToReservation = function(data){
		var deferred = $q.defer();

		var url = '/staff/reservation/link_payment';
		RVBaseWebSrv.postJSON(url, data).then(function(data) {
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});
		return deferred.promise;
	};

	this.submitPaymentOnBill = function(dataToSrv) {

		var deferred = $q.defer();
		var url = 'api/reservations/' + dataToSrv.reservation_id + '/submit_payment';

		var pollToTerminal = function(async_callback_url) {
			//we will continously communicate with the terminal till 
			//the timeout set for the hotel
			if(timeStampInSeconds >= $rootScope.emvTimeout){
				var errors = ["Request timed out. Unable to process the transaction"];
				deferred.reject(errors);
			}
			else{
				RVBaseWebSrvV2.getJSONWithSpecialStatusHandling(async_callback_url).then(function(data) {
					//if the request is still not proccesed
					if ((!!data.status && data.status === 'processing_not_completed') || data === "null") {
						//is this same URL ?
						setTimeout(function(){
							console.info("POLLING::-> for emv terminal response");
				            pollToTerminal(async_callback_url);
				        },5000)
					} else {
						deferred.resolve(data);
					}
				}, function(data) {
					if(typeof data === 'undefined'){
						pollToTerminal(async_callback_url);
					}
					else{
						deferred.reject(data);
					}
				});
			};
		};
		if (dataToSrv.postData.is_emv_request) {
			//for emv actions we need a timer
			var timeStampInSeconds = 0;
			var incrementTimer = function(){
				timeStampInSeconds++;
			};
			setInterval(incrementTimer, 1000);
		};

		RVBaseWebSrvV2.postJSONWithSpecialStatusHandling(url, dataToSrv.postData).then(function(data) {
			//if connect to emv terminal is neeeded
			// need to poll oftently to avoid
			// timeout issues
			if (dataToSrv.postData.is_emv_request) {
				if (!!data.status && data.status === 'processing_not_completed') {
					pollToTerminal(data.location_header);
				} else {
					deferred.resolve(data);
				}
			} else {
				deferred.resolve(data);
			}
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
	/*
	 * Make payment from deposit balance modal
	 */
	this.makePaymentOnDepositBalance = function(dataToApiToDoPayment){
		var deferred = $q.defer();
		var url = 'staff/reservation/post_payment';
		RVBaseWebSrv.postJSON(url, dataToApiToDoPayment).then(function(data) {
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});
		return deferred.promise;
	};
	this.chipAndPinGetToken = function(postData){
		var deferred = $q.defer();
		var url = '/api/cc/get_token.json';
		RVBaseWebSrvV2.postJSON(url, postData).then(function(data) {
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});
		return deferred.promise;
	};



}]);