angular.module('sntRover').service('RVNightlyDiarySrv',
    ['$q',
    'BaseWebSrvV2',
    'rvBaseWebSrvV2',
    function($q, BaseWebSrvV2,rvBaseWebSrvV2){
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



}]);