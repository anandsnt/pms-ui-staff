angular.module('sntRover').service('RVNightlyDiarySrv',
    ['$q',
    'BaseWebSrvV2',
    function($q, BaseWebSrvV2) {

        var that = this;

        this.updateCache = function(data) {
            that.searchParamsCached = data;
        };
        this.getCache = function() {
            return that.searchParamsCached;
        };
        this.clearCache = function() {
            that.searchParamsCached = {};
        };

        /*
         * To fetch the rooms list
         * @param {data} object
         * return object
         */
        this.fetchRoomsList = function (data) {

            var deferred = $q.defer(),
                url = '/api/nightly_diary/room_list';

            BaseWebSrvV2.postJSON(url, data).then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        /*
         * Service function to fetch date list
         * UI calculations to check the date is weekend or not.
         * Creating new array of objects with 'isWeekend' flag.
         * @return {Array} dates
         */
        this.fetchDatesList = function (data) {
            var deferred = $q.defer(), dateArray = [];
            var url = '/api/nightly_diary/date_list';

            BaseWebSrvV2.getJSON(url, data).then(function(response) {
                angular.forEach(response.dates, function(item) {
                    var dateObj = tzIndependentDate(item);
                    var isWeekend = (dateObj.getDay() === 0 || dateObj.getDay() === 6) ? true : false;
                    var itemObj = {
                        'date': item,
                        'isWeekend': isWeekend
                    };

                    dateArray.push(itemObj);
                });
                deferred.resolve(dateArray);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };
        /*
         * To fetch the reservations list
         * @param {data} object
         * return object
         */
        this.fetchReservationsList = function(data) {
            that.updateCache(data);
            var deferred = $q.defer();
            var url = '/api/nightly_diary/reservation_list';

            BaseWebSrvV2.postJSON(url, data).then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };
        /*
         * To check room is available between dates
         * @param {data} object
         * return object
         */

        this.checkUpdateAvaibale = function (data) {
            var url = '/staff/change_stay_dates/' + data.reservation_id + '/update.json';

            var params = {
                'arrival_date': data.arrival_date,
                'dep_date': data.dep_date
            };
            var deferred = $q.defer ();

            BaseWebSrvV2.getJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };

        /*
         * updating the reservation
         * @param {data} object
         * return object
         */
        this.confirmUpdates = function(data) {
            var url = '/staff/change_stay_dates/' + data.reservation_id + '/confirm';

            var postData = {
                "arrival_date": data.arrival_date,
                "dep_date": data.dep_date
            };
            var deferred = $q.defer ();

            BaseWebSrvV2.postJSON(url, postData).then(function(data) {
                deferred.resolve(data);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;

        };

        this.fetchRoomsListAndReservationList = function(params) {
            var deferred = $q.defer(),
                promises = [],
                data = {
                    roomList: null,
                    reservationList: null,
                    dateList: null
                };

            promises.push(that.fetchRoomsList(params).then(function(response) {
                data.roomList = response;
            }));
            promises.push(that.fetchReservationsList(params).then(function(response) {
                data.reservationList = response;
            }));
            promises.push(that.fetchDatesList(params).then(function(response) {
                data.dateList = response;
            }));

            $q.all(promises).then(function() {
                deferred.resolve(data);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;

        };
    }]);