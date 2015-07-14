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
	/*
    * To save/update payment type
    * @param {array} data of the payment type
    * @return {object} status of new/updated payment type
    */
	this.savePaymentMethod = function(data){
		var deferred = $q.defer();
		var url = '/admin/hotel_payment_types.json';

		ADBaseWebSrv.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/*
    * To save/update credit card type
    * @param {array} data of the credit card type
    * @return {object} status of new/updated credit card type
    */
	this.saveCreditCardMethod = function(data){
		var deferred = $q.defer();
		var url = '/admin/hotel_payment_types/update_credit_card';

		ADBaseWebSrv.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/*
    * To delete the seleceted payment type
    * @param {int} id of the selected payment type
    * @return {object} status of delete
    */
	this.deletePaymentMethod = function(id){
		var deferred = $q.defer();
		var url = '/admin/hotel_payment_types/'+id;

		ADBaseWebSrv.deleteJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
}]); 