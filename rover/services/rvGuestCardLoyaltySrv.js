angular.module('sntRover').service('RVGuestCardLoyaltySrv', ['$q', 'RVBaseWebSrv', 'RVCompanyCardSrv',
    function ($q, RVBaseWebSrv, RVCompanyCardSrv) {

        var service = this,
            loyalties = {};

        service.fetchUserMemberships = function (userId) {
            var deferred = $q.defer(),
                url = '/staff/user_memberships.json?user_id=' + userId;

            RVBaseWebSrv.getJSON(url).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });

            return deferred.promise;
        };

        service.fetchLoyalties = function (param) {
            var deferred = $q.defer(),
                promises = [];

            promises.push(RVCompanyCardSrv.fetchHotelLoyaltiesHlps().then(function (response) {
                loyalties.hotelLoyaltyData = response.data;
            }));
            promises.push(RVCompanyCardSrv.fetchHotelLoyaltiesFfp().then(function (response) {
                loyalties.freaquentLoyaltyData = response.data;
            }));
            if (param.userID) {
                promises.push(service.fetchUserMemberships(param.userID).then(function (response) {
                    loyalties.userMemberships = response;
                }));
            }

            $q.all(promises).then(function () {
                deferred.resolve(loyalties);
            }, function (errorMessage) {
                deferred.reject(errorMessage);
            });

            return deferred.promise;
        };

        service.createLoyalties = function (params) {
            var deferred = $q.defer();
            var url = '/staff/user_memberships';

            RVBaseWebSrv.postJSON(url, params).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        service.deleteLoyalty = function (id) {
            var deferred = $q.defer();
            var url = '/staff/user_memberships/' + id + '.json';

            RVBaseWebSrv.deleteJSON(url, '').then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
    }
]);