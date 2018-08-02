angular.module('sntRover').service('RVKeyPopupSrv', ['$q', 'RVBaseWebSrv', 'rvBaseWebSrvV2', function($q, RVBaseWebSrv, rvBaseWebSrvV2) {
	/*
	 * Service function to get data for Email popup
	 */
	this.fetchKeyEmailData = function(param) {

		var deferred = $q.defer();
		var url =  "staff/reservations/" + param.reservationId + "/get_key_setup_popup";

		RVBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;

	};
	/*
	 * Service function to get data for QR Code popup
	 */
	this.fetchKeyQRCodeData = function(param) {

		var deferred = $q.defer();
		var url =  "staff/reservations/" + param.reservationId + "/get_key_on_tablet.json";

		RVBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;

	};


	/**
	* service function to get key from server by passing id from the card
	*/
	this.fetchKeyFromServer = function(params) {
		var deferred = $q.defer();
		var url =  "/staff/reservation/print_key";


		RVBaseWebSrv.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
	* service function to get key from server by passing id from the card
	*/
	this.sendEmailWithPincode = function(params) {
		var deferred = $q.defer();
		var url =  "/staff/reservation/email_pincode";


		RVBaseWebSrv.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

    /**
     * service function to generate new key from server by passing reservation confirmation number
     */
    this.generatePinCode = function(params) {
        var deferred = $q.defer();
        var url =  "/api/reservation/" + params.interface.toLowerCase() + "/" + params.confirmation_number + "/generate";


        rvBaseWebSrvV2.postJSON(url, params).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };


	/**
	* service function to add smartband to server
	*/
	this.addNewSmartBand = function(params) {
		var deferred = $q.defer();
		var reservationId = params.reservationId;
		// we are removing the unwanted keys and that will be posted to API
 		var unWantedKeysToRemove = ['reservationId', 'index'];
		var data = dclone(params, unWantedKeysToRemove);

		var url = '/api/reservations/' + reservationId + '/smartbands';


		rvBaseWebSrvV2.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.fetchActiveEncoders = function() {

		var deferred = $q.defer();
		var url =  "/api/key_encoders/active";

		rvBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;

	};

}]);
