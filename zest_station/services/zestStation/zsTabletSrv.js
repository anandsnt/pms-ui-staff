/**
 * Service used for tablet-kiosk UI (Zest Station)
 */

sntZestStation.service('zsTabletSrv',
        ['$http', '$q', 'zsBaseWebSrv',
            function ($http, $q, zsBaseWebSrv) {
                 // fetch idle time settings
                this.fetchSettings = function () {
                    var deferred = $q.defer(),
                            url = '/api/hotel_settings/kiosk';

                    zsBaseWebSrv.getJSON(url).then(function (data) {
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };


                
                this.fetchEncoders = function () {
                    var params = {
                        page: 1,
                        per_page: 100
                    };
                    var deferred = $q.defer(),
                            url = '/api/key_encoders';
                    
                    zsBaseWebSrv.getJSON(url, params).then(function (data) {
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };
                
                this.encodeKey = function (params) {
                    var deferred = $q.defer(),
                            url = '/staff/reservation/print_key';
                    
                    zsBaseWebSrv.postJSON(url, params).then(function (data) {
                        deferred.resolve(data);
                    }, function (data) {
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
                
                
                
                this.fetchHotelSettings = function () {//to get terms & conditions
                    var deferred = $q.defer();
                    var url = '/api/hotel_settings.json';

                    zsBaseWebSrv.getJSON(url).then(function (data) {
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };
                
                
                this.printRegistration = function (data) {//to get terms & conditions
                    var deferred = $q.defer();
                    var id= data.id;
                    var url = '/api/reservations/'+id+'/print_registration_card';
                    zsBaseWebSrv.getJSON(url).then(function (data) {
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };
                
                this.sendRegistrationByEmail = function (data) {//to get terms & conditions
                    var deferred = $q.defer();
                    var id= data.id;
                    var url = '/api/reservations/'+id+'/email_registration_card';

                    zsBaseWebSrv.getJSON(url).then(function (data) {
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };
                
                
                this.fetchReservationDetails = function (param) {
                    var deferred = $q.defer(),
                            url = '/staff/staycards/reservation_details.json?reservation='+param.id;
                    

                    zsBaseWebSrv.getJSON(url).then(function (data) {
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };
                
                
                this.fetchAddonDetails = function (param) {
                    var deferred = $q.defer(),
                            url = '/staff/staycards/reservation_addons?reservation_id='+param.id;

                    zsBaseWebSrv.getJSON(url).then(function (data) {
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };
                
                this.fetchReservations = function (params) {
                    var deferred    = $q.defer(),
                        url         = '/api/reservations';

                    zsBaseWebSrv.getJSON(url, params).then(function (data) {
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };
                
                
                this.fetchWorkStations = function(params){
                        var deferred = $q.defer();
                        var url = '/api/workstations.json';

                        zsBaseWebSrv.getJSON(url, params).then(function (data) {
                            deferred.resolve(data);
                        },function(data){
                            deferred.reject(data);
                        });
                        return deferred.promise;
                };
                
                this.updateWorkStations = function (params) {
                    var deferred = $q.defer(),
                         url = '/api/workstations/'+params.id;

                    zsBaseWebSrv.putJSON(url, params).then(function (data) {
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };
                
                
                this.checkInGuest = function (params) {
                    var deferred = $q.defer(),
                            url = '/staff/checkin';

                    zsBaseWebSrv.postJSON(url, params).then(function (data) {
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };
                
                this.saveSettings = function (params) {
                    var deferred = $q.defer(),
                            url = '/api/hotel_settings/change_settings';

                    zsBaseWebSrv.postJSON(url, params).then(function (data) {
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };
                
                this.updateWorkStationMapping = function(data){
                    var deferred = $q.defer();
                    var url = '/api/workstations/'+data.id;

                    zsBaseWebSrv.putJSON(url, data).then(function(data) {
                        deferred.resolve(data);
                    },function(data){
                        deferred.reject(data);
                    });
		return deferred.promise;
                };
                
                this.fetchRegistrationCardPrintData = function(params){
                    var deferred = $q.defer();
                    var url = '/api/reservations/' + params.id + '/print_registration_card';
                            zsBaseWebSrv.getJSON(url).then(function(data) {
                                    deferred.resolve(data);
                            },function(data){
                                deferred.reject(data);
                            });

                    return deferred.promise;
            };
                
            }]);