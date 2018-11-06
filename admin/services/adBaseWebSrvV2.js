// To fix the issue with csrf token in ajax requests
admin.config(function($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    var m = document.getElementsByTagName('meta');

    for (var i in m) {
        if (m[i].name === 'csrf-token') {
            $httpProvider.defaults.headers.common['X-CSRF-Token'] = m[i].content;
            break;
        }
    }
});


admin.service('ADBaseWebSrvV2', ['$http', '$q', '$window', '$rootScope', function($http, $q, $window, $rootScope) {

    /**
     *   A http requester method for calling webservice
     *   @param {function} function of the method to call like $http.get, $http.put..
     *   @param {string} webservice url
     *   @param {Object} data for webservice
     *   @param {Boolean} flag for switching to status handling
     *   @return {promise}
     */
    this.callWebService = function(httpMethod, url, params, handleStatus) {
        var deferred = $q.defer(),
            httpDict = {};

        if (angular.isUndefined(params)) {
            params = "";
        }

        httpDict.url = url;
        httpDict.method = httpMethod;

        if (httpMethod === 'GET' || httpMethod === 'DELETE') {
            httpDict.params = params;
        }
        else if (httpMethod === 'POST' || httpMethod === 'PUT') {
            httpDict.data = params;
        }

        $http(httpDict).then(function(response) {
            if (handleStatus) {
                var data = response.data,
                    status = response.status,
                    headers = response.headers;

                // 202 ---> The request has been accepted for processing, but the processing has not been completed.
                // 102 ---> This code indicates that the server has received and is processing the request, but no response is available yet
                if (status === 202 || status === 102 || status === 250) {
                    deferred.resolve({
                        'status': 'processing_not_completed',
                        'location_header': headers('Location')
                    });
                } else {
                    deferred.resolve(data);
                }
            } else {
                deferred.resolve(response.data);
            }

        }, function(response) {
            var errors = response.data,
                status = response.status;

            // please note the type of error expecting is array
            // so form error as array if you modifying it
            if (status === 406) { // 406- Network error
                deferred.reject(errors);
            }
            else if (status === 500) { // 500- Internal Server Error
                deferred.reject(['Internal server error occured']);
            } else if (status === 501 || status === 502 || status === 503) { // 500- Internal Server Error
                $window.location.href = '/500';
            } else if (status === 504) {
                $rootScope.showTimeoutError();
                return;
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

    this.getJSON = function(url, params) {
        return this.callWebService("GET", url, params);
    };

    this.putJSON = function(url, params) {
        return this.callWebService("PUT", url, params);
    };

    this.postJSON = function(url, data) {
        return this.callWebService("POST", url, data);
    };

    this.postJSONWithSpecialStatusHandling = function(url, data) {
        return this.callWebService("POST", url, data, true);
    };

    this.deleteJSON = function(url, params) {
        return this.callWebService("DELETE", url, params);
    };

}]);
