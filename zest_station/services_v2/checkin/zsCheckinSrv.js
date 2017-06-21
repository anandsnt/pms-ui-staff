/**
 * Service used for tablet-kiosk UI (Zest Station)
 */

sntZestStation.service('zsCheckinSrv', ['$http', '$q', 'zsBaseWebSrv', 'zsBaseWebSrv2', '$rootScope',
    function($http, $q, zsBaseWebSrv, zsBaseWebSrv2, $rootScope) {

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
        // add / remove additional guests from reservation
        this.updateGuestTabDetails = function(data) {
            var deferred = $q.defer();
            var url = '/api/reservations/' + data.reservation_id + '/reservations_guest_details';

            zsBaseWebSrv.postJSON(url, data).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.authorizeCC = function(postData) {
            // send is_emv_request = true, to init sixpay device and capture card
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
                            }, 5000);
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

        /**
         * CICO-41520
         * Modified the zs services so that this is the ONLY method that makes this api call!
         * @param param
         * @return {*|promise|{then, catch, finally}|e}
         */
        this.fetchReservationDetails = function(param) {
            var url = '/staff/staycards/reservation_details.json?is_kiosk=true&reservation_id=' + param.id,
                deferred = $q.defer();

            // To fetch the latest guest details, the following parameter has to be sent to trigger a fetchProfile OWS request
            if (!$rootScope.isStandAlone) {
                url += '&sync_guest_with_external_pms=true';
            }

            zsBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });

            return deferred.promise;
        };

        /**
         * /api/reservations/:reservation_id/pre_auth
         * @param {String} id reservation_id
         * @return {HttpPromise} authorize_cc_at_checkin, pre_auth_amount_at_checkin, pre_auth_amount_for_zest_station
         */
        that.fetchReservationPreAuthInfo = function(id) {
            return $http.get('api/reservations/' + id + '/pre_auth');
        };

        /**
         * CICO-41520
         * Returns reservation_details.json response along with authorize_cc_at_checkin, pre_auth_amount_at_checkin, pre_auth_amount_for_zest_station
         * @param params
         * @return {*|promise|{then, catch, finally}|e}
         */
        that.fetchReservationInfo = function(params) {
            var deferred = $q.defer(),
                responses = {},
                promises = [];


            var onSuccessFetchReservationDetails = function(response) {
                responses['details'] = response;
            };

            var onSuccessFetchReservationPreAuth = function(response) {
                responses['preAuth'] = response.data;
                if (response.status !== 200) {
                    deferred.reject(response.data);
                }
            };

            promises.push(that.fetchReservationDetails(params).then(onSuccessFetchReservationDetails, onSuccessFetchReservationDetails));

            promises.push(that.fetchReservationPreAuthInfo(params.id).then(onSuccessFetchReservationPreAuth, onSuccessFetchReservationPreAuth));

            $q.all(promises).then(function() {
                var mergedReservationDetails = responses['details'];

                if (mergedReservationDetails.data) {
                    _.extend(mergedReservationDetails.data.reservation_card, responses['preAuth']);
                    deferred.resolve(mergedReservationDetails);
                } else {
                    deferred.reject(mergedReservationDetails);
                }
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


        this.sendThirdPartyEmail = function(params) {
            var deferred = $q.defer(),
                url = '/api/reservations/'+params.id+'/send_station_offer_mobilekey_mail';

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

            zsBaseWebSrv.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.saveNationality = function(params) {
            var deferred = $q.defer(),
                url = '/api/guest_details/' + params.guest_id;

                param = {
                    'nationality_id': params.nationality_id
                };

            zsBaseWebSrv.putJSON(url, param).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        this.fetchOwsMessage = function(params) {

            var deferred = $q.defer(),
                url = '/api/reservation_guest_messages/' + params.reservation_id + '.json';
            // var url = '/sample_json/zest_station/ows_msgs.json';

            zsBaseWebSrv.getJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        this.fetchECIPlaceholderData = function(params) {
            var deferred = $q.defer(),
                url = '/sample_json/zest_station/early_checkin.json';

            zsBaseWebSrv.getJSON(url, params).then(function(data) {
                deferred.resolve(data);

            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchDetailsPlaceholderData = function(params) {
            var deferred = $q.defer(),
                url = '/sample_json/zest_station/checkin_details.json';

            zsBaseWebSrv.getJSON(url, params).then(function(data) {
                deferred.resolve(data);

            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.sendOWSMsgAsMail = function(params) {
            var deferred = $q.defer(),
                url = '/api/reservation_guest_messages/email_message.json';

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

        this.sendRegistrationByEmail = function(data) { // to get terms & conditions
            var deferred = $q.defer();
            var id = data.id;
            var url = '/api/reservations/' + id + '/email_registration_card';
            var params = {
                'application': data.application
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
            // params['reservation_id'] = some id...
            var deferred = $q.defer(),
                url = '/guest/reservations/assign_room';

            zsBaseWebSrv.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchReservationBalanceDetails = function(params) {

            var deferred = $q.defer(),
                url = '/zest_station/reservations/' + params.reservation_id,
                param = {
                    'nationality_id': params.nationality_id
                };

            zsBaseWebSrv2.getJSON(url, param).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchUpsellDetails = function(reservation) {
            var params = {
                    set_arrival_time_to_current_time: true
                },
                deferred = $q.defer(),
                url = '/guest_web/reservations/' + reservation.id + '.json';

            zsBaseWebSrv.getJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        this.fetchStarTacPrinterData = function(params) {
            var deferred = $q.defer(),
                url = '/api/reservations/' + params.reservation_id + '/bill_print_data?is_checkout=false';

            zsBaseWebSrv.getJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchHotelTime = function(params) {

            var deferred = $q.defer(),
                url = '/guest_web/home/fetch_hotel_time.json?reservation_id=' + params.reservation_id;

            zsBaseWebSrv.getJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        this.fetchRoomUpsellDetails = function(param) {
            var deferred = $q.defer(),
                url =  '/zest_station/upgrade_options.json';

            zsBaseWebSrv2.getJSON(url, param).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fethHotelRooms = function(params) {
            var deferred = $q.defer();
            var url =  '/staff/rooms/get_rooms';

            zsBaseWebSrv2.postJSON(url,params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.selectRoomUpgrade = function(param) {
            var deferred = $q.defer();
            var url =  '/staff/reservations/upgrade_room.json';

            param.is_kiosk = true;
            zsBaseWebSrv2.postJSON(url, param).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
                return deferred.promise;
        };

        this.fetchAddons = function(param) {
            var deferred = $q.defer();
            var url = '/api/upsell_addons';
            var params = {
                'for_zest_station': true,
                'reservation_id': param.reservation_id,
                'application': 'KIOSK'
            };

            zsBaseWebSrv.getJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.updateAddon = function(params) {

            var deferred = $q.defer();
            var url = '/api/reservations/update_package';

            var data = params;

            data.application =  'KIOSK';

            zsBaseWebSrv.postJSON(url, data).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.deleteAddon = function(params) {
            var deferred = $q.defer();
            var url = '/api/reservations/delete_package';
            var data = params;

            data.application =  'KIOSK';
            
            zsBaseWebSrv.postJSON(url, data).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchHotelAddonLabels = function(param) {
            var deferred = $q.defer();
            var url = '/api/upsell_addons_setups';

            zsBaseWebSrv.getJSON(url, param).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchRoomUpsellAvailability = function(param) {
            var deferred = $q.defer();
            var url = '/api/reservations/' + param.id + '/upsell_availability';

            zsBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        this.acceptPassport = function(params) {
            // TODO: Update to match API spec once API part is in progress/done
            var deferred = $q.defer();
            var url = '/api/acceptPassport';
            param.is_kiosk = true;

            var data = params;

            data.application =  'KIOSK';
            
            zsBaseWebSrv.postJSON(url, data).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };



    }
]);
