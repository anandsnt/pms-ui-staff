angular.module('sntRover').service('RVSocilaLobbySrv',
    ['$http', '$q', 'BaseWebSrvV2','RVBaseWebSrv',
    function($http, $q, BaseWebSrvV2, RVBaseWebSrv){

        this.fetchPosts = function(params){
        var deferred = $q.defer();
        var url = 'api/social_lobby.json';
            BaseWebSrvV2.getJSON(url, params).then(function(data) {

                 deferred.resolve(data);
            },function(data){
                deferred.reject(data);
            });

        return deferred.promise;
    };

    this.addPost = function(data){
        var deferred = $q.defer();
        var url = 'api/social_lobby.json';
            BaseWebSrvV2.postJSON(url, data).then(function(data) {

                 deferred.resolve(data);
            },function(data){
                deferred.reject(data);
            });

        return deferred.promise;
    };

    this.deletePost = function(data){
        var deferred = $q.defer();
        var url = 'api/social_lobby/' + data.post_id;
            BaseWebSrvV2.deleteJSON(url).then(function(data) {

                 deferred.resolve(data);
            },function(data){
                deferred.reject(data);
            });

        return deferred.promise;
    };
    

}]);