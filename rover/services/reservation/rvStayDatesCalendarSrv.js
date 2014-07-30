sntRover.service('RVStayDatesCalendarSrv', ['$q', 'rvBaseWebSrvV2', 'RVBaseWebSrv',
    function ($q, RVBaseWebSrvV2, RVBaseWebSrv) {

    	var that = this;
        this.changeStayDetails = {};


        this.fetchStayDateDetails = function (data) {
            var deferred = $q.defer();

            var url = "/ui/show?format=json&json_input=change_staydates/rooms_available.json";
            RVBaseWebSrv.getJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchAvailability = function(param) {
            var deferred = $q.defer();
            var url = '/api/availability?from_date=' + param.from_date + '&to_date=' + param.to_date;
            RVBaseWebSrvV2.getJSON(url).then(function(response) {
                var data = that.manipulateAvailabilityForEasyLookup(response);
                deferred.resolve(data);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };


        this.manipulateAvailabilityForEasyLookup = function(data){
            var availability = {};
            
            angular.forEach(data.results, function(dayDetails, index) {
                var dayInfo = {};
                dayInfo.date = dayDetails.date;
                dayInfo.house = dayDetails.house;

                angular.forEach(dayDetails.room_types, function(roomType, i) {
                    dayInfo[roomType.id] = {};
                    //Get the room type availability for a day
                    dayInfo[roomType.id].room_type_availability = roomType;
                    dayInfo[roomType.id].rate_availability = that.getTheAvailableRate(roomType, dayDetails.rates);
                });
                availability[dayDetails.date] = dayInfo;
            });
            data.results = availability;
            return data;
        }

        this.getTheAvailableRate = function(roomType, ratesForDay){
            var singleRoomRate = null;
            var lowestRate = {};
            var rateId = "";
            angular.forEach(ratesForDay, function(rate, rateIndex) {
                //loop1
                angular.forEach(rate.room_rates, function(roomRate, roomRateIndex) {
                    if(roomRate.room_type_id == roomType.id){
                        if(singleRoomRate == null){
                            singleRoomRate = roomRate.single;
                        }
                        if(parseFloat(roomRate.single) <= parseFloat(singleRoomRate)){
                            singleRoomRate = roomRate.single;
                            lowestRate = roomRate;
                            rateId = rate.id;
                        }
                        return false;//exit form loop1
                    }
                
                });
            });

            var dict = {};
            dict.id = rateId;
            dict.room_rates = lowestRate;
            return dict;
        };

}]);