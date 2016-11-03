angular.module('sntPay').service('sntShijiGatewaySrv', ['$q', '$http', '$timeout', '$interval', '$log',
    function($q, $http, $timeout, $interval, $log) {
        var service = this;

        service.initiatePayment = function(reservationId, payLoad) {
            return $http.post('api/reservations/' + reservationId + '/submit_payment/', payLoad);
        };


        service.pollPaymentStatus = function(id, timeout) {
            var deferred = $q.defer(),
                ms = 1000,
                defaultTimeout = 120,
                baseUrl = '/api/async_callbacks/',
                timeStampInSeconds = 0,
                pollingInterval = 5000,
                refreshIntervalId = $interval(()=> {
                    timeStampInSeconds++;
                }, ms),
                poller = function() {
                    if (timeStampInSeconds >= timeout) {
                        clearInterval(refreshIntervalId);
                        $log.warn('timeout: [shiji] transaction timed out after ' + timeout + '. from hotel_settings.json emv_timeout');
                        deferred.reject(['Request timed out. Unable to process the transaction']);
                    } else {
                        $http.get(baseUrl + id)
                            .success((data, status) => {
                                // if the request is still not processed
                                if (status === 202 || status === 102 || status === 250) {
                                    $timeout(function() {
                                        $log.info('polling: [shiji] waiting for response');
                                        poller();
                                    }, pollingInterval);
                                } else {
                                    clearInterval(refreshIntervalId);
                                    deferred.resolve(data);
                                }
                            })
                            .error(data => {
                                if (!data) {
                                    poller();
                                } else {
                                    clearInterval(refreshIntervalId);
                                    deferred.reject(data);
                                }
                            });
                    }
                };

            timeout = timeout || defaultTimeout;
            poller();
            return deferred.promise;
        };

    }
]);