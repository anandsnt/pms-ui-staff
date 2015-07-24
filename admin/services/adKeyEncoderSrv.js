admin.service('ADKeyEncoderSrv', ['$http', '$q', 'ADBaseWebSrvV2', 'ADBaseWebSrv',
    function ($http, $q, ADBaseWebSrvV2, ADBaseWebSrv) {

        this.fetchEncoders = function (data) {
            var deferred = $q.defer();

            var url = "/api/key_encoders";
            ADBaseWebSrvV2.getJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        this.saveEncoder = function (data) {
            var deferred = $q.defer();
            var url = "/api/key_encoders";
            ADBaseWebSrvV2.postJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.updateEncoder = function (data) {
            var deferred = $q.defer();
            var url = "/api/key_encoders/"+ data.id;
            ADBaseWebSrvV2.putJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.showEncoderDetails = function (data) {
            var deferred = $q.defer();

            var url = "/api/key_encoders/"+ data.id;
            ADBaseWebSrvV2.getJSON(url).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.updateEncoderStatus = function (data) {
            var deferred = $q.defer();
            var url = "/api/key_encoders/" + data.id +"/activate";
            delete data['id'];
            ADBaseWebSrvV2.putJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

    }
]);
