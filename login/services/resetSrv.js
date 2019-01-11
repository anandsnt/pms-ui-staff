angular.module('login').service('resetSrv', ['$http', '$q', '$window',
    function($http, $q, $window) {
        /*
         * Reset Password
         * @param object of data
         * @param successcallbackasction
         * @param failureCallback action
         */
        this.resetPassword = function(data, successCallback, failureCallBack) {
            var deferred = $q.defer();

            $http.put("/api/password_resets/" + data.token + "/update.json", data).then(function(response) {
                if (response.data.status === "success") {
                    successCallback(response.data.data);
                } else {
                    // please note the type of error expecting is array
                    failureCallBack(response.data.errors);
                }
            }, function(response) {
                var status = response.status,
                    errors = response.data.errrors;

                // please note the type of error expecting is array
                // so form error as array if you modifying it
                if (status === 406) { // 406- Network error
                    deferred.reject(errors);
                }
                else if (status === 500) { // 500- Internal Server Error

                    failureCallBack(['Internal server error occured']);
                }
                else if (status === 401) { // 401- Unauthorized
                    // so lets redirect to login page
                    $window.location.href = '/logout';
                } else {
                    deferred.reject(errors);
                }

            });
            return deferred.promise;


        };
        /*
         * Activate user by changing Password
         * @param object of data
         * @param successcallbackasction
         * @param failureCallback action
         */
        this.activateUser = function(data, successCallback, failureCallBack) {

            var deferred = $q.defer();

            var url = "/api/password_resets/" + data.token + "/update.json";


            $http.put(url, data).then(function(res) {
                var response = res.data;

                if (response.status === "success") {
                    successCallback(response.data);
                } else {
                    // please note the type of error expecting is array
                    failureCallBack(response.errors);
                }
            }, function(res) {
                var status = res.status,
                    response = res.data;

                // please note the type of error expecting is array
                // so form error as array if you modifying it
                if (status === 406) { // 406- Network error
                    deferred.reject(response.errors);
                }
                else if (status === 500) { // 500- Internal Server Error

                    failureCallBack(['Internal server error occured']);
                }
                else if (status === 401) { // 401- Unauthorized
                    // so lets redirect to login page
                    $window.location.href = '/logout';
                } else {
                    deferred.reject(response.errors);
                }

            });
            return deferred.promise;
        };
        /*
         * To check the token status
         * @param object of data
         * @param string success callback
         * @param string failure callback
         */
        this.checkTokenStatus = function(data, successCallback, failureCallBack) {

            var deferred = $q.defer();

            var url = "";

            var url = "/api/password_resets/validate_token.json";

            $http.post(url, data).then(function(response) {
                if (response.data.status !== "success") {
                    failureCallBack(response.data.errors);
                }
            }, function(res) {
                var status = res.status,
                    response = res.data;

                // please note the type of error expecting is array
                // so form error as array if you modifying it
                if (status === 406) { // 406- Network error
                    deferred.reject(response.errors);
                }
                else if (status === 500) { // 500- Internal Server Error

                    failureCallBack(['Internal server error occured']);
                }
                else if (status === 401) { // 401- Unauthorized
                    // so lets redirect to login page
                    $window.location.href = '/logout';
                } else {
                    deferred.reject(response.errors);
                }

            });
            return deferred.promise;
        };
        /*
         * To set error message if user is already activated or token expired.
         */
        this.errorMessage = "";
        this.setErrorMessage = function(errorMessage) {
            this.errorMessage = errorMessage;
        };
        /*
         * To get error message if user is already activated or token expired.
         */
        this.getErrorMessage = function(errorMessage) {
            return this.errorMessage;
        };

    }]);
