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
		var url = '/ui/show?format=json&json_input=availability/house_status.json';
		rvBaseWebSrvV2.getJSON(url, params).then(function(data) {
			    deferred.resolve(data);
		},function(data){
			    deferred.reject(data);
		});	
		return deferred.promise;

	};

}]);