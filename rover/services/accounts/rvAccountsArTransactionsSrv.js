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
    
}]);