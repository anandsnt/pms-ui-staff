/**
 * Service used for tablet-kiosk UI
 */

sntRover.service('rvTabletSrv',
        ['$http', '$q', 'rvBaseWebSrvV2',
            function ($http, $q, rvBaseWebSrvV2) {
                 // fetch idle time settings
                this.fetchSettings = function () {
                    var deferred = $q.defer(),
                            url = '/api/hotel_settings/kiosk'+localStorage['kioskUser'];

                    rvBaseWebSrvV2.getJSON(url).then(function (data) {
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };
                this.fetchReservationDetails = function (param) {
                    var deferred = $q.defer(),
                            url = '/staff/staycards/reservation_details.json?reservation='+param.id;//+localStorage['kioskUser'];
                    

                    rvBaseWebSrvV2.getJSON(url).then(function (data) {
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };
                
                this.fetchReservations = function (param) {
                    var filter = '';
                    if (param.last_name){
                         filter = '?last_name='+param.last_name;
                    }
                    if (param.find_by !='' && param.last_name !=''){
                        filter += '&'+param.find_by+'='+param.value;//+localStorage['kioskUser'];
                    }
                    var deferred = $q.defer(),
                            url = '/api/reservations'+filter;
                        /*
                         * confirmation_number
                            departure_date
                            email
                            last_name
                            credit_card_last_4
                         */
                    

                    rvBaseWebSrvV2.getJSON(url).then(function (data) {
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };
                
                
                this.saveSettings = function (params) {
                    var deferred = $q.defer(),
                            url = '/api/hotel_settings/change_settings'+localStorage['kioskUser'];

                    rvBaseWebSrvV2.postJSON(url, params).then(function (data) {
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };
                
                
                
                

            }]);