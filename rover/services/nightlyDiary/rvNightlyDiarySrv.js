angular.module('sntRover').service('RVNightlyDiarySrv',
    ['$q',
    'BaseWebSrvV2',
    function($q, BaseWebSrvV2){
    /*
     * To fetch the rooms list
     * @param {data} object
     * return object
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
    /*
     * To fetch the reservations list
     * @param {data} object
     * return object
     */

    this.fetchReservationsList = function(data){
        var deferred = $q.defer();
        var url = '/api/nightly_diary/reservation_list';
        BaseWebSrvV2.getJSON(url, data).then(function(response) {
            deferred.resolve(response);
        },function(error){
            deferred.reject(error);
        });
        return deferred.promise;
    }


}]);