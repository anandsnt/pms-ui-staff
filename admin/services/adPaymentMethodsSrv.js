admin.service('ADPaymentMethodsSrv', ['$q', 'ADBaseWebSrv',
function($q, ADBaseWebSrv) {
	/*
	* To fetch hotel PaymentMethods
	*/
	this.fetch = function() {
		var deferred = $q.defer();
		var url = '/admin/hotel_payment_types.json';

		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(errorMessage) {
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};
	/*
	* To handle switch toggle for credit card
	*/
	this.toggleSwitchCC = function(data) {
		var deferred = $q.defer();
		var url = '/admin/hotel_payment_types/activate_credit_card';

		ADBaseWebSrv.postJSON(url, data).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
	/*
	* To handle switch toggle for payment types
	*/
	this.toggleSwitchPayment = function(data) {
		var deferred = $q.defer();
		var url = '/admin/hotel_payment_types';

		ADBaseWebSrv.postJSON(url, data).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
}]); 