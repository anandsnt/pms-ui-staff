sntRover.service('RateMngrCalendarSrv',['$q', 'BaseWebSrvV2', function( $q, BaseWebSrvV2){
	var that = this;

	/**
    * To fetch All Calendar data
    */
	this.fetchCalendarData = function(){
		var deferred = $q.defer();

		var getDailyRates = function(){
			//TODO:URL
			var url =  '/sample_json/rate_manager/daily_rates.json';	
			BaseWebSrvV2.getJSON(url).then(function(data) {
				that.dailyRates = data; 
				var calendarData = that.calculateCalendarData();
			console.log(JSON.stringify(calendarData));
				//TODO: Return correct val
				deferred.resolve(calendarData);
			},function(data){
				deferred.reject(data);
			});

		}

		var url =  '/sample_json/rate_manager/restriction_types.json';	
		BaseWebSrvV2.getJSON(url).then(function(data) {
			that.allRestrictionTypes = data; 
			console.log(that.allRestrictionTypes);
			getDailyRates();
		},function(data){
			deferred.reject(data);

		});
		return deferred.promise;


	}

	this.calculateCalendarData = function(){
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
			console.log("Dates loop");
		   	datesList.push(item.date);

		   	//UI requires al-rates separated from daily rates.
		   	allRatesData[item.date] = item.all_rate_restrictions;

		   	//Adjusting Daily Rate Data - we require rows of colums - not the other way.
		   	for(var ri in item.rates){
		   		var rate = item.rates[ri];
		   		console.log("rates loop");
		   		//Check if this rate is already pushed.
		   		var rateData = null;
		   		for (var i in dailyRatesData){
	   				if (dailyRatesData[i].id == rate.id)
	   				{
	   					console.log("Found item");
	   		  			rateData = dailyRatesData[i];
	   		  			//break;
	   				}
		   		}

		   	   	if (rateData === null){
		   	   		console.log("RateData is null");
		   			rateData ={
		   				id : rate.id,
		   				name : rate.name
		   			};
		   			dailyRatesData.push(rateData);
		   		}
		   		console.log("Pushing Restrictions");
		   		rateData[item.date] = rate.restrictions;
		   		console.log(rateData);
		   		console.log(dailyRatesData);

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

		return restriction_type_updated;
	};


}]);