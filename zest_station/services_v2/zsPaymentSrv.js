/**
 * Service used for tablet-kiosk UI (Zest Station)
 */

sntZestStation.service('zsPaymentSrv', ['$http', '$q', 'zsBaseWebSrv', '$rootScope', 'zsBaseWebSrv2',
    function($http, $q, zsBaseWebSrv, $rootScope, zsBaseWebSrv2) {
        // service provider for common utilities
        var that = this,
            TERMINAL_POLLING_INTERVAL_MS = 3000;


        var paymentData = null;

        this.cancelEMVActions = function(params) {
            var url = '/api/cc/emv_cancel';

            return zsBaseWebSrv.postJSON(url, params);
        };

        this.setPaymentData = function (data) {
            paymentData = angular.copy(data);
        };

        this.getPaymentData = function () {
            return paymentData;
        };

        this.getSubmitPaymentParams = function () {
            return {
                bill_id: paymentData.bill_id,
                postData: {
                    amount: paymentData.amount,
                    bill_number: 1,
                    is_split_payment: false,
                    payment_type: 'CC',
                    workstation_id: paymentData.workstation_id,
                    total_value_plus_fees: paymentData.total_value_plus_fees,
                    fees_amount: paymentData.fees_amount,
                    fees_charge_code_id: paymentData.fees_charge_code_id
                },
                reservation_id: paymentData.reservation
            };
        };

        this.savePayment = function(params) {
            var deferred = $q.defer(),
                url = '/staff/reservation/save_payment';

            zsBaseWebSrv2.postJSON(url, params).then(function(data) {
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
        // method cloned from rvUtilSrv
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
            var url = '/api/reservations/' + postData.reservation_id + '/submit_payment';

            var pollToTerminal = function(async_callback_url) {
                // we will continously communicate with the terminal till 
                // the timeout set for the hotel
                if (timeStampInSeconds >= $rootScope.emvTimeout) {
                    var errors = ["Request timed out. Unable to process the transaction"];

                    clearInterval(refreshIntervalId);
                    deferred.reject(errors);
                } else {
                    zsBaseWebSrv.getJSONWithSpecialStatusHandling(async_callback_url).then(function(data) {
                        // if the request is still not proccesed
                        if ((!!data.status && data.status === 'processing_not_completed') || data === "null") {
                            // is this same URL ?
                            setTimeout(function() {
                                console.info("POLLING::-> for emv terminal response");
                                pollToTerminal(async_callback_url);
                            }, TERMINAL_POLLING_INTERVAL_MS);
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
                }
            };

            zsBaseWebSrv.postJSONWithSpecialStatusHandling(url, postData).then(function(data) {
                // if connect to emv terminal is neeeded
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

        // this.chipAndPinGetToken = function(postData) {
        //     var deferred = $q.defer();
        //     var url = '/api/cc/get_token.json';
        //     //var url = '/api/reservations/'+postData.reservation_id+'/submit_payment';
        //     zsBaseWebSrv.postJSON(url, postData).then(function(data) {
        //         deferred.resolve(data);
        //     }, function(data) {
        //         deferred.reject(data);
        //     });
        //     return deferred.promise;
        // };


        this.authorizeCC = function(postData) {
            var timeStampInSeconds = 0;
            var incrementTimer = function() {
                timeStampInSeconds++;
            };
            var refreshIntervalId = setInterval(incrementTimer, 1000);

            var deferred = $q.defer();
            var url = '/api/cc/authorize';

            var pollToTerminal = function(async_callback_url) {
                // we will continously communicate with the terminal till
                // the timeout set for the hotel
                if (timeStampInSeconds >= $rootScope.emvTimeout) {
                    var errors = ['Request timed out. Unable to process the transaction'];

                    clearInterval(refreshIntervalId);
                    deferred.reject(errors);
                } else {
                    zsBaseWebSrv.getJSONWithSpecialStatusHandling(async_callback_url).then(function(data) {
                        // if the request is still not proccesed
                        if (!!data.status && data.status === 'processing_not_completed' || data === 'null') {
                            // is this same URL ?
                            setTimeout(function() {
                                console.info('POLLING::-> for emv terminal response');
                                pollToTerminal(async_callback_url);
                            }, TERMINAL_POLLING_INTERVAL_MS);
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
                }
            };


            zsBaseWebSrv.postJSONWithSpecialStatusHandling(url, postData).then(function(data) {
                // if connect to emv terminal is neeeded
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

        this.sampleMLISwipedCardResponse = {
            "RVCardReadCardIIN": "374200",
            "RVCardReadCardName": "TEST CARD 12 UAT USA",
            "RVCardReadCardType": "AX",
            "RVCardReadETB": "",
            "RVCardReadETBKSN": "",
            "RVCardReadExpDate": "2001",
            "RVCardReadIsEncrypted": "1",
            "RVCardReadMaskedPAN": "374200030001006",
            "RVCardReadPAN": "374200030001006",
            "RVCardReadTrack1": "30D979FBE08486736DB43D12C57B4EBE3BD471584B6AD3D6F3BCFE38D9167FD35E7D9AF57FC2FF32D9B6BFFEE6661366E43BF709837A38EB5335AFD8D357BE553D0D923D0C00283A",
            "RVCardReadTrack1KSN": "9012080B2ACA76000878",
            "RVCardReadTrack2": "D791C3A38FF3FAC1B241D97DBB717B826E4D356163B374BA2CC5CF156510DCD50FF6997EFF06B6B4",
            "RVCardReadTrack2KSN": "9012080B2ACA76000878",
            "RVCardReadTrack3": "",
            "RVCardReadTrack3KSN": "9012080B2ACA76000878",
            "token": "9012080B2ACA76000878"
        };

        this.chipAndPinGetToken = function(postData) {
            var timeStampInSeconds = 0;
            var incrementTimer = function() {
                timeStampInSeconds++;
            };
            var refreshIntervalId = setInterval(incrementTimer, 1000);

            var deferred = $q.defer();
            var url = '/api/cc/get_token.json';
            var pollToTerminal = function(async_callback_url) {
                // we will continously communicate with the terminal till 
                // the timeout set for the hotel
                if (timeStampInSeconds >= $rootScope.emvTimeout) {
                    var errors = ["Request timed out. Unable to process the transaction"];

                    clearInterval(refreshIntervalId);
                    deferred.reject(errors);
                } else {
                    zsBaseWebSrv.getJSONWithSpecialStatusHandling(async_callback_url).then(function(data) {
                        // if the request is still not proccesed
                        if ((!!data.status && data.status === 'processing_not_completed') || data === "null") {
                            // is this same URL ?
                            setTimeout(function() {
                                console.info("POLLING::-> for emv terminal response");
                                pollToTerminal(async_callback_url);
                            }, TERMINAL_POLLING_INTERVAL_MS);
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
                }
            };


            zsBaseWebSrv.postJSONWithSpecialStatusHandling(url, postData).then(function(data) {
                // if connect to emv terminal is neeeded
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

        this.fetchAvailablePaymentTyes = function() {
            var url = '/staff/payments/addNewPayment.json';

            return zsBaseWebSrv2.getJSON(url);
        };

    }
]);
