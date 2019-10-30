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
            var url = '/staff/bills/print_guest_bill';

            zsBaseWebSrv.postJSON(url, params).then(function(prindata) {
                var response = prindata.data;
                // Manually creating charge details list & credit deatils list.

                response.charge_details_list = [];
                response.credit_details_list = [];
                response.full_charge_details_list = [];

                angular.forEach(response.fee_details, function(fees, index1) {
                    angular.forEach(fees.charge_details, function(charge, index2) {
                        charge.date = fees.date;
                        charge.date_in_day_month = fees.date_in_day_month;
                        charge.is_charge_details = true;
                        response.charge_details_list.push(charge);
                        response.full_charge_details_list.push(charge);
                    });
                    angular.forEach(fees.credit_details, function(credit, index3) {
                        credit.date = fees.date;
                        credit.date_in_day_month = fees.date_in_day_month;
                        credit.is_charge_details = false;
                        response.credit_details_list.push(credit);
                        response.full_charge_details_list.push(credit);
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
                url = '/guest_web/home/bill_details.json?reservation_id=' + params.reservation_id;

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
                url = '/staff/guest_cards/' + params.guest_detail_id;
            var param = {
                "email": params.email
            };

            zsBaseWebSrv2.putJSON(url, param).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        // save email to the reservation
        this.checkoutGuest = function(params) {
            if (params) {
                params['application'] = 'KIOSK';
            }
            console.info('params: ', params);
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
            // CICO-71659 - we should sent to API as encoded string only
            if (params['keydata_ilco_34']) {
               params['keydata_ilco_34'] = encodeURIComponent(params['keydata_ilco_34']);
            }

            zsBaseWebSrv.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchStarTacPrinterData = function(params) {
            var deferred = $q.defer();
            var url = '/api/reservations/' + params.reservation_id + '/bill_print_data?is_checkout=true';

            zsBaseWebSrv.getJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchBillPlaceholderData = function(params) {
            var deferred = $q.defer(),
                url = '/sample_json/zest_station/checkout_bill.json';

            zsBaseWebSrv.getJSON(url, params).then(function(data) {
                deferred.resolve(data);

            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.validateCC = function(params) {
            var deferred = $q.defer(),
                url = 'guest/reservations/' + params.id + '/validate_cc';

            zsBaseWebSrv2.getJSON(url, params).then(function(data) {
                deferred.resolve(data);

            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        /*
        * Service function to get groups
        * @method GET
        * @return {object} defer promise
        */
        this.fetchChargeGroups = function () {

            var deferred = $q.defer();
            var url = "/api/charge_groups.json";

            zsBaseWebSrv.getJSON(url).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        /*
        * Service function to get items
        * @method GET
        * @param {object} data
        * @return {object} defer promise
        */
        this.fetchChargeItems = function (params) {
            var deferred = $q.defer();
            var url = "/api/charge_codes/items_and_charge_codes.json";

            zsBaseWebSrv.getJSON(url, params).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        /*
		* Service function to post charge
		* @method POST
		* @param {object} data
		* @return {object} defer promise
		*/
        this.postCharges = function (params) {
            var deferred = $q.defer();
            var url = '/staff/items/post_items_to_bill?application=KIOSK';

            zsBaseWebSrv.postJSON(url, params)
                .then(function (data) {
                    deferred.resolve(data);
                }, function (data) {
                    deferred.reject(data);
                });

            return deferred.promise;
        };
    }
]);