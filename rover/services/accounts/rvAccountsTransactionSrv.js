sntRover.service('rvAccountTransactionsSrv', ['$q', 'rvBaseWebSrvV2',
	function($q, rvBaseWebSrvV2) {

		var self = this;

		this.fetchTransactionDetails = function(params) {
			var deferred = $q.defer(),
				url = '/api/posting_accounts/transactions';

			rvBaseWebSrvV2.getJSON(url, params)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		}

		this.createAnotherBill = function(params) {
			var deferred = $q.defer(),
				url = '/api/posting_accounts/transactions';

			rvBaseWebSrvV2.postJSON(url, params)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		}

		this.moveToAnotherBill = function(params) {
			var deferred = $q.defer(),
				url = '/api/posting_accounts/transactions';

			rvBaseWebSrvV2.postJSON(url, params)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		}

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


	}
]);