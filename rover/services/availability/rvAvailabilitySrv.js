sntRover.service('rvAvailabilitySrv', ['$q', 'rvBaseWebSrvV2', function($q, rvBaseWebSrvV2){
	
	var that = this;

	this.data = {};

	this.getData = function(){
		return that.data;
	}
	this.updateData = function(data){
		that.data = data;
	};

	this.restructureDataForUI = function(data){
		var dates 				= [];
		var occupancies 		= [];
		var bookableRooms 		= [];
		var availableRooms 		= [];
		var outOfOrderRooms 	= [];
		var reservedRooms 		= [];
		var overBookableRooms 	= [];
		var availableRoomsWithBookableRooms = [];
		var individualAvailableRooms = [];

		//web service response is arrogant!!, requested to change. no use
		// before looking into the code, please have good look in the webservice response.
		//creating list of room types
		for(var i = 0; i < data.room_types.length; i++){
			individualAvailableRooms.push({
				'id' 	: data.room_types[i].id, 
				'name'	: data.room_types[i].name,
				'availableRoomNumberList': []
			})
		}

		for(i = 0; i < data.results.length; i++){

			var isWeekend = new Date(data.results[i].date).getDay() == 0 || new Date(data.results[i].date).getDay() == 6;
			dates.push({'date': data.results[i].date, 'isWeekend': isWeekend});

			occupancies.push((data.results[i].house.sold / data.physical_count) * 100);

			bookableRooms.push(data.physical_count - data.results[i].house.out_of_order);

			availableRooms.push(data.results[i].house.availability - data.results[i].house.out_of_order - data.results[i].house.sold);
			//web service response is arrogant!!, requested to change. no use :(
			for(var j = 0; j < data.results[i].room_types.length; j++){
				var id = data.results[i].room_types[j].id;
				for(var k = 0; k < individualAvailableRooms.length; k++){
					if(individualAvailableRooms[k].id == id){
						individualAvailableRooms[k].availableRoomNumberList.push(data.results[i].room_types[j].availability);
					}
				}
			}

			outOfOrderRooms.push(data.results[i].house.out_of_order);

			reservedRooms.push(data.results[i].house.sold);
			//hardcoded
			overBookableRooms.push(1);
			availableRoomsWithBookableRooms.push(3);

		}
		var availabilityData = {
			'dates'				: dates,
			'occupancies'		: occupancies,
			'bookableRooms'		: bookableRooms,
			'availableRooms'	: availableRooms,
			'outOfOrderRooms'	: outOfOrderRooms,
			'reservedRooms'		: reservedRooms,
			'overBookableRooms'	: overBookableRooms,
			'availableRoomsWithBookableRooms': availableRoomsWithBookableRooms,
			'individualAvailableRooms': individualAvailableRooms
		}
		return availabilityData;
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
		rvBaseWebSrvV2.getJSON(url, dataForWebservice).then(function(data) {

			deferred.resolve(that.restructureDataForUI(data));
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
		//var url = '/ui/show?format=json&json_input=availability/house_status.json';
		delete params['business_date'];

		rvBaseWebSrvV2.getJSON(url, params).then(function(data) {
			var houseDetails = that.restructureHouseDataForUI(data.results, data.physical_count, businessDate);
			deferred.resolve(houseDetails);
		},function(data){
			deferred.reject(data);
		});	
		return deferred.promise;

	};

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
		angular.forEach(data, function(dayInfo, i) {
			dateDetails = {};
			dateDetails.date = dayInfo.date;

			var date = tzIndependentDate(dayInfo.date);
			
			//Set if the day is yesterday/today/tomorrow
			if(date.getTime() ==  businessDate.getTime()) {
				dateDetails.day = "TODAY";
			} else if(date.getTime() < businessDate.getTime()){
				dateDetails.day = "YESTERDAY";
			}else {
				dateDetails.day = "TOMORROW";
			}
			houseDetails.total_rooms_occupied[dayInfo.date] = dayInfo.house.sold;
			houseDetails.total_guests_inhouse[dayInfo.date] = dayInfo.house.in_house;
			houseDetails.departues_expected[dayInfo.date] = dayInfo.house.departing;
			houseDetails.departures_actual[dayInfo.date] = dayInfo.house.departed;
			houseDetails.arrivals_expected[dayInfo.date] = dayInfo.house.arriving;
			houseDetails.arrivals_actual[dayInfo.date] = dayInfo.house.arrived;
			houseDetails.available_tonight[dayInfo.date] = Math.round(dayInfo.house.availability /houseTotal * 100);
			houseDetails.occupied_tonight[dayInfo.date] = Math.round(dayInfo.house.sold /houseTotal * 100);
			houseDetails.total_room_revenue[dayInfo.date] = dayInfo.house.total_room_revenue;
			houseDetails.avg_daily_rate[dayInfo.date] = dayInfo.house.avg_daily_rate;
			//push to array
			houseDetails.dates.push(dateDetails);

		});

	return houseDetails;
	};

}]);