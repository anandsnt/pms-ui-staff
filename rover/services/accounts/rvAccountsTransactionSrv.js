sntRover.service('rvAccountTransactionsSrv', ['$q', 'rvBaseWebSrvV2',
	function($q, rvBaseWebSrvV2) {

		var self = this;

		this.fetchTransactionDetails = function(data) {
			var deferred = $q.defer(),
				url = '/api/posting_accounts/transactions';

			rvBaseWebSrvV2.getJSON(url, data.summary)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		}


	}
]);