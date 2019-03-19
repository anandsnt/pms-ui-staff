angular.module('sntRover').service('RVNightlyDiarySrv',
    ['$q',
    'BaseWebSrvV2',
    '$rootScope',
    function($q, BaseWebSrvV2, $rootScope) {

        var that = this;

        this.updateCache = function(data) {
            that.searchParamsCached = data;
        };
        this.getCache = function() {
            return that.searchParamsCached;
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

            var paramsToApi = {};

            paramsToApi.start_date = data.start_date;
            paramsToApi.no_of_days = data.no_of_days;

            BaseWebSrvV2.getJSON(url, paramsToApi).then(function(response) {
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

            var paramsToApi = {};

            paramsToApi.start_date = data.start_date;
            paramsToApi.no_of_days = data.no_of_days;
            paramsToApi.page = data.page;
            paramsToApi.per_page = data.per_page;
            paramsToApi.selected_room_type_ids = data.selected_room_type_ids;
            paramsToApi.selected_floor_ids = data.selected_floor_ids;

            BaseWebSrvV2.postJSON(url, paramsToApi).then(function(response) {
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
         * To check room is available between dates
         * @param {data} object
         * return object
         */
        this.validateStayChanges = function (params) {
            var url = '/api/nightly_diary/validate_stay_change',
                deferred = $q.defer ();

            BaseWebSrvV2.getJSON(url, params).then(function(data) {
                deferred.resolve(data.result);
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
                'arrival_date': data.arrival_date,
                'dep_date': data.dep_date,
                'room_number': data.room_number
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
                data = {
                    roomList: null,
                    reservationList: null,
                    dateList: null
                };

            $q.when().then(function() {
                return that.fetchRoomsList(params).then(function(response) {
                    data.roomList = response;
                });
            })
            .then(function() {                 
                params.page = data.roomList.page_number;
                return that.fetchReservationsList(params).then(function(response) {
                    data.reservationList = response;
                });
            })
            .then(function() {
                return that.fetchDatesList(params).then(function(response) {
                    data.dateList = response;
                });
            })
            .then(function() {
                deferred.resolve(data);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });

            return deferred.promise;
        };

        /*
         * Fetch unassigned reservation lists
         * @param {data} object
         * return object
         */
        this.fetchUnassignedReservationList = function(params) {
            var deferred = $q.defer(),
                url = '/api/nightly_diary/unassigned_reservations',
                businessDate = $rootScope.businessDate;

            BaseWebSrvV2.getJSON(url, params).then(function(data) {
                angular.forEach(data.reservations, function(item) {
                    item.statusClass = item.arrival_date === businessDate ? 'check-in' : 'no-status';
                });
                deferred.resolve(data);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        /*
         * Fetch Available Rooms
         * @param {data} object
         * return object
         */
        this.retrieveAvailableRooms = function(params) {
            var deferred = $q.defer(),
                url = '/api/nightly_diary/retrieve_available_rooms';

            BaseWebSrvV2.postJSON(url, params).then(function(data) {
                deferred.resolve(data.data);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        /*
         * Fetch Available free slots for booking reservation
         * @param {data} object
         * return object
         */
        this.retrieveAvailableFreeSlots = function(params) {
            var deferred = $q.defer(),
                url = '/api/nightly_diary/availability';

            BaseWebSrvV2.postJSON(url, params).then(function(data) {
                deferred.resolve(data.rooms);
                }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        /*
         * Assign Room in Diary
         * @param {data} object
         * return object
         */
        this.assignRoom = function(params) {
            var deferred = $q.defer(),
                url = '/staff/reservation/modify_reservation';

            BaseWebSrvV2.postJSON(url, params).then(function(data) {
                deferred.resolve(data.data);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        /*
         * Assign Room in Diary
         * @param {data} object
         * return object
         */
        this.fetchAvailableTimeSlots = function(params) {
            var deferred = $q.defer(),
                url = '/api/nightly_diary/available_time_slots';

            BaseWebSrvV2.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };
    }
]);
