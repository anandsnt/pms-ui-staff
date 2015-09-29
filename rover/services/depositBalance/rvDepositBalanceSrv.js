sntRover.service('RVDepositBalanceSrv',['$q', 'BaseWebSrvV2', function($q, BaseWebSrvV2){
	this.getDepositBalanceData = function (data) {
		var deferred = $q.defer();
		var url = 'staff/reservations/'+data.reservationId+'/deposit_and_balance.json';
		BaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.getRevenueDetails = function (data) {
		var deferred = $q.defer();
		var url = 'api/posting_accounts/'+data.posting_account_id+'/revenue_details';
		BaseWebSrvV2.getJSON(url).then(function (data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};
}]);