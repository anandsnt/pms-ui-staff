angular.module('login').service('loginSrv',
    ['$http', '$q', '$window',
        function($http, $q, $window) {

            var service = this;

            service.reset = function() {
                $window.localStorage.removeItem('jwt');
            };

            service.login = function(data, successCallback, failureCallBack) {
                var deferred = $q.defer();

                $http.post("/login/submit", data).then(function(response) {
                    if (response.data.status === "success") {
                        $window.localStorage.setItem('jwt', response.headers('Auth-Token'));
                        successCallback(response.data.data);
                    } else {
                        // please note the type of error expecting is array
                        failureCallBack(response.data.errors);
                    }
                }, function(response) {
                    // please note the type of error expecting is array
                    // so form error as array if you modifying it
                    if (response.status === 406) { // 406- Network error
                        deferred.reject(response.errors);
                    }
                    else if (response.status === 500) { // 500- Internal Server Error
                        deferred.reject(['Internal server error occured']);
                    }
                    else if (response.status === 401) { // 401- Unauthorized
                        // so lets redirect to login page
                        $window.location.href = '/logout';
                    } else {
                        deferred.reject(response.data.errors);
                    }

                });

                return deferred.promise;
            };

            service.forgotPassword = function(data, successCallback, failureCallBack) {
                var deferred = $q.defer();

                // Sample params {params:{"email":email}}
                $http.post("/login/send_temporary_password", data).then(function(response) {
                    if (response.data.status === "success") {
                        $window.localStorage.setItem('jwt', response.headers('Auth-Token'));
                        successCallback(response.data.data);
                    } else {
                        // please note the type of error expecting is array
                        failureCallBack(response.data.errors);
                    }
                }, function(response) {
                    // please note the type of error expecting is array
                    // so form error as array if you modifying it
                    if (response.status === 406) { // 406- Network error
                        deferred.reject(response.errors);
                    }
                    else if (response.status === 500) { // 500- Internal Server Error

                        deferred.reject(['Internal server error occured']);
                    }
                    else if (response.status === 401) { // 401- Unauthorized
                        // so lets redirect to login page
                        $window.location.href = '/logout';
                    } else {
                        deferred.reject(response.data.errors);
                    }

                });
                return deferred.promise;
            };

        }
    ]);
