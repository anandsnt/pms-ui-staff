(function() {
    var resetPasswordService = function($q, $http) {

        var responseData = {};

        var resetPassword = function(data) {
            var deferred = $q.defer(),
                url = '/guest/users/update_password.json';

            $http.post(url, data).then(function(response) {
                this.responseData = response.data;
                deferred.resolve(this.responseData);
            }, function() {
                deferred.reject();
            });
            return deferred.promise;
        };

        return {
            responseData: responseData,
            resetPassword: resetPassword
        };
    };

    var dependencies = [
        '$q', '$http', '$rootScope',
        resetPasswordService
    ];

    sntGuestWeb.factory('resetPasswordService', dependencies);
})();