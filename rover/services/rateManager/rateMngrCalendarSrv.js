sntRover.service('RateMngrCalendarSrv',['$q', 'BaseWebSrvV2', function( $q, BaseWebSrvV2){
	var that = this;
	that.allRestrictionTypes = {};



	this.fetchAllRestrictionTypes = function(){
		//TODO: Modify to handle case of date range changes, if needed.
		var url =  '/api/restriction_types';	
		var deferred = $q.defer();
		if(!isEmpty(that.allRestrictionTypes)){
			deferred.resolve(that.allRestrictionTypes)
		} else{
			BaseWebSrvV2.getJSON(url).then(function(data) {
				that.allRestrictionTypes = data.results; 
				deferred.resolve(data);
			},function(data){
				deferred.reject(data);
			});
		}
		return deferred.promise;
	};


	/**
    * To fetch All Calendar data
    */
	this.fetchCalendarData = function(params){
		var deferred = $q.defer();

		var rejectDeferred = function(data){
			deferred.reject(data);
		}
		var getDailyRates = function(d){
			//var url = "/api/daily_rates";
			var url =  '/sample_json/rate_manager/daily_rates.json';	
			BaseWebSrvV2.getJSON(url, params).then(function(data) {
				that.dailyRates = data; 
				var calendarData = that.calculateRateViewCalData();
				deferred.resolve(calendarData);
			},rejectDeferred);

		};

		that.fetchAllRestrictionTypes().then(getDailyRates, rejectDeferred);
				
		return deferred.promise;

	}

	this.fetchRoomTypeCalenarData = function(params){
		var deferred = $q.defer();

		var rejectDeferred = function(data){
			deferred.reject(data);
		}
		var getRoomTypeRates = function(d){
			//var url = "/api/daily_rates/" + params.id
			delete params['id'];

			var url =  '/sample_json/rate_manager/rate_details.json';	
			BaseWebSrvV2.getJSON(url, params).then(function(data) {
				that.roomTypeRates = data; 
				var calendarData = that.calculateRoomTypeViewCalData();
				deferred.resolve(calendarData);
			},rejectDeferred);

		};

		that.fetchAllRestrictionTypes().then(getRoomTypeRates, rejectDeferred);
				
		return deferred.promise;

	};

	this.updateRestrictions = function(params){

		var url =  '/api/daily_rates';	
		var deferred = $q.defer();
		BaseWebSrvV2.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;

	};

	this.calculateRoomTypeViewCalData = function(){
		var calendarData = {};
		
		// Format restriction Types as required by UI, and make it a dict for easy lookup 
		var formattedRestrictionTypes = {};
		angular.forEach(that.allRestrictionTypes, function(item){
			formattedRestrictionTypes[item.id]= that.getRestrictionUIElements(item);
		});
		calendarData.restriction_types = formattedRestrictionTypes;
		
		// In UI, tables are represented as rows of columns. 
		//Input data is in opposite structure, restructuring here 
		var datesList = [];
		var ratesRestrictions = {};
		var roomRateData = [];

		angular.forEach(that.roomTypeRates.results, function(item){
		   	datesList.push(item.date);
		   	console.log(JSON.stringify(item))

		   	//UI requires al-rates separated from daily rates.
		   	ratesRestrictions[item.date] = item.rate_restrictions;

		   	//Adjusting Daily Rate Data - we require rows of colums - not the other way.
		   	for(var ri in item.room_rates){
		   		var rate = item.room_rates[ri];
		   		//Check if this rate is already pushed.
		   		var rateData = null;
		   		for (var i in roomRateData){
	   				if (roomRateData[i].room_type.id == rate.room_type.id)
	   				{
	   		  			rateData = roomRateData[i];
	   		  			//break;
	   				}
		   		}

		   	   	if (rateData === null){
		   	   		rateData = {"room_type": {}};
		   			rateData.room_type = rate.room_type;
		   			roomRateData.push(rateData);
		   		}
		   		var rr = {};
		   		rr.restrictions = rate.restrictions;
		   		rr.single = rate.single;
		   		rr["double"] = rate["double"];
		   		rr.extra_adult = rate.extra_adult;
		   		rr.child = rate.child;

		   		rateData[item.date] = rr;
		   	}

		});

		calendarData.dates = datesList;
		calendarData.rate_restrictions = ratesRestrictions;
		calendarData.data = roomRateData;

		return calendarData;
	};


	this.calculateRateViewCalData = function(){
		var calendarData = {};
		
		// Format restriction Types as required by UI, and make it a dict for easy lookup 
		var formattedRestrictionTypes = {};
		angular.forEach(that.allRestrictionTypes, function(item){
			formattedRestrictionTypes[item.id]= that.getRestrictionUIElements(item);
		});
		calendarData.restriction_types = formattedRestrictionTypes;
		
		// In UI, tables are represented as rows of columns. 
		//Input data is in opposite structure, restructuring here 
		var datesList = [];
		var allRatesData = {};
		var dailyRatesData = [];

		angular.forEach(that.dailyRates.results, function(item){
		   	datesList.push(item.date);

		   	//UI requires al-rates separated from daily rates.
		   	allRatesData[item.date] = item.all_rate_restrictions;

		   	//Adjusting Daily Rate Data - we require rows of colums - not the other way.
		   	for(var ri in item.rates){
		   		var rate = item.rates[ri];
		   		//Check if this rate is already pushed.
		   		var rateData = null;
		   		for (var i in dailyRatesData){
	   				if (dailyRatesData[i].id == rate.id)
	   				{
	   		  			rateData = dailyRatesData[i];
	   		  			//break;
	   				}
		   		}

		   	   	if (rateData === null){
		   			rateData ={
		   				id : rate.id,
		   				name : rate.name
		   			};
		   			dailyRatesData.push(rateData);
		   		}
		   		rateData[item.date] = rate.restrictions;

		   	}

		});

		calendarData.dates = datesList;
		calendarData.all_rates = allRatesData;
		calendarData.data = dailyRatesData;

		return calendarData;
	};

	this.getRestrictionUIElements = function(restriction_type){
		var restriction_type_updated = {};
		//TODO: Add UI condition checks using "restrVal"
		restriction_type_updated.icon = "icon";
		restriction_type_updated.background_class = "bgclass";
		restriction_type_updated.id = restriction_type.id;
		restriction_type_updated.description = restriction_type.description;
		restriction_type_updated.value = restriction_type.value;


		return restriction_type_updated;
	};


}]);