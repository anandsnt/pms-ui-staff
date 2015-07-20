sntRover.service('RVPaymentSrv',['$http', '$q', 'RVBaseWebSrv','rvBaseWebSrvV2', function($http, $q, RVBaseWebSrv,RVBaseWebSrvV2){


	var that =this;
	this.renderPaymentScreen = function(data){
		var deferred = $q.defer();
		var url = '/staff/payments/addNewPayment.json';
		RVBaseWebSrv.getJSON(url,data).then(function(data) {
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});
		return deferred.promise;
	};
	this.savePaymentDetails = function(data){
		var deferred = $q.defer();
		var url = 'staff/reservation/save_payment';
		RVBaseWebSrv.postJSON(url, data).then(function(data) {
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});
		return deferred.promise;
	};
	this.saveGuestPaymentDetails = function(data){
		var deferred = $q.defer();
		var url = 'staff/payments/save_new_payment';
		RVBaseWebSrv.postJSON(url, data).then(function(data) {
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});
		return deferred.promise;
	};
	this.setAsPrimary = function(data){
		var deferred = $q.defer();

		var url = '/staff/payments/setCreditAsPrimary';
		RVBaseWebSrv.postJSON(url, data).then(function(data) {
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});
		return deferred.promise;
	};
	this.deletePayment = function(data){
		var deferred = $q.defer();
		var url = '/staff/payments/deleteCreditCard';
		RVBaseWebSrv.postJSON(url, data).then(function(data) {
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});
		return deferred.promise;
	};
	this.getPaymentList = function(reservationId){
		var deferred = $q.defer();
		var url = '/staff/staycards/get_credit_cards.json?reservation_id='+reservationId;
		RVBaseWebSrv.getJSON(url).then(function(data) {
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});
		return deferred.promise;
	};
	this.mapPaymentToReservation = function(data){
		var deferred = $q.defer();

		var url = '/staff/reservation/link_payment';
		RVBaseWebSrv.postJSON(url, data).then(function(data) {
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});
		return deferred.promise;
	};
	this.submitPaymentOnBill = function(dataToSrv){
		var deferred = $q.defer();
		var url = 'api/reservations/'+dataToSrv.reservation_id+'/submit_payment';
		RVBaseWebSrvV2.postJSON(url, dataToSrv.postData).then(function(data) {
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});
		return deferred.promise;
	};
	/*
	 * Make payment from deposit balance modal
	 */
	this.makePaymentOnDepositBalance = function(dataToApiToDoPayment){
		var deferred = $q.defer();
		var url = 'staff/reservation/post_payment';
		RVBaseWebSrv.postJSON(url, dataToApiToDoPayment).then(function(data) {
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});
		return deferred.promise;
	};
	this.chipAndPinGetToken = function(postData){
		var deferred = $q.defer();
		var url = '/api/cc/get_token.json';
		RVBaseWebSrvV2.postJSON(url, postData).then(function(data) {
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});
		return deferred.promise;
	};



}]);