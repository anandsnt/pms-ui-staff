angular.module('sntRover').service('RVNightlyDiarySrv',
    ['$q',
    'BaseWebSrvV2',
    function($q, BaseWebSrvV2) {
     var that = this;   
    /*
     * Service function to fetch room list.
     * @return {Object} room list.
     */
    this.fetchRoomsList = function (data) {
        var deferred = $q.defer(),
            url = '/api/nightly_diary/room_list';

        BaseWebSrvV2.getJSON(url, data).then(function(response) {
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

    this.fetchRoomsListAndReservationList = function(params){
        var deferred = $q.defer(),
            promises = [],
            data = {
                roomList: null,
                reservationList: null
            };

        promises.push(that.fetchRoomsList(params).then(function(response) {
            data.roomList = response;
        }));

        $q.all(promises).then(function() {
            deferred.resolve(data);
        }, function(errorMessage) {
            deferred.reject(errorMessage);
        });
        return deferred.promise;

    }

}]);