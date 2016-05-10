/**
 * Service used for tablet-kiosk UI (Zest Station)
 */

sntZestStation.service('zsGeneralSrv', ['$http', '$q', 'zsBaseWebSrv', 'zsBaseWebSrv2',
    function($http, $q, zsBaseWebSrv, zsBaseWebSrv2) {
        var that = this;

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

        this.encodeKey = function(params) {
            var deferred = $q.defer(),
                url = '/staff/reservation/print_key';

            zsBaseWebSrv2.postJSON(url, params).then(function(data) {
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



        this.fetchReservationDetails = function(param) {
            var url = '/staff/staycards/reservation_details.json?reservation_id=' + param.reservation_id;
            var deferred = $q.defer();

            zsBaseWebSrv2.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.ValidateEmail = function(email) {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                return false;
            } else return true;
        };

        this.isValidEmail = function(email) {
            if (email === '') {
                return false;
            };
            email = email.replace(/\s+/g, '');
            if (that.ValidateEmail(email)) {
                return false;
            } else return true;

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


        this.fetchCountryList = function() {
            var deferred = $q.defer(),
                url = '/ui/country_list.json';
            zsBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        this.fetchHotelTime = function() {
            var deferred = $q.defer(),
                url = '/api/hotel_current_time.json';
            zsBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.updateGuestEmail = function(params) {
            var deferred = $q.defer(),
                url = '/staff/guest_cards/' + params.guest_id;

            zsBaseWebSrv.putJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        //This data supposed to be handled in back end.
        //TODO : Move to api
        this.returnLanguageList = function() {
            return [ //in our admin/API, these are saved in english, we will keep reference here if needed
                {
                    'name': 'Castellano',
                    'info': {
                        'prefix': '',
                        'code': 'cl',
                        'flag': 'flag-ca',
                    'language': 'Castellano'
                         //using name as an english reference (which is in the api call)
                    }
                }, {
                    'name': 'German',
                    'info': {
                        'prefix': '',
                        'code': 'de',
                        'flag': 'flag-de',
                        'language': 'Deutsche'
                    }
                }, {
                    'name': 'English',
                    'info': {
                        'prefix': 'EN',
                        'code': 'en',
                        'flag': 'flag-gb',
                        'language': 'English'
                    }
                }, {
                    'name': 'Spanish',
                    'info': {
                        'prefix': 'ES',
                        'code': 'es',
                        'flag': 'flag-es',
                        'language': 'Español'
                    }
                }, {
                    'name': 'French',
                    'info': {
                        'prefix': 'FR',
                        'code': 'fr',
                        'flag': 'flag-fr',
                        'language': 'Français'
                    }
                }, {
                    'name': 'Italian',
                    'info': {
                        'prefix': '',
                        'code': 'it',
                        'flag': 'flag-it',
                        'language': 'Italiano'
                    }
                }, {
                    'name': 'Netherlands',
                    'info': {
                        'prefix': 'NL',
                        'code': 'nl',
                        'flag': 'flag-nl',
                        'language': 'Nederlands'
                    }
                }
            ];
        }

    }
]);