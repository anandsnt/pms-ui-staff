admin.service('ADEmvTerminalsSrv', ['$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', '$rootScope', '$interval', '$http', '$timeout', '$log',
    function ($q, ADBaseWebSrv, ADBaseWebSrvV2, $rootScope, $interval, $http, $timeout, $log) {

        /*
         * service class for emv terminal related operations
         */

        var service = this,
            elapsedTimeinSeconds = 0,
            promiseIntervalTimer; // holds the promise returned by $interval

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
                        }, 5000);
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

        /*
         * getter method to fetch emv terminal list
         * @return {object} room list
         */
        this.fetchItemList = function () {
            var deferred = $q.defer();
            var url = '/api/emv_terminals';

            ADBaseWebSrvV2.getJSON(url).then(function (data) {
                deferred.resolve(data);
            }, function (errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };


        /*
         * method to delete emv terminal
         * @param {integer} clicked emv terminal's id
         */
        this.deleteItem = function (data) {
            var id = data.item_id;
            var deferred = $q.defer();
            var url = '/api/emv_terminals/' + id;

            ADBaseWebSrvV2.deleteJSON(url).then(function (data) {
                deferred.resolve(data);
            }, function (errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };

        /*
        * method to get emv terminal details
        * @param {integer} emv terminal id
        */
        this.getItemDetails = function (data) {
            var id = data.item_id;
            var url = '/api/emv_terminals/' + id;
            var deferred = $q.defer();

            ADBaseWebSrvV2.getJSON(url).then(function (data) {
                deferred.resolve(data);
            }, function (errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };

        /* method to save the emv terminal details
        * @param {object} details of emv terminal
        */
        this.saveItemDetails = function (itemDetails) {
            var url = '/api/emv_terminals';
            var deferred = $q.defer();

            ADBaseWebSrvV2.postJSON(url, itemDetails).then(function (data) {
                deferred.resolve(data);
            }, function (errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };

        /* method to update the emv terminal details
        * @param {object} details of emv terminal
        */
        this.updateItemDetails = function (data) {
            var url = '/api/emv_terminals/' + data.id;
            var deferred = $q.defer();

            ADBaseWebSrvV2.putJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };

        service.runTerminalCommand = function (data) {
            var url = '/api/emv_terminals/' + data.terminalId + '/commands',
                deferred = $q.defer();


            ADBaseWebSrvV2.postJSONWithSpecialStatusHandling(url, {
                'command': data.command
            }).then(function (data) {
                if (data.status === 'processing_not_completed' && data.location_header) {
                    elapsedTimeinSeconds = 0;
                    promiseIntervalTimer = $interval(incrementTimer, 1000);
                    pollToTerminal(deferred, data.location_header);
                } else {
                    deferred.resolve(data);
                }
            }, function (errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };
        /*
         * Service to get the infrasec details
         *
         */

        this.getHotelInfrasecDetails = function (data) { 
            var url = "/admin/hotels/" + data.hotel_id + "/hotel_infrasec_details";
            var deferred = $q.defer();

            ADBaseWebSrvV2.getJSON(url).then(function (data) {
                deferred.resolve(data);
            }, function (errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };

    }]);
