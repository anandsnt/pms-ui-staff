sntGuestWeb.service('GwCheckoutSrv',['$q', 'GWBaseWebSrv','GWBaseWebSrv2', function($q, GWBaseWebSrv,GWBaseWebSrv2){

	/**
	 * to verify checkout user
	 * @return {undefined}
	 */
	this.verifyCheckoutUser = function(params) {
		var deferred = $q.defer();
		var url = '/guest_web/authenticate_checkout_guest';

		GWBaseWebSrv2.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
	 * to save payment
	 * @return {undefined}
	 */
	this.savePayment = function(params) {
		var deferred = $q.defer();
		var url = "/staff/reservation/save_payment";

		GWBaseWebSrv2.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};
	/**
	 * to verify checkout user
	 * @return {undefined}
	 */
	this.verifyRoom = function(params) {
		var deferred = $q.defer();
		var url = '/guest_web/verify_room.json';

		GWBaseWebSrv2.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
	 * to fetch bill details
	 * @return {undefined}
	 */
	this.fetchBillDetails = function(params) {
		var deferred = $q.defer();
		// var url = '/sample_json/zestweb_v2/bill_details.json';
		var url = '/guest_web/home/bill_details.json';
		GWBaseWebSrv.getJSON(url, params).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
	 * to fetch late checkout options
	 * @return {undefined}
	 */
	this.fetchLateCheckoutOptions = function(params) {
		var deferred = $q.defer();
		//var url = '/sample_json/zestweb_v2/late_checkout_options.json';
		var url = '/guest_web/get_late_checkout_charges.json';
		GWBaseWebSrv2.getJSON(url, params).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};
	/**
	 * to fetch late checkout options
	 * @return {undefined}
	 */
	this.updateReservationWithNewCheckoutOptions = function(params) {
		var deferred = $q.defer();
		//var url = '/sample_json/zestweb_v2/late_checkout_options.json';
		var url = '/guest_web/apply_late_checkout';
		GWBaseWebSrv2.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};



	/**
	 * to checkout user
	 * @return {undefined}
	 */
	this.completeCheckout = function(params) {
		var deferred = $q.defer();
		var url = '/guest_web/home/checkout_guest.json';

		GWBaseWebSrv2.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

	
}]);