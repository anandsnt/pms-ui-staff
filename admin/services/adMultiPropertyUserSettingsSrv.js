admin.service('ADMPUserSettingsSrv', ['$q', 'ADBaseWebSrvV2', function($q, ADBaseWebSrvV2) {

    /*
    * A get method to fetch Multi-property hotel details
    * CICO-41385
    * @return {object} hotel details
    */
    this.fetchMPHotelDetails = function() {
        var deferred = $q.defer();
        var hotelDetailsUrl = '/staff/multi_property/hotels';
        
        var successCallbackfetchMPHotelDetails = function(data) {
            deferred.resolve(data);
        };
        var failureCallbackfetchMPHotelDetails = function(data) {
            deferred.reject(data);
        };

        ADBaseWebSrvV2.getJSON(hotelDetailsUrl, {}).then(successCallbackfetchMPHotelDetails, failureCallbackfetchMPHotelDetails);

        return deferred.promise;
    };

    /*
    * A get method to fetch Multi-property department details
    * CICO-41385
    * @return {object} department details
    */
    this.fetchMPDeptDetails = function() {
        var deferred = $q.defer();
        var departmentDetailsUrl = '/staff/multi_property/departments';
        var successCallbackfetchMPDeptDetails = function(data) {
            deferred.resolve(data);
        };
        var failureCallbackfetchMPDeptDetails = function(data) {
            deferred.reject(data);
        };

        ADBaseWebSrvV2.getJSON(departmentDetailsUrl, {}).then(successCallbackfetchMPDeptDetails, failureCallbackfetchMPDeptDetails);
        return deferred.promise;
    };

    /*
    * A post method to fetch Multi-property
    * user details as per selected filters
    * CICO-41385
    * @params {object} parameters with respect to selected filters
    * @return {object} hotel details
    */
    this.fetchMPUserDetails = function(params) {
        var deferred = $q.defer();
        var url = '/staff/multi_property/users';
        var successCallbackfetchMPUserDetails = function(data) {
            deferred.resolve(data);
        };
        var failureCallbackfetchMPUserDetails = function(data) {
            deferred.reject(data);
        };

        ADBaseWebSrvV2.postJSON(url, params).then(successCallbackfetchMPUserDetails, failureCallbackfetchMPUserDetails);
        return deferred.promise;
    };

}]);