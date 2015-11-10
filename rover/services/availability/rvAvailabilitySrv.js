sntRover.service('rvAvailabilitySrv', ['$q', 'rvBaseWebSrvV2', 'RVHotelDetailsSrv',
	function($q, rvBaseWebSrvV2, RVHotelDetailsSrv){

	var that = this;

	var availabilityGridDataFromAPI = null;

	this.data = {};

	this.getGraphData = function(){
		return that.data.hasOwnProperty('gridData') && that.data.gridData.additionalGraphData;
	};
	this.getGridData = function(){
		return that.data.gridData;
	};

	this.getGridDataForGroupAvailability = function(){
		return that.data.gridDataForGroupAvailability;
	};
	this.getGridDataForAllotmentAvailability = function(){
		return that.data.gridDataForAllotmentAvailability;
	};	

	this.updateData = function(data){
		that.data = data;
	};

	var formGraphData = function(availabilityAdditionalFromAPI, occupancyDataFromAPI){
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
		var totalRoomCount = availabilityAdditionalFromAPI.physical_count;
		var currentRow = null;
		for(var i = 0; i < availabilityAdditionalFromAPI.results.length; i++){
			currentRow = availabilityAdditionalFromAPI.results[i];

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
		};

		//since occupancy data is from another API, results may have length  lesser/greater than availability
		for(i = 0; i < occupancyDataFromAPI.results.length; i++){
			currentRow = occupancyDataFromAPI.results[i];
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
	/*
	* param - Object from api/group_availability response
	* return - Object 
	*/
	var formGridDataForGroupAvailability = function(datafromApi){
		var gridDataForGroupAvailability = {};
		var dates = [];
		var groupTotalRooms =[];
		var groupTotalPickedUps = [];
		var holdstatus = [];
		var groupDetails =[];
		var groupDetail = [];		

		_.each(datafromApi.results,function(element,index,lis){
			var temp = [];
			//Extracting date detail
			var dateToCheck = tzIndependentDate(element.date);
			var isWeekend = dateToCheck.getDay() === 0 || dateToCheck.getDay() === 6;
			dates.push({'date': element.date, 'isWeekend': isWeekend, 'dateObj': new Date(element.date)});
			//Extracting groupTotalRooms
			groupTotalRooms.push(element.group_total_rooms);
			//Extracting groupTotal picked ups
			groupTotalPickedUps.push(element.group_total_pickups);			
			holdstatus.push(element.hold_status);
			//Forms array(temp) of details of groups date wise
			_.each(element.group_availability,function(ele, ind, list){
				var detail ={
					"id":ele.group_id,
					"Name":ele.name,
					"date":element.date,
					"total_blocked_rooms":ele.total_blocked_rooms,
					"total_pickedup_rooms":ele.total_pickedup_rooms
				};
				temp.push(detail);
			});
			//Forms two dimensional array[datewise][groupwise]
			groupDetail.push(temp);
		});
		//Forms groupwise Details. 
		_.each(datafromApi.results[0].group_availability, function(element, index, list){
			var groupdetail ={
				"name":element.name,
				"id":element.group_id,
				"holdStatusName":getGroupName(element.hold_status_id,datafromApi.hold_status),
				"details":_.zip.apply(null, groupDetail)[index]
			};
			groupDetails.push(groupdetail);
		});
		
		gridDataForGroupAvailability = {
			'dates'	: dates,
			'groupTotalRooms': groupTotalRooms,
			'groupTotalPickedUps':groupTotalPickedUps,
			'holdstatuses': _.zip.apply(null, holdstatus),
			'groupDetails':groupDetails,
			'holdStatus':datafromApi.hold_status
		};
		return gridDataForGroupAvailability;
	}
	/*
	* param - Group id
	* return Group name
	*/
	var getGroupName = function(GroupId, holdstatuses){
		return _.find(holdstatuses, function(elem){ 
				return (elem.id === GroupId)?true:false;
				}).name;
	};
	/**
	* function to fetch group availability between from date & to date
	*/
	this.fetchGroupAvailabilityDetails = function(params){
		var firstDate 	= (params.from_date);
		var secondDate 	= (params.to_date);

		var dataForWebservice = {
			from_date	: firstDate,
			to_date		: secondDate
		};

		//Webservice calling section
		var deferred = $q.defer();
		var url = 'api/group_availability';
		rvBaseWebSrvV2.getJSON(url, dataForWebservice).then(function(resultFromAPI) {
			//storing response temporarily in that.data, will change in occupancy call
			that.data.gridDataForGroupAvailability = formGridDataForGroupAvailability(resultFromAPI);
			deferred.resolve(that.data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};
	/**
	* function to re-structure API response to UI data model.
	*/
	var formGridData = function(roomAvailabilityData){
		var gridData = {};

		//array to keep all data, we will append these to above dictionary after calculation
		var dates 				= [],
		occupancies  			= [],
		availableRooms   		= [],
		bookedRooms  			= [],
		nonGroupRooms 			= [],
		groupAndAllotments 		= [],
		outOfOrder  			= [],
		inventory				= [],
		roomToSell				= [],
		roomTypes               = [];

		var isHourlyRateOn 		= RVHotelDetailsSrv.hotelDetails.is_hourly_rate_on;

		_.each(roomAvailabilityData.results,function(item){

			//Extracting date detail
			var dateToCheck = tzIndependentDate(item.date);
			var isWeekend = dateToCheck.getDay() === 0 || dateToCheck.getDay() === 6;
			dates.push({'date': item.date, 'isWeekend': isWeekend, 'dateObj': new Date(item.date)});

			//Extracting Occupancy details
			occupancies.push(item.occupancy.percentage);

			//Extracting Availability details
			availableRooms.push(item.available_rooms);

			//Extracting Availability details
			nonGroupRooms.push(item.non_group_rooms);

			groupAndAllotments.push(item.group_and_allotment);

			//Extracting inventory count
			inventory.push(item.physical_room_count);

			//Extracting OOO
			outOfOrder.push(item.occupancy.out_of_order);

			//Extracting room to sell
			roomToSell.push(item.rooms_to_sell);


			//CICO-13590
			//we are enabling this for non-hourly hotels only
			if (!isHourlyRateOn) {
				bookedRooms.push (item.rooms_sold);
			}
		});

		gridData = {
			'dates'				: dates,
			'occupancies'		: occupancies,
			'availableRooms'	: availableRooms,
			'nonGroupRooms'		: nonGroupRooms,
			'groupAndAllotments': groupAndAllotments,			
			'outOfOrder' 		: outOfOrder,
			'inventory'			: inventory,
			'roomTypes'         : roomAvailabilityData['room_types'],
			'roomToSell'		: roomToSell
		};
		//CICO-13590
		if (!isHourlyRateOn) {
			_.extend (gridData,
			{
				'bookedRooms' 		: bookedRooms				
			});
		}
		return gridData;
	};
	/**
	* function to add additional data to UI data model.
	*/
	var formGridAdditionalData = function(roomAvailabilityAdditionalData){
		var additionalData = {};
		var roomtypeDetails = [];
		var roomTypeNames =[],
			bestAvailabilityRate = [],
			adultsChildrenCounts = [];

		var adultsCount,
			childrenCount;
		
		_.each(roomAvailabilityAdditionalData.results,function(item){
			//Extracts roomtype details			
			roomtypeDetails.push(item.detailed_room_types);

			//Extracts adult child count
			//the count could be nothing
			adultsCount   = item.adults_count || 0;
			childrenCount = item.children_count || 0;
			adultsChildrenCounts.push({
				'bothCount' : adultsCount + '/' + childrenCount,
				'showWarn'  : ( 5 >= adultsCount && 5 >= childrenCount ),
				'isWarning' : ( 0 >= adultsCount && 0 >= childrenCount )
			});

			//Extracts BAR details
			bestAvailabilityRate.push( (0 == item.best_available_rate_amount.rate_amount) ? 'C' : item.best_available_rate_amount.rate_amount );

		});

		//Forms roomtype names array
		_.each(roomAvailabilityAdditionalData.results[0].detailed_room_types, function(item){
			var roomTypeName;
			_.map(roomAvailabilityAdditionalData.room_types,function(roomType){
				if(roomType.id === item.id){
					roomTypeName = roomType.name;
				}
			});
			roomTypeNames.push(roomTypeName);			
		});

		additionalData ={
			'roomTypeWiseDetails' 	: 	_.zip.apply(null, roomtypeDetails),
			'roomTypeNames' 		: 	roomTypeNames,
			'adultsChildrenCounts'	: 	adultsChildrenCounts,
			'bestAvailabilityRate'	: 	bestAvailabilityRate
		};

		return additionalData;
	};
	/**
	* function to fetch allotment availability between from date & to date
	*/
	this.fetchAllotmentAvailabilityDetails = function(params){
		var firstDate 	= (params.from_date);
		var secondDate 	= (params.to_date);

		var dataForWebservice = {
			from_date	: firstDate,
			to_date		: secondDate
		};

		//Webservice calling section
		var deferred = $q.defer();
		var url = 'api/allotment_availability';
		rvBaseWebSrvV2.getJSON(url, dataForWebservice)
			.then(function(resultFromAPI) {
				//storing response temporarily in that.data, will change in occupancy call
				that.data.gridDataForAllotmentAvailability = formGridDataForAllotmentAvailability(resultFromAPI);
				deferred.resolve(that.data);
			},function(data){
				deferred.reject(data);
			});
		return deferred.promise;
	};

	/*
	* param - Group id
	* return Group name
	*/
	var getAllotmentName = function(GroupId, holdstatuses){
		return _.find(holdstatuses, function(elem){ 
				return (elem.id === GroupId)?true:false;
				}).name;
	};

	/*
	* param - Object from api/group_availability response
	* return - Object 
	*/
	var formGridDataForAllotmentAvailability = function(datafromApi){
		var gridDataForAllotmentAvailability = {};
		var dates = [];
		var groupTotalRooms =[];
		var groupTotalPickedUps = [];
		var holdstatus = [];
		var groupDetails =[];
		var groupDetail = [];		

		_.each(datafromApi.results,function(element,index,lis){
			var temp = [];

			//Extracting date detail		
			var dateToCheck = tzIndependentDate(element.date);
			var isWeekend = dateToCheck.getDay() === 0 || dateToCheck.getDay() === 6;
			dates.push({'date': element.date, 'isWeekend': isWeekend, 'dateObj': new Date(element.date)});

			//Extracting groupTotalRooms
			groupTotalRooms.push(element.total_rooms);

			//Extracting groupTotal picked ups
			groupTotalPickedUps.push(element.total_pickups);			
			holdstatus.push(element.hold_status);

			//Forms array(temp) of details of groups date wise
			_.each(element.availability,function(ele, ind, list){
				var detail ={
					"id":ele.id,
					"Name":ele.name, 
					"date":element.date, // is needed, not in API				
					"total_blocked_rooms":ele.total_blocked_rooms,
					"total_pickedup_rooms":ele.total_pickedup_rooms
				};
				temp.push(detail);
			});

			//Forms two dimensional array[datewise][groupwise]
			groupDetail.push(temp);
		});

		//Forms groupwise Details. 
		_.each(datafromApi.results[0].availability, function(element, index, list){
			var groupdetail ={
				"name":element.name,
				"id":element.id,
				"holdStatusName":getAllotmentName(element.hold_status_id, datafromApi.hold_status),
				"details":_.zip.apply(null, groupDetail)[index]
			};
			groupDetails.push(groupdetail);
		});
		
		gridDataForAllotmentAvailability = {
			'dates'	: dates,
			'groupTotalRooms': groupTotalRooms,
			'groupTotalPickedUps':groupTotalPickedUps,
			'holdstatuses': _.zip.apply(null, holdstatus),
			'groupDetails':groupDetails,
			'holdStatus':datafromApi.hold_status
		};

		return gridDataForAllotmentAvailability;
	};


	/**
	* function to fetch availability between from date & to date
	*/
	this.fetchAvailabilityDetails = function(params){
		var firstDate 	= params.from_date;
		var secondDate 	= params.to_date;

		var dataForWebservice = {
			from_date	: firstDate,
			to_date		: secondDate
		};

		//Webservice calling section
		var deferred = $q.defer();
		var url = 'api/availability_main';
		rvBaseWebSrvV2.getJSON(url, dataForWebservice).then(function(resultFromAPI) {
			that.data.gridData ={};
			that.data.gridData = formGridData(resultFromAPI);
			deferred.resolve(resultFromAPI);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};


	/**
	* function to fetch availability between from date & to date
	*/
	this.fetchAvailabilityAdditionalDetails = function(params){
		var dataForWebservice = {
			'from_date'                   : params.from_date,
			'to_date'	                  : params.to_date,
			'is_from_availability_screen' : true
		};

		//Webservice calling section
		var deferred = $q.defer();
		var url = 'api/calendar_availability';

		rvBaseWebSrvV2.getJSON(url, dataForWebservice)
			.then(function(availabilityAdditionalFromAPI) {

				that.fetchOccupancyDetails(params)
					.then(function(occupancyDataFromAPI) {
						_.extend(that.data.gridData, {
							'additionalData'      : formGridAdditionalData( availabilityAdditionalFromAPI ),
							'additionalGraphData' : formGraphData( availabilityAdditionalFromAPI, occupancyDataFromAPI ),
						});

						// passing on gridData is a waste, sort of.
						// but we sure gotta resolve!
						deferred.resolve(that.data.gridData);
					}, function(data) {
						deferred.reject(data);
					});

			}, function(data) {
				deferred.reject(data);
			});

		return deferred.promise;
	};

	/*
	* function to fetch occupancy details date wise
	*/
	this.fetchOccupancyDetails = function(params){
		var dataForWebservice = {
			'from_date' : params.from_date,
			'to_date'   : params.to_date
		};

		var deferred = $q.defer();
		var url = 'api/daily_occupancies';

		rvBaseWebSrvV2.getJSON(url, dataForWebservice)
			.then(function(responseFromAPI) {
				deferred.resolve(responseFromAPI);
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
			//Departures Actual
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

	this.fetchGrpNAllotAvailDetails = function(params) {
		var deferred = $q.defer();

		var count = 2;

		var shallWeResolve = function() {
			if ( count == 0 ) {
				deferred.resolve();
			};
		};

		var success = function() {
			count--;
			shallWeResolve();
		};

		var failed = function() {
			count--;
			shallWeResolve();
		};

		that.fetchGroupAvailabilityDetails({
			from_date : params.from_date,
			to_date   : params.to_date
		}).then(success, failed);

		that.fetchAllotmentAvailabilityDetails({
			from_date : params.from_date,
			to_date   : params.to_date
		}).then(success, failed);

		return deferred.promise;
	};


	//*** CICO-17073 : Code for Item Inventory **//

	this.getGridDataForInventory = function () {
		return that.data.gridDataForItemInventory;
	};

	var formGridDataForItemInventory = function (response) {
		var dates = [];
		//extracting dates from response
		_.each(response.addons[0].availability_details, function (key) {
			var dateToCheck = tzIndependentDate(key.date);
			var isWeekend = dateToCheck.getDay() === 0 || dateToCheck.getDay() === 6;
			var eachDate = {"date" : key.date, "isWeekend" : isWeekend};
			dates.push(eachDate);
		});
		var result = { "addons": response.addons, "dates": dates };
		return result;
	};

	/**
	* function to fetch item inventory between from date & to date
	*/
	this.fetchItemInventoryDetails = function (params) {
		var firstDate 	= (params.from_date),
			secondDate 	= (params.to_date);

		var dataForWebservice = {
			from_date	: firstDate,
			to_date		: secondDate
		};
		//Webservice calling section
		var deferred = $q.defer(),
			url = '/api/availability/addons';
		
		rvBaseWebSrvV2.getJSON(url, dataForWebservice).then(function (resultFromAPI) {
			that.data.gridDataForItemInventory = formGridDataForItemInventory(resultFromAPI);
			deferred.resolve(that.data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

	/***************************************************************************************************/

}]);