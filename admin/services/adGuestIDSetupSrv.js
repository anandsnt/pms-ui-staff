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
    this.fetchGuestIDTypeDetails = function() {
        var deferred = $q.defer();
        var url = '/api/guest_identity/hotel_guest_id_types';

        ADBaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });

        return deferred.promise;
    };

    this.saveGuestIDTypes = function(params) {
        var deferred = $q.defer();
        var url = '/api/guest_identity/update_hotel_guest_ids/';

        ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
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