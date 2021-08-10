angular.module('sntPay').service('sntShift4GatewaySrv', ['$q', '$http', '$timeout', '$interval', '$log',
    function($q, $http, $timeout, $interval, $log) {
        var service = this,
            shouldPoll = true;

        service.iframe_config = function() {
            var deferred = $q.defer(),
                url = '/api/ipage/shift4';

            $http.get(url).then(function(response) {
                deferred.resolve(response.data);
            }, function(response) {
                deferred.reject(response.data);
            });
            return deferred.promise;
        };

        service.initiatePayment = function(reservationId, payLoad) {
            return $http.post('api/reservations/' + reservationId + '/submit_payment/', payLoad);
        };

        service.stopPolling = function() {
            shouldPoll = false;
        };

        service.pollPaymentStatus = function(id, timeout) {
            var deferred = $q.defer(),
                ms = 1000,
                defaultTimeout = 120,
                baseUrl = '/api/async_callbacks/',
                timeStampInSeconds = 0,
                pollingInterval = 2000,
                refreshIntervalId = $interval(() => {
                    timeStampInSeconds++;
                }, ms),
                poller = function() {
                    if (timeStampInSeconds >= timeout) {
                        clearInterval(refreshIntervalId);
                        $log.warn('timeout: [shift4] transaction timed out after ' + timeout + '. from hotel_settings.json emv_timeout');
                        deferred.reject(['Request timed out. Unable to process the transaction']);
                    } else if (shouldPoll) {
                        $http.get(baseUrl + id)
                            .then(response => {
                                var data = response.data,
                                    status = response.status;

                                // if the request is still not processed
                                if (status === 202 || status === 102 || status === 250) {
                                    $timeout(function() {
                                        $log.info('polling: [shift4] waiting for response');
                                        poller();
                                    }, pollingInterval);
                                } else {
                                    clearInterval(refreshIntervalId);
                                    deferred.resolve(data);
                                }
                            }, response => {
                                if (!response.data) {
                                    poller();
                                } else {
                                    clearInterval(refreshIntervalId);
                                    deferred.reject(response.data);
                                }
                            });
                    } else {
                        clearInterval(refreshIntervalId);
                        deferred.reject(['Payment action cancelled']);
                    }
                };

            shouldPoll = true;
            timeout = timeout || defaultTimeout;
            poller();
            return deferred.promise;
        };
    }
]);
