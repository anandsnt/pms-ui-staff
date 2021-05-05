angular.module('sntRover').service('rvHouseEventsListSrv', [
    '$q',
    'rvBaseWebSrvV2',
    function ($q, rvBaseWebSrvV2) {

    /**
     * Fetch house events count for the given date
     * @param {Object} params - hold the request params
     * @return {Promise}
     */
    this.fetchHouseEventsByDate = (params) => {
        var url = '/api/house_events/list',
            deferred = $q.defer();                
        
        rvBaseWebSrvV2.postJSON(url, params).then((response) => {
            deferred.resolve(response.data);
        }, (error) => {
            deferred.reject(error);
        });

        return deferred.promise;

    };

}]);