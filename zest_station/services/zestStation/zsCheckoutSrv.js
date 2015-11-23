/**
 * Service used for tablet-kiosk UI (Zest Station)
 */

sntZestStation.service('zsCheckoutSrv',
        ['$http', '$q', 'zsBaseWebSrv','zsBaseWebSrv2',
            function ($http, $q, zsBaseWebSrv,zsBaseWebSrv2) {


                 // fetch reservations
                this.findReservation = function (params) {
                    var deferred = $q.defer(),
                            url = '/zest_station/search';

                    zsBaseWebSrv2.getJSON(url, params).then(function (data) {
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };

                 // fetch reservations
                this.fetchBillDetails = function (params) {
                    var deferred = $q.defer(),
                            url = 'guest_web/home/bill_details.json?reservation_id=' + params.reservation_id;
                    zsBaseWebSrv2.getJSON(url).then(function (data) {
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };

                 // save email to the reservation
                this.saveEmail = function (params) {
                    var deferred = $q.defer(),
                            url = 'staff/guest_cards/' + params.guest_detail_id;
                    var param = {"email":params.email}
                    zsBaseWebSrv2.putJSON(url,param).then(function (data) {
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };

                // save email to the reservation
                this.checkoutGuest = function (params) {
                    var deferred = $q.defer(),
                            url = '/staff/checkout';
                    zsBaseWebSrv2.postJSON(url,params).then(function (data) {
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };

 }]);