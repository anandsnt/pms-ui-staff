angular.module('login').service('loginSrv',
    ['$http', '$q', '$window',
        function($http, $q, $window) {

            var service = this;

            /**
             * This method calls the login/validate if there is a JWT available to see if the user can be redirected to Rover / SNT Admin
             * @return {deferred.promise|{then, catch, finally}|*|promise.promise|promise|jQuery.promise|Promise<any>} promise resolves to
             * {is_snt_admin: {Boolean}, redirect_url: {String}}
             */
            service.checkSession = function() {
                var jwt = $window.localStorage.getItem('jwt'),
                    url = '/login/validate',
                    deferred = $q.defer();

                if (jwt) {
                    $http.get(url).
                        then(function(response) {
                            deferred.resolve(response.data);
                        }, function() {
                            $window.localStorage.removeItem('jwt');
                            deferred.resolve('');
                        });
                } else {
                    deferred.resolve('');
                }

                return deferred.promise;
            };

            service.login = function(data, successCallback, failureCallBack) {
                var deferred = $q.defer();

                $http.post("/login/submit", data).then(function(response) {
                    if (response.data.status === "success") {
                        var jwt = response.headers('Auth-Token');

                        $window.localStorage.removeItem('jwt');
                        if (jwt) {
                            $window.localStorage.setItem('jwt', jwt);
                        }
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
                        var jwt = response.headers('Auth-Token');

                        if (jwt) {
                            $window.localStorage.setItem('jwt', jwt);
                        }
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

            // Get marketing items from WP service
            service.getMarketingItems = function() {
                var url = 'https://www.stayntouch.com/wp-json/snt/v1/rover_banners',
                    deferred = $q.defer();

                // This is done to override the common header configured globally
                $http.get(url, {
                    headers: {
                        'X-Requested-With': undefined
                    }
                }).
                then(function (response) {
                    deferred.resolve(response.data);
                }, function () {
                    $window.localStorage.removeItem('jwt');
                    deferred.resolve([]);
                });
                
                return deferred.promise;
            };

        }
    ]);
