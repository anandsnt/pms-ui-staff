/**
 * Service used for tablet-kiosk UI (Zest Station)
 */

sntZestStation.service('zsCheckinSrv', ['$http', '$q', 'zsBaseWebSrv', 'zsBaseWebSrv2',
    function($http, $q, zsBaseWebSrv, zsBaseWebSrv2) {

        var that = this;
        this.checkInReservations =[];
        this.setCheckInReservations = function(data){
            that.checkInReservations = [];
            that.checkInReservations = data;
        };

        this.getCheckInReservations = function(){
            return that.checkInReservations;
        };
        this.selectedCheckInReservation =[];
        this.setSelectedCheckInReservations = function(data){
            that.selectedCheckInReservation = [];
            that.selectedCheckInReservation = data[0];
        };

        this.getSelectedCheckInReservations = function(){
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

    }
]);