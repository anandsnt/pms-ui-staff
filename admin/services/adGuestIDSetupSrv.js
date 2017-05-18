admin.service('ADGuestIDSetupSrv', ['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2) {

   /*
	* service class for Guest id setup
	*/

   /*
    * getter method to get Guest id setup details
    * @return {object} Guest id setup details
    */
    this.fetchGuestIDSetupDetails = function() {
        var deferred = $q.defer();
        var url = '/api/hotel_settings.json';

        ADBaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });

        return deferred.promise;
    };

	/*
	* method to save the guest id setup details
	* @param {object} with guest id setup details
	*/
    this.saveGuestIDSetup = function(params) {
        var deferred = $q.defer();
        var url = '/api/hotel_settings/change_settings/';

        ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

}]);