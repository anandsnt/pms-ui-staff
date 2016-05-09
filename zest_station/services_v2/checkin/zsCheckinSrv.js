/**
 * Service used for tablet-kiosk UI (Zest Station)
 */

sntZestStation.service('zsCheckinSrv', ['$http', '$q', 'zsBaseWebSrv', 'zsBaseWebSrv2',
    function($http, $q, zsBaseWebSrv, zsBaseWebSrv2) {

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

    }
]);