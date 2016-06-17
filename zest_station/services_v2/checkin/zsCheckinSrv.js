/**
 * Service used for tablet-kiosk UI (Zest Station)
 */

sntZestStation.service('zsCheckinSrv', ['$http', '$q', 'zsBaseWebSrv', 'zsBaseWebSrv2','$rootScope',
    function($http, $q, zsBaseWebSrv, zsBaseWebSrv2,$rootScope) {

        var that = this;
        this.checkInReservations = [];
        this.setCheckInReservations = function(data) {
            that.checkInReservations = [];
            that.checkInReservations = data;
        };

        this.getCheckInReservations = function() {
            return that.checkInReservations;
        };
        this.selectedCheckInReservation = [];
        this.setSelectedCheckInReservation = function(data) {
            that.selectedCheckInReservation = [];
            that.selectedCheckInReservation = data[0];
        };

        this.getSelectedCheckInReservation = function() {
            return that.selectedCheckInReservation;
        };
        //add / remove additional guests from reservation
        this.updateGuestTabDetails = function(data) {
            var deferred = $q.defer();
            var url = '/api/reservations/'+data.reservation_id+'/reservations_guest_details';
            zsBaseWebSrv.postJSON(url, data).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.authorizeCC = function(postData){
            //send is_emv_request = true, to init sixpay device and capture card
             // var deferred = $q.defer();
             //    var url = '/api/cc/authorize';
             //    zsBaseWebSrv.postJSON(url, postData).then(function(data) {
             //            deferred.resolve(data);
             //    }, function(data) {
             //            deferred.reject(data);
             //    });
             //    return deferred.promise;
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
        this.fetchReservations = function(params) {
            var deferred = $q.defer(),
                url = '/api/reservations';

            zsBaseWebSrv.getJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        this.fetchReservationDetails = function(param) {
            var url;
            url = '/staff/staycards/reservation_details.json?reservation=' + param.id;
            var deferred = $q.defer();

            zsBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchAddonDetails = function(param) {
            var deferred = $q.defer(),
                url = '/staff/staycards/reservation_addons?reservation_id=' + param.id;

            zsBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        this.checkInGuest = function(params) {
            var deferred = $q.defer(),
                url = '/staff/checkin';

            zsBaseWebSrv.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.saveNationality = function(params) {
            var deferred = $q.defer();
            url = '/api/guest_details/' + params.guest_id;
            var param = {
                "nationality_id": params.nationality_id
            }
            zsBaseWebSrv.putJSON(url, param).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        this.fetchOwsMessage = function(params) {

            var deferred = $q.defer();
            var url = '/api/reservation_guest_messages/' + params.reservation_id + '.json';
            //var url = '/sample_json/zest_station/ows_msgs.json';
            zsBaseWebSrv.getJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.sendOWSMsgAsMail = function(params) {
            var deferred = $q.defer();
            url = 'api/reservation_guest_messages/email_message.json';

            zsBaseWebSrv.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.checkInGuest = function(params) {
            var deferred = $q.defer(),
                url = '/staff/checkin';

            zsBaseWebSrv2.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.sendRegistrationByEmail = function(data) { //to get terms & conditions
            var deferred = $q.defer();
            var id = data.id;
            var url = '/api/reservations/' + id + '/email_registration_card';
            var params = {
                "application": data.application
            };
            zsBaseWebSrv.getJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchRegistrationCardPrintData = function(params) {
            var deferred = $q.defer();
            var url = '/api/reservations/' + params.id + '/print_registration_card';
            zsBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });

            return deferred.promise;
        };
        
        this.assignGuestRoom = function(params) {
            //params['reservation_id'] = some id...
            var deferred = $q.defer(),
                url = '/guest/reservations/assign_room';

            zsBaseWebSrv.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchReservationBalanceDetails = function(params){

            var deferred = $q.defer();
            url = 'zest_station/reservations/' + params.reservation_id;
            var param = {
                "nationality_id": params.nationality_id
            }
            zsBaseWebSrv2.getJSON(url, param).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        
        this.fetchUpsellDetails = function(reservation) {
            var deferred = $q.defer(),
                url = 'guest_web/reservations/'+reservation.id+'.json';

            zsBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

    }
]);