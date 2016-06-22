/**
 * Service used for tablet-kiosk UI (Zest Station)
 */

sntZestStation.service('zsCheckoutSrv', ['$http', '$q', 'zsBaseWebSrv', 'zsBaseWebSrv2',
    function($http, $q, zsBaseWebSrv, zsBaseWebSrv2) {


        // fetch reservations
        this.findReservation = function(params) {
            var deferred = $q.defer(),
                url = '/zest_station/search';

            zsBaseWebSrv2.getJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchBillPrintData = function(params) {
            var deferred = $q.defer();
            var url = 'staff/bills/print_guest_bill';
            zsBaseWebSrv.postJSON(url, params).then(function(prindata) {
                var response = prindata.data;
                // Manually creating charge details list & credit deatils list.
                response.charge_details_list = [];
                response.credit_details_list = [];
                angular.forEach(response.fee_details, function(fees, index1) {
                    angular.forEach(fees.charge_details, function(charge, index2) {
                        charge.date = fees.date;
                        response.charge_details_list.push(charge);
                    });
                    angular.forEach(fees.credit_details, function(credit, index3) {
                        credit.date = fees.date;
                        response.credit_details_list.push(credit);
                    });
                });
                deferred.resolve(response);
            }, function(data) {
                deferred.reject(data);
            });

            return deferred.promise;
        };

        // fetch reservations
        this.fetchBillDetails = function(params) {
            var deferred = $q.defer(),
                url = 'guest_web/home/bill_details.json?reservation_id=' + params.reservation_id;
            zsBaseWebSrv2.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        // save email to the reservation
        this.saveEmail = function(params) {
            var deferred = $q.defer(),
                url = 'staff/guest_cards/' + params.guest_detail_id;
            var param = {
                "email": params.email
            }
            zsBaseWebSrv2.putJSON(url, param).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        // save email to the reservation
        this.checkoutGuest = function(params) {
            if (params){
                params['application'] = 'KIOSK';
            }
            console.info('params: ',params);
            var deferred = $q.defer(),
                url = '/guest_web/home/checkout_guest.json';
            zsBaseWebSrv2.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        // send email
        this.sendBill = function(params) {
            var deferred = $q.defer(),
                url = '/api/reservations/email_guest_bill.json';
            zsBaseWebSrv.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        this.fetchReservationFromUId = function(params) {
            var deferred = $q.defer();
            var url = '/api/reservations/find_by_key_uid';
            zsBaseWebSrv.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

    }
]);