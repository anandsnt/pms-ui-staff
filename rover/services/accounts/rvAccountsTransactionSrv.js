angular.module('sntRover').service('rvAccountTransactionsSrv', ['$q', 'rvBaseWebSrvV2',
	function($q, rvBaseWebSrvV2) {

		var self = this;

		this.fetchTransactionDetails = function(params) {
			var deferred = $q.defer(),
			url = '/api/posting_accounts/' + params.account_id + '/bill_card';


			rvBaseWebSrvV2.getJSON(url)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		};

		this.fetchBillTransactionDetails = function(params) {
			var deferred = $q.defer(),
			url = '/api/bills/'+params.bill_id+'/transactions';

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
			var url = 'api/financial_transactions/'+trasactionId;
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

		this.submitPaymentOnBill = function(data){
			var deferred = $q.defer();
			var url = '/api/bills/'+data.bill_id+'/submit_payment';
			rvBaseWebSrvV2.postJSON(url, data.data_to_pass).then(function(data) {
				    deferred.resolve(data);
				},function(data){
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