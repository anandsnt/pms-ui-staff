sntRover.service('RMCalendarSrv',['$q', 'BaseWebSrvV2', function( $q, BaseWebSrvV2){
	
	/*
    * To fetch filter options
    * @return {object} filter options
    */
	this.fetch = function(){
		var deferred = $q.defer();
		var url =  '/sample_json/rate_manager/calendar.json';	
		BaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};


}]);