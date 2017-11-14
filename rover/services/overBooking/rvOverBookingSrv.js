angular.module('sntRover').service('rvOverBookingSrv', ['$q', 'rvBaseWebSrvV2', 'dateFilter',
	function($q, rvBaseWebSrvV2, dateFilter) {

	var that = this;

	this.data = {};

    /**
     * This method returns an array of dates including the from and to Date provided to it
      * @param fromDate String in yyyy-MM-dd format
     * @param toDate String in yyyy-MM-dd format
     * @returns {Array}
     */
    var getDateRange = function(fromDate, toDate) {
        var dates = [],
            currDate = new tzIndependentDate(fromDate) * 1,
            lastDate = new tzIndependentDate(toDate) * 1;

        for (; currDate <= lastDate; currDate += (24 * 3600 * 1000)) {
            var dateObj = new tzIndependentDate(currDate);

            dates.push({
                date: dateFilter(dateObj, 'yyyy-MM-dd'),
                isWeekend: dateObj.getDay() === 0 || dateObj.getDay() === 6
            });
        }
        return dates;
    };

	/**
	* function to fetch item inventory between from date & to date
	*/
	this.fetchOverBookingGridData = function (params) {
		var firstDate 	= (params.start_date),
			secondDate 	= (params.end_date);

		var dataForWebservice = {
			from_date: firstDate,
			to_date: secondDate
		};

		// Webservice calling section
		var deferred = $q.defer(),
			url = '/api/overboking';

		rvBaseWebSrvV2.getJSON(url, dataForWebservice).then(function (resultFromAPI) {
			that.data.gridDataForOverbooking = {
                "house_rooms": resultFromAPI.house_rooms,
                "room_type": resultFromAPI.room_type,
                "dates": getDateRange(firstDate, secondDate)
            };
			deferred.resolve(that.data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

}]);