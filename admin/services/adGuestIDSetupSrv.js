admin.service('ADGuestIDSetupSrv', ['$q', 'ADBaseWebSrv', function($q, ADBaseWebSrv) {

   /*
	* service class for Guest id setup
	*/

   /*
    * getter method to get Guest id setup details
    * @return {object} Guest id setup details
    */
	this.fetchGuestIDSetupDetails = function() {
		var deferred = $q.defer();
		var url = '/admin/.json';//TODO REPLACE

		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(errorMessage) {
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

	/*
	* method to save the guest id setup details
	* @param {object} with guest id setup details
	*/
	this.saveGuestIDSetup = function(data) {
		var deferred = $q.defer();
		var url = '/admin/';//TODO REPLACE

		ADBaseWebSrv.postJSON(url, data).then(function(data) {
			deferred.resolve(data);
		}, function(errorMessage) {
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

}]);