angular.module('sntRover').service('RVDepositBalanceSrv',['$q', 'BaseWebSrvV2', function($q, BaseWebSrvV2){
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
		var url = 'api/posting_accounts/'+data.posting_account_id+'/deposit_and_balance';
		BaseWebSrvV2.getJSON(url).then(function (data) {
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
		BaseWebSrvV2.postJSON(url, data.postData).then(function(data) {
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});
		return deferred.promise;
	};
	
}]);