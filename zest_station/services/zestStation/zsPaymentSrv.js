/**
 * Service used for tablet-kiosk UI (Zest Station)
 */

sntZestStation.service('zsPaymentSrv', ['$http', '$q', 'zsBaseWebSrv','$rootScope',
    function($http, $q, zsBaseWebSrv,$rootScope) {
        //service provider for common utilities
        var that = this;

        this.savePayment = function(params) {
            var deferred = $q.defer(),
                url = '/staff/reservation/save_payment';

            zsBaseWebSrv.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.tokenize = function(data) {
            var deferred = $q.defer();
            var url = '/staff/payments/tokenize';

            zsBaseWebSrv.postJSON(url, data).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.acceptEarlyCheckinOffer = function(data) {
            var deferred = $q.defer();
            var url = '/api/reservations/apply_early_checkin_offer';

            zsBaseWebSrv.postJSON(url, data).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        /** Method to check if the web app is accessed from a device */
        //method cloned from rvUtilSrv
        this.checkDevice = {
            any: function() {
                return !!navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i);
            },
            iOS: function() {
                return !!navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            android: function() {
                return navigator.userAgent.match(/Android/i);
            }
        };



        this.submitDeposit = function(postData) {
            // var deferred = $q.defer();
            // var url = '/api/reservations/' + postData.reservation_id + '/submit_payment';
            // zsBaseWebSrv.postJSON(url, postData).then(function(data) {
            //     deferred.resolve(data);
            // }, function(data) {
            //     deferred.reject(data);
            // });
            // return deferred.promise;
            // 
            var timeStampInSeconds = 0;
            var incrementTimer = function() {
                timeStampInSeconds++;
            };
            var refreshIntervalId = setInterval(incrementTimer, 1000);

            var deferred = $q.defer();
            var url = 'api/reservations/' + postData.reservation_id + '/submit_payment';

            var pollToTerminal = function(async_callback_url) {
                //we will continously communicate with the terminal till 
                //the timeout set for the hotel
                if (timeStampInSeconds >= $rootScope.emvTimeout) {
                    var errors = ["Request timed out. Unable to process the transaction"];
                    clearInterval(refreshIntervalId);
                    deferred.reject(errors);
                } else {
                    zsBaseWebSrv.getJSONWithSpecialStatusHandling(async_callback_url).then(function(data) {
                        //if the request is still not proccesed
                        if ((!!data.status && data.status === 'processing_not_completed') || data === "null") {
                            //is this same URL ?
                            setTimeout(function() {
                                console.info("POLLING::-> for emv terminal response");
                                pollToTerminal(async_callback_url);
                            }, 5000)
                        } else {
                            clearInterval(refreshIntervalId);
                            deferred.resolve(data);
                        }
                    }, function(data) {
                        if (typeof data === 'undefined') {
                            pollToTerminal(async_callback_url);
                        } else {
                            clearInterval(refreshIntervalId);
                            deferred.reject(data);
                        }
                    });
                };
            };

            zsBaseWebSrv.postJSONWithSpecialStatusHandling(url,postData).then(function(data) {
                //if connect to emv terminal is neeeded
                // need to poll oftently to avoid
                // timeout issues
                if (postData.is_emv_request) {
                    if (!!data.status && data.status === 'processing_not_completed') {
                        pollToTerminal(data.location_header);
                    } else {
                        clearInterval(refreshIntervalId);
                        deferred.resolve(data);
                    }
                } else {
                    clearInterval(refreshIntervalId);
                    deferred.resolve(data);
                }
            }, function(data) {
                clearInterval(refreshIntervalId);
                deferred.reject(data);
            });
            return deferred.promise;
        };
        this.authorizeCC = function(postData) {
            //send is_emv_request = true, to init sixpay device and capture card
            // var deferred = $q.defer();
            // var url = '/api/cc/authorize';
            // zsBaseWebSrv.postJSON(url, postData).then(function(data) {
            //     deferred.resolve(data);
            // }, function(data) {
            //     deferred.reject(data);
            // });
            // return deferred.promise;
            // 
            
            //for emv actions we need a timer
            var timeStampInSeconds = 0;
            var incrementTimer = function() {
                timeStampInSeconds++;
            };
            var refreshIntervalId = setInterval(incrementTimer, 1000);

            var deferred = $q.defer();
            var url = '/api/cc/authorize';
            var pollToTerminal = function(async_callback_url) {
                //we will continously communicate with the terminal till 
                //the timeout set for the hotel
                if (timeStampInSeconds >= $rootScope.emvTimeout) {
                    var errors = ["Request timed out. Unable to process the transaction"];
                    clearInterval(refreshIntervalId);
                    deferred.reject(errors);
                } else {
                    zsBaseWebSrv.getJSONWithSpecialStatusHandling(async_callback_url).then(function(data) {
                        //if the request is still not proccesed
                        if ((!!data.status && data.status === 'processing_not_completed') || data === "null") {
                            //is this same URL ?
                            setTimeout(function() {
                                console.info("POLLING::-> for emv terminal response");
                                pollToTerminal(async_callback_url);
                            }, 5000)
                        } else {
                            clearInterval(refreshIntervalId);
                            deferred.resolve(data);
                        }
                    }, function(data) {
                        if (typeof data === 'undefined') {
                            pollToTerminal(async_callback_url);
                        } else {
                            clearInterval(refreshIntervalId);
                            deferred.reject(data);
                        }
                    });
                };
            };
           

            zsBaseWebSrv.postJSONWithSpecialStatusHandling(url,postData).then(function(data) {
                //if connect to emv terminal is neeeded
                // need to poll oftently to avoid
                // timeout issues
                if (postData.is_emv_request) {
                    if (!!data.status && data.status === 'processing_not_completed') {
                        pollToTerminal(data.location_header);
                    } else {
                        clearInterval(refreshIntervalId);
                        deferred.resolve(data);
                    }
                } else {
                    clearInterval(refreshIntervalId);
                    deferred.resolve(data);
                }
            }, function(data) {
                clearInterval(refreshIntervalId);
                deferred.reject(data);
            });
            return deferred.promise;
        };

        // the below code is not used anywhere

        // this.chipAndPinGetToken = function(postData){
        //         var deferred = $q.defer();
        //         var url = '/api/cc/get_token.json';
        //         //var url = '/api/reservations/'+postData.reservation_id+'/submit_payment';
        //         zsBaseWebSrv.postJSON(url, postData).then(function(data) {
        //                     deferred.resolve(data);
        //                 },function(data){
        //                     deferred.reject(data);
        //                 });
        //         return deferred.promise;
        // };


    }
]);