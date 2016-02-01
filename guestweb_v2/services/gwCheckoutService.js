sntGuestWeb.service('gwCheckoutSrv',['$q', 'GWBaseWebSrv', function($q, GWBaseWebSrv){

	/**
	 * to verify checkout user
	 * @return {undefined}
	 */
	this.verifyCheckoutUser = function(params) {
		var deferred = $q.defer();
		var url = '/guest_web/authenticate_checkout_guest';

		GWBaseWebSrv.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

}]);