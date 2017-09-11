angular.module('sntRover').service('rvAccountsArTransactionsSrv', ['$q', 'rvBaseWebSrvV2', function($q, rvBaseWebSrvV2) {
	// To fetch the AR transaction for all tabs
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
	// To fetch the payments - to show in dialog
    this.fetchPaymentMethods = function(data) {
        var deferred = $q.defer(),
            url = 'api/accounts/'+ data.id +'/ar_transactions/payments_for_allocation';

        rvBaseWebSrvV2.getJSON(url).then(
            function(data) {
                deferred.resolve(data);
            },
            function(errorMessage) {
                deferred.reject(errorMessage);
            }
        );

        return deferred.promise;
    };
    // To pay/allocate the selected invoices amount
    this.paySelected = function(data) {
		var deferred = $q.defer(),
        url = '/api/accounts/' + data.account_id + '/ar_transactions/allocate_payment';

        rvBaseWebSrvV2.postJSON(url, data.data).then(
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
			url = '/api/accounts/' + param.account_id + '/ar_transactions/' + param.id + '/invoice_details';

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
			url = '/api/accounts/' + param.account_id + '/ar_transactions/' + param.id + '/payment_details';

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