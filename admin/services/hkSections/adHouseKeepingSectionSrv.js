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

    /*
    * Get available rooms which is not assigned to any hk section
    * @params {object} with query
    */
    this.getUnAssignedRooms = function(params) {
        var deferred = $q.defer();

        params = _.extend(params, {
            section_unassigned: true
        });
        var url = '/api/hk_sections/rooms';

        ADBaseWebSrvV2.getJSON(url, params).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    /*
    * Get hk section details
    * @params {object} with sectionId
    */
    this.getHKSectionDetails = function(params) {
        var deferred = $q.defer();
        var url = '/api/hk_sections/' + params.hKsectionId + ".json";

        ADBaseWebSrvV2.getJSON(url, params).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    /*
    * Bulk assignment of rooms to a particular section
    * @params {object} array of room ids
    */
    this.assignRooms = function(params) {
        var deferred = $q.defer();
        var url = '/api/hk_sections/' + params.hkSectionId + "/assign";

        ADBaseWebSrvV2.putJSON(url, params.payLoad).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    /*
    * Unassign a set of rooms from a particular section
    * @params {object} array of room ids
    */
    this.unAssignRooms = function(params) {
        var deferred = $q.defer();
        var url = '/api/hk_sections/' + params.hkSectionId + "/unassign";

        ADBaseWebSrvV2.putJSON(url, params.payLoad).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };


}]);
