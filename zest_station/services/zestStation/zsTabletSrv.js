/**
 * Service used for tablet-kiosk UI (Zest Station)
 */

sntZestStation.service('zsTabletSrv', ['$http', '$q', 'zsBaseWebSrv','zsBaseWebSrv2',
    function($http, $q, zsBaseWebSrv,zsBaseWebSrv2) {
        // fetch idle time settings
        this.fetchSettings = function() {
            var deferred = $q.defer(),
                url = '/api/hotel_settings/kiosk';

            zsBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };



        this.fetchEncoders = function() {
            var params = {
                page: 1,
                per_page: 100
            };
            var deferred = $q.defer(),
                url = '/api/key_encoders';

            zsBaseWebSrv.getJSON(url, params).then(function(data) {
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
        this.updateReservationArrivalTime = function(params) {
            var deferred = $q.defer(),
                url = 'api/reservations/' + params.reservation_id + '/update_stay_details';

            zsBaseWebSrv.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        
        this.getDoorLockSettings = function() {
            var deferred = $q.defer(),
                url = 'api/door_lock_interfaces.json';

            zsBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        this.getAccessToken = function(params) {
            /*params:
             * reservation_id
             * application || web
             */
            var deferred = $q.defer(),
                url = '/guest_web/get_station_guest_auth_token';

            zsBaseWebSrv.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        this.encodeKey = function(params) {
            var deferred = $q.defer(),
                url = '/staff/reservation/print_key';

            zsBaseWebSrv.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        this.saveUIDtoRes = function(params) {
            var deferred = $q.defer(),
                url = '/api/reservations/update_key_uid';

            zsBaseWebSrv.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        this.validate = function(params) {
            var deferred = $q.defer(),
                url = 'api/users/check_if_admin';

            zsBaseWebSrv.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        /**
         * function to get business date
         * @return {Promise} - After resolving it will return the business date
         */
        this.fetchHotelBusinessDate = function() {
            var deferred = $q.defer(),
                url = '/api/business_dates/active';

            zsBaseWebSrv.getJSON(url).then(
                function(data) {
                    deferred.resolve(data);
                },
                function(errorMessage) {
                    deferred.reject(errorMessage);
                }
            );

            return deferred.promise;
        };



        this.fetchHotelSettings = function() { //to get terms & conditions
            var deferred = $q.defer();
            var url = '/api/hotel_settings.json';

            zsBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        this.printRegistration = function(data) { //to get terms & conditions
            var deferred = $q.defer();
            var id = data.id;
            var url = '/api/reservations/' + id + '/print_registration_card';
            zsBaseWebSrv.getJSON(url).then(function(data) {
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


        this.fetchReservationDetails = function(param) {
            var url;
            if (param.by_reservation_id){
                 url = '/staff/staycards/reservation_details.json?reservation_id=' + param.id;
            } else {
                 url = '/staff/staycards/reservation_details.json?reservation=' + param.id;
            }
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


        this.fetchWorkStations = function(params) {
            var deferred = $q.defer();
            var url = '/api/workstations.json';

            zsBaseWebSrv.getJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        this.fetchWorkStationStatus = function(params) {
            var deferred = $q.defer();
            var url = '/api/workstations/' + params.id + '/status';

            zsBaseWebSrv.getJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.updateWorkStations = function(params) {
            var deferred = $q.defer(),
                url = '/api/workstations/' + params.id;

            zsBaseWebSrv.putJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.updateWorkStationOos = function(params){
            var deferred = $q.defer(),
                url = 'api/workstations/'+ params.id+'/set_out_or_order.json';

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


        this.updateGuestEmail = function(params) {
            var deferred = $q.defer(),
                url = '/staff/guest_cards/' + params.id;

            zsBaseWebSrv.putJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };



        this.saveSettings = function(params) {
            var deferred = $q.defer(),
                url = '/api/hotel_settings/change_settings';

            zsBaseWebSrv.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.updateWorkStationMapping = function(data) {
            var deferred = $q.defer();
            var url = '/api/workstations/' + data.id;

            zsBaseWebSrv.putJSON(url, data).then(function(data) {
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

        this.fetchRegistrationHotelSetting = function() {
            var deferred = $q.defer();
            var url = '/api/hotel_settings/show_hotel_reservation_settings';
            zsBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });

            return deferred.promise;
        };
        this.fetchGuestDetails = function(params) {
            var deferred = $q.defer();
            var url = '/api/reservations/' + params.id + '/reservations_guest_details';
            zsBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });

            return deferred.promise;
        };

        this.fetchHotelTheme = function(params) {
            var deferred = $q.defer();
            var url = '/api/email_templates/list.json?hotel_id=' + params.id;
            zsBaseWebSrv.getJSON(url).then(function(data) {
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


        this.fetchOwsMessage = function(params){

            var deferred = $q.defer();
            var url = '/api/reservation_guest_messages/' + params.reservation_id+'.json';
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
        this.setSessionWorkstation = function(params) {
            /* console.info('expecting',{
                    "is_workstation_present":true,
                    "id":296,
                    "name":"Right",
                    "station_identifier":"999",
                    "printer":null,
                    "key_encoder_id":17,
                    "emv_terminal_id":5,
                    "rover_device_id":"DEFAULT"// <-- This is the parameter in the request. You can find it on worstation list api
                });
            */
                
            var deferred = $q.defer();
            var url = 'api/workstations/set_workstation';
        
            zsBaseWebSrv.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        
        
        this.updateGuestTabDetails = function(data) {
            var deferred = $q.defer();
            var url = '/api/reservations/'+data.reservation_id+'/reservations_guest_details';
            zsBaseWebSrv2.postJSON(url, data).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        

    }
]);