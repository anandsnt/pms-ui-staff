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


	}
]);