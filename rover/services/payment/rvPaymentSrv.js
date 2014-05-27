sntRover.service('RVPaymentSrv',['$http', '$q', 'RVBaseWebSrv', function($http, $q, RVBaseWebSrv){
   
	this.renderPaymentScreen = function(){
		var deferred = $q.defer();
		var url = '/staff/payments/addNewPayment.json';
		RVBaseWebSrv.getJSON(url).then(function(data) {
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
}]);