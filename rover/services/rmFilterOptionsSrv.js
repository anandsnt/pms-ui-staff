sntRover.service('RMFilterOptionsSrv',['$q', 'RVBaseWebSrv', function( $q, RVBaseWebSrv){
	
	/*
    * To fetch filter options
    * @return {object} filter options
    */
	this.fetch = function(){
			var deferred = $q.defer();
			var url =  '/sample_json/filter_options/filter_options.json';	
			RVBaseWebSrv.getJSON(url).then(function(data) {
				deferred.resolve(data);
			},function(data){
				deferred.reject(data);
			});
			return deferred.promise;
	};


}]);