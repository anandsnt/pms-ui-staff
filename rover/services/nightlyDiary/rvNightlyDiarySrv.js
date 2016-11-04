angular.module('sntRover').service('RVNightlyDiarySrv',
    ['$q',
    'BaseWebSrvV2',
    function($q, BaseWebSrvV2){
    /*
     * To fetch the rooms list
     * @param {data} object
     * return object
     */
    this.fetchRoomsList = function (data) {
        var deferred = $q.defer();
        var url = '/api/nightly_diary/room_list';
        BaseWebSrvV2.getJSON(url, data).then(function(response) {
            deferred.resolve(response);
        },function(error){
            deferred.reject(error);
        });
        return deferred.promise;
    };
    /*
     * To fetch the dates list
     * @param {data} object
     * return object
     */
    this.fetchDatesList = function (data) {
        var deferred = $q.defer();
        var url = '/api/nightly_diary/date_list';
        BaseWebSrvV2.getJSON(url, data).then(function(response) {
            deferred.resolve(response);
        },function(error){
            deferred.reject(error);
        });
        return deferred.promise;
    };
    /*
     * To fetch the reservations list
     * @param {data} object
     * return object
     */

    this.fetchReservationsList = function(data){
        var deferred = $q.defer();
        var url = '/api/nightly_diary/reservation_list';
        BaseWebSrvV2.getJSON(url, data).then(function(response) {
            deferred.resolve(response);
        },function(error){
            deferred.reject(error);
        });
        return deferred.promise;
    }



}]);