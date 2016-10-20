admin.service('adComtrolChargeCodeMappingSrv', ['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2) {

    var service = this,
        baseUrl = "/api/hotel_settings/comtrol_mappings/revenue_centers";

    /**
     *
     * @returns {deferred.promise|{then, catch, finally}}
     */
    service.fetch = function() {
        return ADBaseWebSrvV2.getJSON(baseUrl);
    };

    /**
     *
     * @param newRevCenter
     * @returns {deferred.promise|{then, catch, finally}}
     */
    service.create = function(newRevCenter) {
        return ADBaseWebSrvV2.postJSON(baseUrl, newRevCenter);
    };

    /**
     *
     * @param id
     * @returns {deferred.promise|{then, catch, finally}}
     */
    service.delete = function(id) {
        return ADBaseWebSrvV2.deleteJSON(baseUrl + "/" + id);
    };

    /**
     *
     * @param revCenter
     * @returns {deferred.promise|{then, catch, finally}}
     */
    service.update = function(revCenter) {
        return ADBaseWebSrvV2.putJSON(baseUrl + "/" + revCenter.id, {
            name: revCenter.name,
            code: revCenter.code
        });
    };

}]);