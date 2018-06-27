angular.module('sntRover').service('RVHotelDetailsSrv', ['$q', 'rvBaseWebSrvV2', '$log',
    function ($q, RVBaseWebSrvV2, $log) {
        var service = this,
            business_date = null,
            workstationInfo = null;

        service.hotelDetails = {};


        service.fetchUserHotels = function () {
            var deferred = $q.defer();
            var url = '/api/current_user_hotels';

            RVBaseWebSrvV2.getJSON(url).then(function (data) {
                _.extend(service.hotelDetails, {
                    userHotelsData: data
                });
                deferred.resolve(data);
            }, function (errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };

        service.fetchHotelBusinessDate = function () {
            var deferred = $q.defer();
            var url = '/api/business_dates/active';

            RVBaseWebSrvV2.getJSON(url).then(function (data) {
                _.extend(service.hotelDetails, {
                    business_date: data.business_date
                });
                business_date = data.business_date;
                deferred.resolve(data);
            }, function (errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };

        service.fetchHotelSettings = function () {
            var deferred = $q.defer();
            var url = '/api/hotel_settings.json';

            RVBaseWebSrvV2.getJSON(url).then(function (data) {
                data.is_auto_change_bussiness_date = data.business_date.is_auto_change_bussiness_date;
                _.extend(service.hotelDetails, data);
                deferred.resolve(data);
            }, function (errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };

        service.fetchHotelDetails = function () {
            var deferred = $q.defer(),
                promises = [service.fetchUserHotels(), service.fetchHotelBusinessDate(), service.fetchHotelSettings()];

            $q.all(promises).then(function () {
                // look this.fetchHotelBusinessDate
                // since api/hotelsettings.json is returing a business date key and service is not the buiness date :(
                service.hotelDetails.business_date = business_date;

                deferred.resolve(service.hotelDetails);
            }, function (errorMessage) {
                deferred.reject(errorMessage);
            });

            return deferred.promise;
        };

        service.getDefaultUUID = function () {
            var deferred = $q.defer();
            var url = '/api/current_user_hotels';

            RVBaseWebSrvV2.getJSON(url).then(function (data) {
                var hotels = data['hotel_list'];

                if (hotels.length > 0) {
                    deferred.resolve(hotels[0].hotel_uuid);
                } else {
                    deferred.resolve(null);
                }
            }, function (errorMessage) {
                deferred.reject(errorMessage);
            });

            return deferred.promise;
        };

        service.storeWorkstationInfo = function (workStationDetails) {
            workstationInfo = workStationDetails;
        };

        service.isActiveMLIEMV = function () {
            if (!service.hotelDetails || !workstationInfo) {
                $log.warn('Hotel settings information not available...');
                return false;
            }

            return (service.hotelDetails['payment_gateway'] === 'MLI' &&
                service.hotelDetails['mli_emv_enabled'] &&
                workstationInfo.emv_terminal_id) || service.hotelDetails['payment_gateway'] === 'sixpayments';
        };
        /*
         * fetch infrasec details of the logged in hotel
         */
        service.fetchInfrasecDetails = function () {
            var deferred = $q.defer();
            var url = '/api/hotels/workstation_infrasec_details';

            RVBaseWebSrvV2.getJSON(url).then(function (data) {
                    deferred.resolve(data);
            }, function (errorMessage) {
                deferred.reject(errorMessage);
            });

            return deferred.promise;
        };
        /*
         * To fetch tax exempts
         */
        service.fetchTaxExempts = function () {
            var deferred = $q.defer(),
                url = 'api/tax_exempt_types?page=1&per_page=1000';

            RVBaseWebSrvV2.getJSON(url).then(function (data) {
                    deferred.resolve(data);
            }, function (errorMessage) {
                deferred.reject(errorMessage);
            });

            return deferred.promise;
        };

    }]
);
