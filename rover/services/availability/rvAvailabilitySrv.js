sntRover.service('rvAvailabilitySrv', ['$q', 'rvBaseWebSrvV2', 'RVHotelDetailsSrv',
	function($q, rvBaseWebSrvV2, RVHotelDetailsSrv){

	var that = this;

	var availabilityGridDataFromAPI = null;

	this.data = {};

	this.getGraphData = function(){
		return that.data.graphData;
	};
	this.getGridData = function(){
		return that.data.gridData;
	};

	this.updateData = function(data){
		that.data = data;
	};

	var formGridData = function(roomAvailabilityData){
		var gridData = {};

		//array to keep all data, we will append these to above dictionary after calculation
		var dates 				= [];
		var occupancies 		= [];
		var bookableRooms 		= [];
		var availableRooms 		= [];
		var outOfOrderRooms 	= [];
		var reservedRooms 		= [];
		var overBookableRooms 	= [];
		var availableRoomsWithBookableRooms = [];
		var individualAvailableRooms = [];

		//CICO-13590:
		var bookedRooms 		= [];
		var individualBookedRooms = [];
		var groupTotalRooms 	= [];
		var groupTotalPickedUp 	= [];
		var isHourlyRateOn 		= RVHotelDetailsSrv.hotelDetails.is_hourly_rate_on;

		var currentRow = null;
		var totalRooms = roomAvailabilityData.physical_count;

		//web service response is arrogant!!, requested to change. no use
		// before looking into the code, please have good look in the webservice response.
		// Also please console the end data model, so that you will get clarity when looking the code
		//creating list of room types
		for(var i = 0; i < roomAvailabilityData.room_types.length; i++){
			individualAvailableRooms.push({
				'id' 	: roomAvailabilityData.room_types[i].id,
				'name'	: roomAvailabilityData.room_types[i].name,
				'availableRoomNumberList': []
			});

			//CICO-13590:
			individualBookedRooms.push ({
				'id' 	: roomAvailabilityData.room_types[i].id,
				'name'	: roomAvailabilityData.room_types[i].name,
				'bookedNumberList': []
			});
		}

		for(i = 0; i < roomAvailabilityData.results.length; i++){
			currentRow = roomAvailabilityData.results[i];

			var dateToCheck = tzIndependentDate(currentRow.date);
			var isWeekend = dateToCheck.getDay() === 0 || dateToCheck.getDay() === 6;
			dates.push({'date': currentRow.date, 'isWeekend': isWeekend, 'dateObj': new Date(currentRow.date)});

			occupancies.push((currentRow.house.sold / totalRooms) * 100);

			bookableRooms.push(totalRooms - currentRow.house.out_of_order);

			availableRooms.push(currentRow.house.availability);

			//CICO-13590
			if (!isHourlyRateOn) { //we are enabling this for non-hourly hotels only
				bookedRooms.push (currentRow.house.sold);
				groupTotalRooms.push (currentRow.house.group_total_rooms);
				groupTotalPickedUp.push (currentRow.house.group_total_pickups);

				for(var j = 0; j < currentRow.room_types.length; j++){
					var id = currentRow.room_types[j].id;
					for(var k = 0; k < individualBookedRooms.length; k++){
						if(individualBookedRooms[k].id === id){
							individualBookedRooms[k].bookedNumberList.push(currentRow.room_types[j].sold);
							break;
						}
					}
				}

			}

			//web service response is arrogant!!, requested to change. no use :(
			for(var j = 0; j < currentRow.room_types.length; j++){
				var id = currentRow.room_types[j].id;
				for(var k = 0; k < individualAvailableRooms.length; k++){
					if(individualAvailableRooms[k].id === id){
						individualAvailableRooms[k].availableRoomNumberList.push(currentRow.room_types[j].availability);
						break;
					}
				}
			}

			outOfOrderRooms.push(currentRow.house.out_of_order);

			reservedRooms.push(currentRow.house.sold);
			//hardcoded
			overBookableRooms.push(1);
			availableRoomsWithBookableRooms.push(3);

		}
		gridData = {
			'dates'				: dates,
			'occupancies'		: occupancies,
			'bookableRooms'		: bookableRooms,
			'availableRooms'	: availableRooms,
			'outOfOrderRooms'	: outOfOrderRooms,
			'reservedRooms'		: reservedRooms,
			'overBookableRooms'	: overBookableRooms,
			'availableRoomsWithBookableRooms': availableRoomsWithBookableRooms,
			'individualAvailableRooms': individualAvailableRooms,
			'totalRooms'		: roomAvailabilityData.physical_count
		};

		//CICO-13590
		if (!isHourlyRateOn) {
			_.extend (gridData,
			{
				'bookedRooms' 		: bookedRooms,
				'individualBookedRooms': individualBookedRooms,
				'groupTotalRooms'	: groupTotalRooms,
				'groupTotalPickedUp': groupTotalPickedUp
			});
		}
		return gridData;
	};

	var formGraphData = function(dataFromAvailability, occupancyData){
		// returning object
		var graphData = {};

		//array to keep all data, we will append these to above dictionary after calculation
		var dates 				= [];
		var bookableRooms 		= [];
		var outOfOrderRooms 	= [];
		var reservedRooms 		= [];
		var availableRooms 		= [];
		var occupanciesActual	= [];
		var occupanciesTargeted = [];

		//used to show/hide the occupancy target checkbox
		var IsOccupancyTargetSetBetween = false;

		//variables for single day calculation
		var bookableRoomForADay 		= '';
		var outOfOrderRoomForADay 		= '';
		var reservedRoomForADay			= '';
		var availableRoomForADay		= '';
		var occupanciesActualForADay	= '';
		var occupanciesTargetedForADay 	= '';
		var date 						= '';
		var totalRoomCount = dataFromAvailability.physical_count;
		var currentRow = null;
		for(var i = 0; i < dataFromAvailability.results.length; i++){
			currentRow = dataFromAvailability.results[i];

			// date for th day
			date = {'dateObj': new Date(currentRow.date)};

			//forming bookable room data for a day
			//total number of rooms - outoforder for that day
			bookableRoomForADay = totalRoomCount - currentRow.house.out_of_order;
			bookableRoomForADay = ( bookableRoomForADay / totalRoomCount ) * 100;

			// forming outoforder room data for a day
			outOfOrderRoomForADay = ( currentRow.house.out_of_order / totalRoomCount ) * 100;

			//forming reserved room data for a day
			reservedRoomForADay = ( currentRow.house.sold / totalRoomCount ) * 100;

			//forming available room for a day
			availableRoomForADay = (currentRow.house.availability / totalRoomCount ) * 100;

			//pusing all these to array
			dates.push(date);
			bookableRooms.push(bookableRoomForADay);
			outOfOrderRooms.push(outOfOrderRoomForADay);
			reservedRooms.push(reservedRoomForADay);
			availableRooms.push(availableRoomForADay);
		}

		//since occupancy data is from another API, results may have length  lesser/greater than availability
		for(i = 0; i < occupancyData.results.length; i++){
			currentRow = occupancyData.results[i];
			occupanciesActualForADay = escapeNull(currentRow.actual) === "" ? 0 : currentRow.actual;
			occupanciesTargetedForADay = escapeNull(currentRow.target) === "" ? 0 : currentRow.target;
			occupanciesActual.push(occupanciesActualForADay);
			occupanciesTargeted.push(occupanciesTargetedForADay);
			if(occupanciesTargetedForADay > 0) {
				IsOccupancyTargetSetBetween = true;
			}
		}

		//forming data to return
		graphData = {
			'dates'				: dates,
			'bookableRooms'		: bookableRooms,
			'outOfOrderRooms'	: outOfOrderRooms,
			'reservedRooms'		: reservedRooms,
			'availableRooms'	: availableRooms,
			'occupanciesActual'	: occupanciesActual,
			'occupanciesActual'	: occupanciesActual,
			'occupanciesTargeted': occupanciesTargeted,
			'totalRooms'	: totalRoomCount

		};
		return graphData;

	};


	/**
	* function to fetch availability between from date & to date
	*/
	this.fetchAvailabilityDetails = function(params){
		var firstDate 	= tzIndependentDate(params.from_date);
		var secondDate 	= tzIndependentDate(params.to_date);

		var dataForWebservice = {
			from_date	: firstDate,
			to_date		: secondDate
		};

		//Webservice calling section
		var deferred = $q.defer();
		var url = 'api/availability';
		rvBaseWebSrvV2.getJSON(url, dataForWebservice).then(function(resultFromAPI) {
			//storing response temporarily in that.data, will change in occupancy call
			availabilityGridDataFromAPI= resultFromAPI;
			return that.fetchOccupancyDetails(params, deferred);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

	/*
	* function to fetch occupancy details date wise
	*/
	this.fetchOccupancyDetails = function(params, deferred){
		var firstDate 	= tzIndependentDate(params.from_date);
		var secondDate 	= tzIndependentDate(params.to_date);

		var dataForWebservice = {
			from_date	: firstDate,
			to_date		: secondDate
		};

		var url = 'api/daily_occupancies';
		rvBaseWebSrvV2.getJSON(url, dataForWebservice).then(function(responseFromAPI) {
			that.data.gridData 	= formGridData(availabilityGridDataFromAPI);
			that.data.graphData = formGraphData(availabilityGridDataFromAPI, responseFromAPI);
			deferred.resolve(that.data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.fetchHouseStatusDetails = function(params){

		//Webservice calling section
		var deferred = $q.defer();
		var url = '/api/availability/house';
		var businessDate = tzIndependentDate(params['business_date']).clone();
		
		delete params['business_date'];

		rvBaseWebSrvV2.getJSON(url, params).then(function(data) {
			var houseDetails = that.restructureHouseDataForUI(data.results, data.physical_count, businessDate);
			deferred.resolve(houseDetails);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;

	};

	/**
	*Manipulates the house availability response to a format that would suit UI rendering
	* (Which supports rendering calendar row by row)
	*/
	this.restructureHouseDataForUI = function(data, houseTotal, businessDate){

		var houseDetails = {};
		houseDetails.physical_count = houseTotal;
		houseDetails.dates = [];
		houseDetails.total_rooms_occupied = {};
		houseDetails.total_guests_inhouse = {};
		houseDetails.departues_expected = {};
		houseDetails.departures_actual = {};
		houseDetails.arrivals_expected = {};
		houseDetails.arrivals_actual = {};
		houseDetails.available_tonight = {};
		houseDetails.occupied_tonight = {};
		houseDetails.total_room_revenue = {};
		houseDetails.avg_daily_rate = {};

		var houseStatus;
		var dateDetails;
		var totalDepartures;
		var totalArrivals;

		angular.forEach(data, function(dayInfo, i) {
			//Creates the hash of date details
			//Consists of the day info - today, tomorrow or yesterday and the date
			dateDetails = {};
			dateDetails.date = dayInfo.date;
			var date = tzIndependentDate(dayInfo.date);
			//Set if the day is yesterday/today/tomorrow
			if(date.getTime() ===  businessDate.getTime()) {
				dateDetails.day = "TODAY";
			} else if(date.getTime() < businessDate.getTime()){
				dateDetails.day = "YESTERDAY";
			}else {
				dateDetails.day = "TOMORROW";
			}
			houseDetails.dates.push(dateDetails);

			//Total rooms occupied
			// value - Actual value - will be displayed in the colum near to graph
			// percent - Used for graph plotting
			houseDetails.total_rooms_occupied[dayInfo.date] = {};
			houseDetails.total_rooms_occupied[dayInfo.date].value = dayInfo.house.sold;
			houseDetails.total_rooms_occupied[dayInfo.date].percent = dayInfo.house.sold / houseTotal * 100;
			/*total guests inhouse - not used now. May be added in future
			houseDetails.total_guests_inhouse[dayInfo.date] = {};
			houseDetails.total_guests_inhouse[dayInfo.date].value = dayInfo.house.in_house;*/

			totalDepartures = dayInfo.house.departing + dayInfo.house.departed;
			//Departures Expected
			houseDetails.departues_expected[dayInfo.date] = {};
			houseDetails.departues_expected[dayInfo.date].value = dayInfo.house.departing;
			houseDetails.departues_expected[dayInfo.date].percent = dayInfo.house.departing / totalDepartures * 100;
			//Departures Actual;
			houseDetails.departures_actual[dayInfo.date] = {};
			houseDetails.departures_actual[dayInfo.date].value = dayInfo.house.departed;
			houseDetails.departures_actual[dayInfo.date].percent = dayInfo.house.departed / totalDepartures * 100;

			totalArrivals = dayInfo.house.arriving + dayInfo.house.arrived;
			//Arrivals Expected
			houseDetails.arrivals_expected[dayInfo.date] = {};
			houseDetails.arrivals_expected[dayInfo.date].value = dayInfo.house.arriving;
			houseDetails.arrivals_expected[dayInfo.date].percent = dayInfo.house.arriving / totalArrivals * 100;
			//Arrivals Actual
			houseDetails.arrivals_actual[dayInfo.date] = {};
			houseDetails.arrivals_actual[dayInfo.date].value = dayInfo.house.arrived;
			houseDetails.arrivals_actual[dayInfo.date].percent = dayInfo.house.arrived / totalArrivals * 100;

			//Available tonight
			houseDetails.available_tonight[dayInfo.date] = {};
			houseDetails.available_tonight[dayInfo.date].value = Math.round(dayInfo.house.availability /houseTotal * 100);
			houseDetails.available_tonight[dayInfo.date].percent = Math.round(dayInfo.house.availability /houseTotal * 100);

			//Occupied tonight
			houseDetails.occupied_tonight[dayInfo.date] = {};
			houseDetails.occupied_tonight[dayInfo.date].value = Math.round(dayInfo.house.sold /houseTotal * 100);
			houseDetails.occupied_tonight[dayInfo.date].percent = Math.round(dayInfo.house.sold /houseTotal * 100);
			//Total room revenue
			houseDetails.total_room_revenue[dayInfo.date] = dayInfo.house.total_room_revenue;
			//Average daily rate
			houseDetails.avg_daily_rate[dayInfo.date] = dayInfo.house.average_daily_rate;


		});

	return houseDetails;
	};

}]);