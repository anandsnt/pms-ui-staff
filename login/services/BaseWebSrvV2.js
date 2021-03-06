angular.module('login').service('BaseWebSrvV2', ['$http', '$q', '$window', '$rootScope', function($http, $q, $window, $rootScope) {

    var webserviceErrorActions = function(url, deferred, errors, status) {
        var urlStart = url.split('?')[0];
        // please note the type of error expecting is array
        // so form error as array if you modifying it


        if (status === 406) { // 406- Network error
            deferred.reject(errors);
        } else if (status === 422) { // 422
            deferred.reject(errors);
        } else if (status === 500) { // 500- Internal Server Error
            deferred.reject(['Internal server error occured']);
        } else if (status === 501 || status === 502 || status === 503 || status === 504) { // 500- Internal Server Error
            $window.location.href = '/500';
        }

        // set of custom error emssage range http status
        else if (status >= 470 && status <= 490) {
            errors.httpStatus = status;
            errors.errorMessage = errors;
            deferred.reject(errors);
        }
        // CICO-26779 : Handling 404 - Not found.
        else if (status === 404) {
            console.warn("Found 404 Error : " + url);
        } else {
            deferred.reject(errors);
        }
    };
    /**
     *   A http requester method for calling webservice
     *   @param {function} function of the method to call like $http.get, $http.put..
     *   @param {string} webservice url
     *   @param {Object} data for webservice
     *   @return {promise}
     */

    this.callWebService = function(httpMethod, url, params, data) {
        var deferred = $q.defer();

        if (typeof params === "undefined") {
            params = {};
        }

        // Sample params {params:{fname: "fname", lname: "lname"}}
        var httpDict = {};

        httpDict.url = url;
        httpDict.method = httpMethod;
        if (httpMethod === 'GET' || httpMethod === 'DELETE') {
            httpDict.params = params;
            if (typeof $rootScope.workstation_id !== 'undefined') {
                httpDict.params.workstation_id = $rootScope.workstation_id;
           }
        }
        else if (httpMethod === 'POST' || httpMethod === 'PUT') {
            httpDict.data = params;
            if (typeof $rootScope.workstation_id !== 'undefined') {
                httpDict.data.workstation_id = $rootScope.workstation_id;
            }
        }

        $http(httpDict).then(function(response) {
            deferred.resolve(response.data);
        }, function(response) {
            var errors = response.data,
                status = response.status;

            webserviceErrorActions(url, deferred, errors, status);
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

    this.deleteJSON = function(url, params) {
        return this.callWebService("DELETE", url, params);
    };


    /** ************************************************************************************/

    /**
     *   A http requester method for calling webservice
     *   @param {function} function of the method to call like $http.get, $http.put..
     *   @param {string} webservice url
     *   @param {Object} data for webservice
     *   @return {promise}
     */
    this.callWebServiceWithSpecialStatusHandling = function(httpMethod, url, params, data) {
        var deferred = $q.defer();

        if (typeof params === "undefined") {
            params = "";
        }

        // Sample params {params:{fname: "fname", lname: "lname"}}
        var httpDict = {};

        httpDict.url = url;
        httpDict.method = httpMethod;
        if (httpMethod === 'GET' || httpMethod === 'DELETE') {
            httpDict.params = params;
            if (typeof $rootScope.workstation_id !== 'undefined') {
                httpDict.params.workstation_id = $rootScope.workstation_id;
            }
        } else if (httpMethod === 'POST' || httpMethod === 'PUT') {
            httpDict.data = params;
            if (typeof $rootScope.workstation_id !== 'undefined') {
                httpDict.data.workstation_id = $rootScope.workstation_id;
            }
        }

        $http(httpDict).then(function(res) {
            var response = res.data,
                status = res.status,
                headers = res.headers;

            // 202 ---> The request has been accepted for processing, but the processing has not been completed.
            // 102 ---> This code indicates that the server has received and is processing the request, but no response is available yet
            if (status === 202 || status === 102 || status === 250) {
                deferred.resolve({
                    'status': 'processing_not_completed',
                    'location_header': headers('Location')
                });
            } else {
                deferred.resolve(response);
            }
        }, function(response) {
            var errors = response.data,
                status = response.status;

            webserviceErrorActions(url, deferred, errors, status);
        });
        return deferred.promise;
    };

    this.postJSONWithSpecialStatusHandling = function(url, data) {
        return this.callWebServiceWithSpecialStatusHandling("POST", url, data);
    };

    this.getJSONWithSpecialStatusHandling = function(url, data) {
        return this.callWebServiceWithSpecialStatusHandling("GET", url, data);
    };

}]);
