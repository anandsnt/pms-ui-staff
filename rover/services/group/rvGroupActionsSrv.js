angular.module('sntRover').service('rvGroupActionsSrv', ['$q', 'BaseWebSrvV2', function ($q, BaseWebSrvV2) {
    var self = this;

    this.fetchTasks = function (data) {
        var deferred = $q.defer();
        var url = "/api/action_tasks?associated_id=" + data.id + '&associated_type=Group';

        BaseWebSrvV2.getJSON(url).then(function (data) {
            deferred.resolve(data);
        }, function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    this.postNewAction = function (params) {
        var deferred = $q.defer();
        var url = "/api/action_tasks";

        BaseWebSrvV2.postJSON(url, params).then(function (data) {
            deferred.resolve(data);
        }, function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    this.updateNewAction = function (params) {
        var deferred = $q.defer();
        var url = "/api/action_tasks/" + params.action_task.id;

        BaseWebSrvV2.putJSON(url, params).then(function (data) {
            deferred.resolve(data);
        }, function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    this.completeAction = function (params) {
        var deferred = $q.defer();
        var url = "/api/action_tasks/" + params.action_task.id;

        BaseWebSrvV2.putJSON(url, params).then(function (data) {
            deferred.resolve(data);
        }, function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    this.fetchDepartments = function () {
        var deferred = $q.defer();
        var url = 'admin/departments.json';

        if (self.cache.responses['departments'] === null || Date.now() > self.cache.responses['departments']['expiryDate']) {
            BaseWebSrvV2.getJSON(url).then(function (data) {
                self.cache.responses['departments'] = {
                    data: data,
                    expiryDate: Date.now() + (self.cache['config'].lifeSpan * 1000)
                };
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
        } else {
            deferred.resolve(self.cache.responses['departments']['data']);
        }
        return deferred.promise;
    };

    this.cache = {
        config: {
            lifeSpan: 900 //in seconds
        },
        responses: {
            departments: null
        }
    };

}]);
