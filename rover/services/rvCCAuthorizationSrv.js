angular.module('sntRover').service('RVCCAuthorizationSrv', ['$http', '$q', 'RVBaseWebSrv', 'rvBaseWebSrvV2', '$rootScope', '$log', '$timeout', '$interval',
    function ($http, $q, RVBaseWebSrv, rvBaseWebSrvV2, $rootScope, $log, $timeout, $interval) {

        var service = this,
            elapsedTimeinSeconds = 0,
            promiseIntervalTimer, // holds the promise returned by $interval
            TERMINAL_POLLING_INTERVAL_MS = 3000,
            isAuthInProgress = false;

        var incrementTimer = function () {
            elapsedTimeinSeconds++;
        };

        var pollToTerminal = function (deferred, async_callback_url) {
            // In case of testing in development env w/o a configured terminal uncomment the following line
            // async_callback_url = '/sample_json/payment/six_payment_sample.json';

            if (elapsedTimeinSeconds >= parseInt($rootScope.emvTimeout, 10)) {
                var errors = ['Request timed out. Unable to process the transaction'];

                $interval.cancel(promiseIntervalTimer);
                deferred.reject(errors);
            } else {
                $http.get(async_callback_url).then(function (response) {
                    var data = response.data,
                        status = response.status;

                    // if the request is still not processed
                    if (status === 202 || status === 102 || status === 250) {
                        $timeout(function () {
                            $log.info('POLLING::-> for emv terminal response');
                            pollToTerminal(deferred, async_callback_url);
                        }, TERMINAL_POLLING_INTERVAL_MS);
                    } else {
                        $interval.cancel(promiseIntervalTimer);
                        deferred.resolve(data);
                    }
                }, function (response) {
                    if (!response.data) {
                        $timeout(function () {
                            pollToTerminal(deferred, async_callback_url);
                        }, 2000);
                    } else {
                        $interval.cancel(promiseIntervalTimer);
                        deferred.reject(response.data);
                    }
                });
            }
        };

        /**
         * function to get list bill specific credit card info for Authorization
         * @param {Object} - contain reservation id
         * @return {Promise} - After resolving it will return the list cards.
         */
        this.fetchCreditCardAuthInfo = function (param) {
            var deferred = $q.defer();
            var url = '/staff/reservation/' + param.reservation_id + '/credit_card_auth_info';

            rvBaseWebSrvV2.getJSON(url).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        /**
         * functio to perform creditcard Authorization
         * @param {Object} - contain payment_method_id, auth_amount.
         * @return {Promise} - After resolving it will return promis.
         */
        service.manualAuthorization = function (param) {
            var deferred = $q.defer();
            var url = '/api/cc/authorize';

            // CICO-45248 Ensure duplicate auth calls aren't made from the UI
            if (isAuthInProgress) {
                $log.warn('Authorization attempted when previous call pending!');
            }

            isAuthInProgress = true;

            rvBaseWebSrvV2.postJSONWithSpecialStatusHandling(url, param).then(function (data) {
                if (data.status === 'processing_not_completed' && data.location_header) {
                    elapsedTimeinSeconds = 0;
                    promiseIntervalTimer = $interval(incrementTimer, 1000);
                    pollToTerminal(deferred, data.location_header);
                } else {
                    isAuthInProgress = false;
                    deferred.resolve(data);
                }
            }, function (data) {
                isAuthInProgress = false;
                deferred.reject(data);
            });
            return deferred.promise;
        };


        /**
         * Performs the release of already authorized ones
         * @param {Object} - contain payment_method_id.
         * @return {Promise} - After resolving it will return promise.
         */
        this.releaseAuthorization = function (param) {
            var deferred = $q.defer();
            var url = '/api/cc/reverse';

            rvBaseWebSrvV2.postJSON(url, param).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        /**
         * expects sample response
         * {
         *  "authorize_cc_at_checkin":true,
         *  "is_cc_authorize_at_checkin_enabled":true,
         *  "is_cc_authorize_for_incidentals_active":true,
         *  "is_routing_present":true,
         *  "pre_auth_amount_at_checkin":156.94,
         *  "pre_auth_amount_for_incidentals":100.0,
         *  "pre_auth_amount_for_zest_station":100.0,
         *  }
         * @param {string|number} reservationId reservation id
         * @return {*|promise|{then, catch, finally}|e} promise of response
         */
        service.fetchPendingAuthorizations = function (reservationId) {
            var deferred = $q.defer();
            var url = '/api/reservations/' + reservationId + '/pre_auth';

            rvBaseWebSrvV2.getJSON(url).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
    }]);
