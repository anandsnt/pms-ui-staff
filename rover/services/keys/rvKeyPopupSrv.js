sntRover.service('RVKeyPopupSrv',['$q', 'RVBaseWebSrv', function($q, RVBaseWebSrv){
	/*
	 * Service function to get data for Email popup
	 */	
	this.fetchKeyEmailData = function(param){
		
		var deferred = $q.defer();
		var url =  "staff/reservations/" + param.reservationId + "/get_key_setup_popup";			
		
		RVBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;		
		
	};
	/*
	 * Service function to get data for QR Code popup
	 */
	this.fetchKeyQRCodeData = function(param){
		
		var deferred = $q.defer();
		var url =  "staff/reservations/" + param.reservationId + "/get_key_on_tablet.json";	
		
		RVBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;		
		
	};


	/**
	* service function to get key from server by passing id from the card
	*/
	this.fetchKeyFromServer = function(params){
		var deferred = $q.defer();
		var url =  "/staff/reservation/print_key";	
		
		RVBaseWebSrv.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;		
	}

}]);