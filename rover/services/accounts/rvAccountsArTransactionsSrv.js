angular.module('sntRover').service('rvAccountsArTransactionsSrv', ['$q', 'rvBaseWebSrvV2', function($q, rvBaseWebSrvV2) {
	this.fetchTransactionDetails = function(data) {
			var deferred = $q.defer(),
			url = '/api/accounts/' + data.account_id + '/ar_transactions';

			rvBaseWebSrvV2.getJSON(url, data.getParams).then(
				function(data) {
					deferred.resolve(data);
				},
				function(errorMessage) {
					deferred.reject(errorMessage);
				}
			);

			return deferred.promise;
		};

	// Save AR Balance details.
	this.saveArBalance = function(data) {
		var deferred = $q.defer(),
		url = '/api/accounts/'+ data.account_id +'/ar_transactions/create_manual_balances';

		rvBaseWebSrvV2.postJSON(url, data).then(
			function(data) {
				deferred.resolve(data);
			},
			function(errorMessage) {
				deferred.reject(errorMessage);
			}
		);

		return deferred.promise;
	};

	// Expand Manual Balance & Paid Listing
	this.expandPaidAndUnpaidList = function( param ) {
		var deferred = $q.defer(),
			url = '/api/ar_transactions/' + param.id + '/invoice_details';

		rvBaseWebSrvV2.getJSON(url, param).then(
			function(data) {
				deferred.resolve(data);
			},
			function(errorMessage) {
				deferred.reject(errorMessage);
			}
		);

		return deferred.promise;
	};

	// Expand Allocated & Unallocated Listing
	this.expandAllocateAndUnallocatedList = function( param ) {
		var deferred = $q.defer(),
			url = '/api/ar_transactions/' + param.id + '/payment_details';

		rvBaseWebSrvV2.getJSON(url, param).then(
			function(data) {
				deferred.resolve(data);
			},
			function(errorMessage) {
				deferred.reject(errorMessage);
			}
		);

		return deferred.promise;
	};

}]);