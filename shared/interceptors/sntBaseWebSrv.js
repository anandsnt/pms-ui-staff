/**
 * sntBaseWebSrv
 * @param {function} $http AngularJS HttpProvider
 * @param {function} $q AngularJS qProvider
 * @param {function} $window AngularJS WindowProvider
 * @param {function} $rootScope RootScope
 * @param {function} $log AngularJS logProvider
 * @returns {undefined}
 */
function sntBaseWebSrv($http, $q, $window, $rootScope, $log) {
    /**
     * webserviceErrorActions
     * @param {string} url endpoint
     * @param {object} deferred promise
     * @param {array} errors array of errors
     * @param {number} status response code
     * @returns {undefined}
     */
    var webserviceErrorActions = function (url, deferred, errors, status) {
        // please note the type of error expecting is array
        // so form error as array if you modifying it

        if (status === 406) { // 406- Network error
            deferred.reject(errors);
        } else if (status === 422) { // 422
            deferred.reject(errors);
        } else if (status === 500) { // 500- Internal Server Error
            deferred.reject(['Internal server error occured']);
        } else if (status === 501 || status === 502 || status === 503) { // 500- Internal Server Error
            $window.location.href = '/500';
        } else if (status === 504) {
            if ($rootScope.showTimeoutError) {
                $rootScope.showTimeoutError();
            } else {
                $log.error('504 - Not handled!');
            }
        } else if (status === 401) { // 401- Unauthorized
            // so lets redirect to login page
            $window.location.href = '/logout';
        }

        // set of custom error emssage range http status
        else if (status >= 470 && status <= 490) {
            errors.httpStatus = status;
            errors.errorMessage = errors;
            deferred.reject(errors);
        }
        // CICO-26779 : Handling 404 - Not found.
        else if (status === 404) {
            $log.warn('Found 404 Error : ' + url);
        } else {
            deferred.reject(errors);
        }
    };

    /**
     *   A http requester method for calling webservice
     *   @param {function} httpMethod function of the method to call like $http.get, $http.put..
     *   @param {string} url webservice url
     *   @param {Object} params data for webservice
     *   @return {promise} promise
     */
    this.callWebService = function (httpMethod, url, params) {
        var deferred = $q.defer(),
            httpDict = {};

        if (angular.isUndefined(params)) {
            params = {};
        }
        httpDict.url = url;
        httpDict.method = httpMethod;
        if (httpMethod === 'GET' || httpMethod === 'DELETE') {
            httpDict.params = params || {};
            if (angular.isDefined($rootScope.workstation_id)) {
                httpDict.params.workstation_id = $rootScope.workstation_id;
            }
        } else if (httpMethod === 'POST' || httpMethod === 'PUT') {
            httpDict.data = params;
            if (angular.isDefined($rootScope.workstation_id)) {
                httpDict.data.workstation_id = $rootScope.workstation_id;
            }
        }

        $http(httpDict).then(function (response) {
            deferred.resolve(response.data);
        }, function (response) {
            webserviceErrorActions(url, deferred, response.data, response.status);
        });
        return deferred.promise;
    };


    /**
     *   A http requester method for calling webservice
     *   @param {function} httpMethod function of the method to call like $http.get, $http.put..
     *   @param {string} url webservice url
     *   @param {Object} params data for webservice
     *   @return {promise} promise
     */
    this.callWebServiceWithSpecialStatusHandling = function (httpMethod, url, params) {
        var deferred = $q.defer(),
            httpDict = {};

        if (typeof params === 'undefined') {
            params = '';
        }

        // Sample params {params:{fname: "fname", lname: "lname"}}

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

        $http(httpDict).then(function (response) {

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
        }, function (response) {
            var errors = response.errors,
                status = response.status;

            webserviceErrorActions(url, deferred, errors, status);
        });

        return deferred.promise;
    };

    /**
     * postJSONWithSpecialStatusHandling
     * @param {string} url endpoint
     * @param {object} data payload
     * @returns {promise} promise   
     */
    this.postJSONWithSpecialStatusHandling = function (url, data) {
        return this.callWebServiceWithSpecialStatusHandling('POST', url, data);
    };

    /**
     * getJSONWithSpecialStatusHandling
     * @param {string} url endpoint
     * @param {object} data payload
     * @returns {promise} promise   
     */
    this.getJSONWithSpecialStatusHandling = function (url, data) {
        return this.callWebServiceWithSpecialStatusHandling('GET', url, data);
    };

    /**
     * getJSON
     * @param {string} url endpoint
     * @param {object} params payload
     * @returns {promise} promise   
     */
    this.getJSON = function (url, params) {
        return this.callWebService('GET', url, params);
    };

    /**
     * putJSON
     * @param {string} url endpoint
     * @param {object} params payload
     * @returns {promise} promise   
     */
    this.putJSON = function (url, params) {
        return this.callWebService('PUT', url, params);
    };

    /**
     * postJSON
     * @param {string} url endpoint
     * @param {object} data payload
     * @returns {promise} promise   
     */
    this.postJSON = function (url, data) {
        return this.callWebService('POST', url, data);
    };

    /**
     * deleteJSON
     * @param {string} url endpoint
     * @param {object} params payload
     * @returns {promise} promise
     */
    this.deleteJSON = function (url, params) {
        return this.callWebService('DELETE', url, params);
    };

}

// TODO: Add a similar definition for adBaseWebSrvV2, and also relevant services used in GW & ZS thus reducing code duplication
angular.module('sharedHttpInterceptor').service('rvBaseWebSrvV2', ['$http', '$q', '$window', '$rootScope', '$log',
    sntBaseWebSrv]);

angular.module('sharedHttpInterceptor').service('sntBaseWebSrv', ['$http', '$q', '$window', '$rootScope', '$log',
    sntBaseWebSrv]);
