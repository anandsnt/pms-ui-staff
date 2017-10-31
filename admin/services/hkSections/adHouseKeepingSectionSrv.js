admin.service('ADHKSectionSrv', [
    '$http',
    '$q',
    'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2) {

    /**
    *   Service to return the list of house keeping sections
    */
    this.fetchHotelSectionList = function() {
        var deferred = $q.defer();
        var url = '/api/hk_sections';

        ADBaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    /**
    *   Service to add a new housekeeping section
    *   @param {Object} data holding the housekeeping section details.
    */
    this.addHKSection = function(data) {
        var deferred = $q.defer();
        var url = '/api/hk_sections';

        ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    /**
    *   Service to update housekeeping section
    *   @param {Object} data holding the house keeping section details
    */
    this.updateHKSection = function(data) {
        var deferred = $q.defer();
        var url = '/api/hk_sections/' + data.sectionId;

        delete data.sectionId;

        ADBaseWebSrvV2.putJSON(url, data).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };
    /**
    *   Service to get house keeping section details
    *   @param id unique identifier of the section
    */
    this.getHkSectionDetails = function(sectionId) {
        var deferred = $q.defer();
        var url = '/api/hk_sections/' + sectionId;

        ADBaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    /**
    *   Service to delete a housekeeping section
    *   @param id unique identifier of the house keeping section
    */
    this.deleteHKSection = function(params) {
        var deferred = $q.defer();
        var url = '/api/hk_sections/' + params.id;

        ADBaseWebSrvV2.deleteJSON(url).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };


}]);
