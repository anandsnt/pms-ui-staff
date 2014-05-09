sntRover.service('RMCalendarSrv',['$q', 'BaseWebSrvV2', function( $q, BaseWebSrvV2){
	
	/*
    * To fetch filter options
    * @return {object} filter options
    */
	this.fetch = function(){
		console.log("fetcj");
		var deferred = $q.defer();
		var url =  '/sample_json/rate_manager/calendar.json';	
		BaseWebSrvV2.getJSON(url).then(function(data) {
			console.log("succcess");
			deferred.resolve(data);
		},function(data){
			console.log("failue");
			deferred.reject(data);
		});
		return deferred.promise;
	};


}]);