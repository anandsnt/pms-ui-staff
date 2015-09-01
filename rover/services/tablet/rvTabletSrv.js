/**
 * Service used for tablet-kiosk UI
 */

sntRover.service('rvTabletSrv',
        ['$http', '$q', 'rvBaseWebSrvV2',
            function ($http, $q, rvBaseWebSrvV2) {
                 // fetch idle time settings
                this.fetchSettings = function () {
                    var deferred = $q.defer(),
                            url = '/api/hotel_settings/kiosk';

                    rvBaseWebSrvV2.getJSON(url).then(function (data) {
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };
                
                this.fetchReservations = function (data) {
                    var deferred = $q.defer(),
                            url = '/api/reservations';
                        /*
                         * confirmation_number
                            departure_date
                            email
                            last_name
                            credit_card_last_4
                         */
                    

                    rvBaseWebSrvV2.getJSON(url, data).then(function (data) {
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };
                
                
                this.saveSettings = function (params) {
                    var deferred = $q.defer(),
                            url = '/api/hotel_settings/change_settings';

                    rvBaseWebSrvV2.postJSON(url, params).then(function (data) {
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };
                
                
                
                

            }]);