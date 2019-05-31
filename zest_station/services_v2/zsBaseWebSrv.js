angular.module('sntZestStation').
    service('zsBaseWebSrv', [
        '$http', '$q', '$window', '$rootScope', function($http, $q, $window, $rootScope) {

                /**
                 * Handles error responses
                 * @param {Promise} deferred promise
                 * @param {Array[String]} errors array of strings returned in the response
                 * @param {Number} status HTTP response status
                 */
                function webserviceErrorActions(deferred, errors, status) {
                    switch (status) {
                        case 406: // Network error
                        case 422: // Validation
                            deferred.reject(errors);
                            break;
                        case 500: // Internal Server Error
                            deferred.reject(['Internal server error occurred']);
                            break;
                        case 401: // Unauthorized
                            $window.location.href = '/login';
                            break;
                        default:
                            deferred.reject(errors);
                    }
                }


                /**
                 * A http requester method for calling webservice
                 * @param {String} httpMethod type
                 * @param {String} url endpoint
                 * @param {String} params http method parameters
                 * @param {Object} flags for special handling of responses
                 * @return {!ManagedPromise<T>} promise
                 */
                this.callWebService = function(httpMethod, url, params, flags) {
                    var deferred = $q.defer(),
                        httpDict = {};

                    if (angular.isUndefined(params)) {
                        params = '';
                    }

                    flags = flags || {};

                    httpDict.url = url;
                    httpDict.method = httpMethod;

                    if (httpMethod === 'GET' || httpMethod === 'DELETE') {
                        httpDict.params = params;
                    } else if (httpMethod === 'POST' || httpMethod === 'PUT') {
                        httpDict.data = params;
                        if (angular.isDefined($rootScope.workstation_id)) {
                            httpDict.data.workstation_id = $rootScope.workstation_id;
                        }
                    }

                    $http(httpDict).
                        then(function(response) {
                            var data = response.data,
                                status = response.status,
                                headers = response.headers;

                            // 202 ---> The request has been accepted for processing, but the processing has not been completed.
                            // 102 ---> This code indicates that the server has received and is
                            //                  processing the request, but no response is available yet
                            if (flags.handleSpecialStatus && (status === 202 || status === 102 || status === 250)) {
                                response.data = {
                                    'status': 'processing_not_completed',
                                    'location_header': headers('Location')
                                };
                            }

                            deferred.resolve(data);
                        }, function(response) {
                            var errors = response.errors || response.data,
                                status = response.status;

                            webserviceErrorActions(deferred, errors, status);
                        });

                    return deferred.promise;
                };

                this.getJSON = function(url, params) {
                    return this.callWebService('GET', url, params);
                };

                this.putJSON = function(url, params) {
                    return this.callWebService('PUT', url, params);
                };

                this.postJSON = function(url, data) {
                    return this.callWebService('POST', url, data);
                };

                this.deleteJSON = function(url, params) {
                    return this.callWebService('DELETE', url, params);
                };

                this.postJSONWithSpecialStatusHandling = function(url, data) {
                    return this.callWebService('POST', url, data, {
                        handleSpecialStatus: true
                    });
                };

                this.getJSONWithSpecialStatusHandling = function(url, data) {
                    return this.callWebService('GET', url, data, {
                        handleSpecialStatus: true
                    });
                };

            }
        ]
    );
