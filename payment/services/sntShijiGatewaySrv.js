angular.module('sntPay').service('sntShijiGatewaySrv', ['$q', '$http', '$timeout', '$interval', '$log',
    function($q, $http, $timeout, $interval, $log) {
        var service = this,
            shouldPoll = true;

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
                        $log.warn('timeout: [shiji] transaction timed out after ' + timeout + '. from hotel_settings.json emv_timeout');
                        deferred.reject(['Request timed out. Unable to process the transaction']);
                        // TODO: Remove this sample response before merge
                        // deferred.resolve({
                        //     reservation_id: 1482139,
                        //     reservation_type_id: 4,
                        //     bill_balance: "-25.0",
                        //     reservation_balance: "5.00",
                        //     authorization_code: "094582",
                        //     payment_method: {
                        //         id: null,
                        //         token: null,
                        //         expiry_date: null,
                        //         card_type: null,
                        //         ending_with: null
                        //     },
                        //     is_eod_in_progress: false,
                        //     is_eod_manual_started: false,
                        //     is_eod_failed: true,
                        //     is_eod_process_running: false
                        // });
                    } else if (shouldPoll) {
                        $http.get(baseUrl + id)
                            .then(response => {
                                var data = response.data,
                                    status = response.status;

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