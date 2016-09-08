angular.module('sntRover').service('rvAccountTransactionsSrv', ['$q', 'rvBaseWebSrvV2','$rootScope',
	function($q, rvBaseWebSrvV2,$rootScope) {

		var self = this;

		this.fetchTransactionDetails = function(params) {
			var deferred = $q.defer(),
			url = '/api/posting_accounts/' + params.account_id + '/bill_card';

			rvBaseWebSrvV2.getJSON(url)
				.then(function(data) {
					angular.forEach(data.bills,function(bill, index2) {
		            	bill.page_no = 1;
		            	bill.start = 1;
		            	bill.end = 1;
		            	bill.nextAction = false;
		        		bill.prevAction = false;
		        		bill.transactions = [];
		        		bill.activeDate = null;
		            });
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		};

		this.fetchBillTransactionDetails = function(params) {
			var deferred = $q.defer(),
			url = '/api/bills/'+params.bill_id+'/transactions?date='+params.date+'&page='+params.page+'&per_page='+params.per_page;

			rvBaseWebSrvV2.getJSON(url)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		};

		this.createAnotherBill = function(params) {
			var deferred = $q.defer(),
				url = 'api/bills/create_bill';

			rvBaseWebSrvV2.postJSON(url, params)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		};

		this.moveToAnotherBill = function(params) {
			var deferred = $q.defer(),
				url = 'api/bills/transfer_transaction';

			rvBaseWebSrvV2.postJSON(url, params)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		};

	   /*
		 * Service function to edit transaction
		 * @method PUT
		 * @param {object} data
		 * @return {object} defer promise
		 */

		this.transactionEdit = function(data){

			var deferred = $q.defer();
			var trasactionId = data.id;
			var updatedDate  = data.updatedDate;
			var url = 'api/financial_transactions/'+trasactionId+'/save_custom_description';
			rvBaseWebSrvV2.putJSON(url, updatedDate).then(function(data) {
			   	 deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});

			return deferred.promise;
		};


	  /*
		 * Service function to delete transaction
		 * @method PUT
		 * @param {object} data
		 * @return {object} defer promise
		 */

		this.transactionDelete = function(deleteData){

			var deferred = $q.defer();
			var trasactionId = deleteData.id;
			var url = 'api/financial_transactions/'+trasactionId;
			rvBaseWebSrvV2.putJSON(url, deleteData.data).then(function(data) {
			   	 deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});

			return deferred.promise;
		};
	  /*
		* Service function to split transaction
		* @method PUT
		* @param {object} data
		* @return {object} defer promise
		*/

		this.transactionSplit = function(splitData){
			var deferred = $q.defer();
			var trasactionId = splitData.id;
			var url = 'api/financial_transactions/'+trasactionId;
			rvBaseWebSrvV2.putJSON(url, splitData.data).then(function(data) {
			   	 deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});
			return deferred.promise;
		};

	  /*
		* Service function to add new card
		* @method POST
		* @param {object} data
		* @return {object} defer promise
		*/

		this.savePaymentDetails = function(data){
			var deferred = $q.defer();
			var url = '/api/bills/'+data.bill_id+'/add_payment_method';
			rvBaseWebSrvV2.postJSON(url, data.data_to_pass).then(function(data) {
				    deferred.resolve(data);
				},function(data){
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
			// rvBaseWebSrvV2.postJSON(url, data.data_to_pass).then(function(data) {
			// 	    deferred.resolve(data);
			// 	},function(data){
			// 	    deferred.reject(data);
			// 	});
			// return deferred.promise;
			// 
			var timeStampInSeconds = 0;
			var incrementTimer = function() {
				timeStampInSeconds++;
			};
			var refreshIntervalId = setInterval(incrementTimer, 1000);


			var deferred = $q.defer();
			var url = '/api/bills/'+postData.bill_id+'/submit_payment';

			var pollToTerminal = function(async_callback_url) {
				//we will continously communicate with the terminal till 
				//the timeout set for the hotel
				if (timeStampInSeconds >= $rootScope.emvTimeout) {
					var errors = ["Request timed out. Unable to process the transaction"];
					deferred.reject(errors);
				} else {
					rvBaseWebSrvV2.getJSONWithSpecialStatusHandling(async_callback_url).then(function(data) {
						//if the request is still not proccesed
						if ((!!data.status && data.status === 'processing_not_completed') || data === "null") {
							//is this same URL ?
							setTimeout(function() {
								console.info("POLLING::-> for emv terminal response");
								pollToTerminal(async_callback_url);
							}, 5000)
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
				};
			};

			rvBaseWebSrvV2.postJSONWithSpecialStatusHandling(url,postData.data_to_pass).then(function(data) {
				//if connect to emv terminal is neeeded
				// need to poll oftently to avoid
				// timeout issues
				if (postData.data_to_pass.is_emv_request) {
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



	  /*
		* Service function to post charge
		* @method POST
		* @param {object} data
		* @return {object} defer promise
		*/

		this.postCharges = function(params) {
				var deferred = $q.defer();
				var url = '/staff/items/post_items_to_bill';

				rvBaseWebSrvV2.postJSON(url, params)
					.then(function(data) {
						deferred.resolve(data);
					}, function(data) {
						deferred.reject(data);
					});

				return deferred.promise;
		};

	  /*
		* Service function to check if AR account is attached or not
		* @method POST
		* @param {object} data
		* @return {object} defer promise
		*/


		this.checkForArAccount = function(params) {
			var deferred = $q.defer();
			var url = '/api/posting_accounts/' + params.account_id + '/is_ar_account_attached';

			rvBaseWebSrvV2.getJSON(url)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		};

		/*
		* Service to get the invoice for group/house accounts
		* @method POST
		* @param {object} params
		* @return {object} defer promise
		*/
		this.fetchAccountBillsForPrint = function(params) {
			var deferred = $q.defer();
			var url = '/api/posting_accounts/print_bill_card';

			rvBaseWebSrvV2.postJSON(url, params)
				.then(function(data) {
					deferred.resolve(data);
				}, function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		};


}]);