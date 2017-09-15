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
        rvBaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data.data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };
    // To fetch statement data
    this.fetchArStatementData = function(params) {
        var deferred = $q.defer();
        var url = '/api/ar_transactions/get_email?id=' + params.id;

        rvBaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data.data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    // Fetch AR satement print data
    this.fetchArStatementPrintData = function(data) {
        var deferred = $q.defer(),
        url = '/api/ar_transactions/print';

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

    // Send email AR statement
    this.emailArStatement = function(data) {
        var deferred = $q.defer(),
        url = '/api/ar_transactions/email';

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
  //get Unallocate data
    this.getUnAllocateDetails = function( param ) {
        var deferred = $q.defer(),
            url = '/api/accounts/' + param.account_id + '/ar_transactions/' + param.id + '/payment_details';

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

    // To unallocate the selected invoices amount
    this.unAllocateSelectedPayment = function(data) {
        var deferred = $q.defer(),
            url = '/api/accounts/' + data.account_id + '/ar_transactions/unallocate_payment';

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

    // Show unallocate popup data
    this.unAllocateData = function(data) {
        var deferred = $q.defer(),
            url = '/api/accounts/' + data.account_id + '/ar_transactions/unallocate_info';

        rvBaseWebSrvV2.getJSON(url, data.data).then(
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