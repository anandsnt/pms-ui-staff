sntRover.service('RVStayDatesCalendarSrv', ['$q', 'rvBaseWebSrvV2', 'RVBaseWebSrv',
    function ($q, RVBaseWebSrvV2, RVBaseWebSrv) {

    	var that = this;
        this.changeStayDetails = {};


        /*this.fetchStayDateDetails = function (data) {
            var deferred = $q.defer();

            var url = "/ui/show?format=json&json_input=change_staydates/rooms_available.json";
            RVBaseWebSrv.getJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };*/

        this.fetchAvailability = function(param) {
            var deferred = $q.defer();
            var url = '/api/availability';
            RVBaseWebSrvV2.getJSON(url, param).then(function(response) {
                var data = that.manipulateAvailabilityForEasyLookup(response);
                deferred.resolve(data);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };

        /**
        * Manipulate the availability API response for the availablility calendar screen
        * Instead of arrays, we create hash with date as index.
        * Also the rates are grouped for each room type - again a hash with room_type_id as index
        * Also we calculate the best available rate - the lowest rate for a day
        */
        this.manipulateAvailabilityForEasyLookup = function(data){
            var availability = {};
            //loop1
            angular.forEach(data.results, function(dayDetails, index) {
                var dayInfo = {};
                dayInfo.date = dayDetails.date;
                dayInfo.house = dayDetails.house;
                dayInfo.BAR = that.getBestAvailableRateForTheDay(dayDetails.rates, dayDetails.room_types);
                //loop2
                angular.forEach(dayDetails.room_types, function(roomType, i) {
                    dayInfo[roomType.id] = that.getLowestRateForRoomType(roomType, dayDetails.rates);
                    //Get the room type availability for a day
                    //dayInfo[roomType.id].room_type_details = roomType;
                    //dayInfo[roomType.id].availability = that.getLowestRateForRoomType(roomType, dayDetails.rates);
                });
                availability[dayDetails.date] = dayInfo;
            });
            data.results = availability;
            return data;
        };

        /**
        * @return {hash} The rate_id and the lowest roomrate for the rate 
        * irrespective of the room type
        */
        this.getBestAvailableRateForTheDay = function(ratesForTheDay, allRoomTypes){
            var rateForSingleRoom = null;
            var lowestRate = {};
            var rateId = "";

            angular.forEach(ratesForTheDay, function(rate, rateIndex) {
                //loop1 - we have to search among all room rates
                //not considering the room type and find the lowest rate
                angular.forEach(rate.room_rates, function(roomRate, roomRateIndex) {
                    if(rateForSingleRoom == null){
                        rateForSingleRoom = roomRate.single;
                    }
                    if(parseFloat(roomRate.single) <= parseFloat(rateForSingleRoom)){
                        rateForSingleRoom = roomRate.single;
                        lowestRate = roomRate;
                        rateId = rate.id;
                    }
                        
                });

            });

            var dict = {};
            dict.rate_id = rateId;
            //Get the room type availability details looping through all room types. 
            angular.forEach(allRoomTypes, function(roomType, roomTypeIndex) {
                if(roomType.id == lowestRate.room_type_id){
                    dict.room_type_availability = roomType;
                    return false;//exit from the loop
                }
            });

            dict.room_rates = lowestRate;
            return dict;
        };

        /**
        * @return {hash} The rate_id and the lowest roomrate for the rate 
        * for the given room type
        */
        this.getLowestRateForRoomType = function(roomType, ratesForDay){
            var rateForSingleRoom = null;
            var lowestRate = {};
            var rateId = "";
            angular.forEach(ratesForDay, function(rate, rateIndex) {
                //loop1 - we need to display only the lowest rate in the UI. For a room type
                angular.forEach(rate.room_rates, function(roomRate, roomRateIndex) {
                    if(roomRate.room_type_id == roomType.id){
                        if(rateForSingleRoom == null){
                            rateForSingleRoom = roomRate.single;
                        }
                        if(parseFloat(roomRate.single) <= parseFloat(rateForSingleRoom)){
                            rateForSingleRoom = roomRate.single;
                            lowestRate = roomRate;
                            rateId = rate.id;
                        }
                        return false;//exit form loop1 - //we are searching for rates with a room type id. 
                            //other room rates in this loop will be having different room types. 
                            //so go to the next rate.
                    }
                });
            });

            var dict = {};
            dict.rate_id = rateId;
            dict.room_type_availability = roomType;
            dict.room_rates = lowestRate;
            return dict;
        };

}]);