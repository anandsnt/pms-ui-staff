angular.module('sntRover').service('rvOverBookingSrv', ['$q', 'rvBaseWebSrvV2', 'dateFilter',
	function($q, rvBaseWebSrvV2, dateFilter) {

	var that = this;

	this.gridDataForOverbooking = {};

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

		// Webservice calling section
		var deferred = $q.defer(),
			url = '/api/sell_limits/sell_limits';

		rvBaseWebSrvV2.postJSON(url, params).then(function (resultFromAPI) {
			that.gridDataForOverbooking = {
                'houseSellLimits': resultFromAPI.house_sell_limits,
                'roomTypeSellLimits': resultFromAPI.room_type_sell_limits,
                'selectedRommTypeNameList': _.pluck(resultFromAPI.room_type_sell_limits, 'name'),
                'dateRangeList': getDateRange(firstDate, secondDate)
            };
			deferred.resolve(that.gridDataForOverbooking);
		}, function(data) {
			deferred.reject(data);
		});
	
		return deferred.promise;
	};

	/**
	 * Function to get list of Room types
	 * @return {Promise} - After resolving it will return the list of Hold Room types
	 */
	this.getAllRoomTypes = function() {
		var deferred = $q.defer(),
			url = '/api/room_types.json?exclude_pseudo=true?exclude_suite=true',
			result = [];

		rvBaseWebSrvV2.getJSON(url).then(
			function(data) {
				if (data.results && data.results.length > 0 ) {
					_.each( data.results, function(obj) { 
						result.push(_.extend (_.pick(obj, 'name', 'id'), { 'isChecked': true } ));
					});
				}
				deferred.resolve(result);
			},
			function(errorMessage) {
				deferred.reject(errorMessage);
			}
		);

		return deferred.promise;
	};

}]);