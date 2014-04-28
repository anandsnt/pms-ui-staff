sntRover.service('RVDashboardSrv',['$q', 'RVBaseWebSrv', function( $q, RVBaseWebSrv){
   /*
    * To fetch dashboard details
    * @return {object}late dashboard details
    */	


   this.fetchDashboardDetails = function(){
		var deferred = $q.defer();
		var url = '/staff/dashboard.json';	
		
		RVBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};


   }]);