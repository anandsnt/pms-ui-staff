sntRover.service('RVDashboardSrv',['$q', 'RVBaseWebSrv', 'rvBaseWebSrvV2', function( $q, RVBaseWebSrv, rvBaseWebSrvV2){

 /*
  * To fetch user details
  * @return {object} user details
  */	
	this.fetchUserInfo = function(){
		var deferred = $q.defer();
		var url =  '/api/rover_header_info.json';	
		
		RVBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};



	this.dashBoardDetails = {};
	var that = this;

	this.fetchDashboardStatisticData = function(deferred){
		//var url = '/ui/show?format=json&json_input=dashboard/dashboard.json';
		var url = '/api/dashboards';
		rvBaseWebSrvV2.getJSON(url).then(function(data) {
			that.dashBoardDetails.dashboardStatistics = data;
			deferred.resolve(that.dashBoardDetails);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;		
	};
   /*
    * To fetch dashboard details
    * @return {object} dashboard details
    */	
   	this.fetchDashboardDetails = function(){
		var deferred = $q.defer();
		var self = this;

   /*
    * To fetch user details
    * @return {object} user details
    */	
		 self.fetchUserDetails = function(){
			var url = '/api/rover_header_info.json';
			RVBaseWebSrv.getJSON(url).then(function(data) {
				that.dashBoardDetails.userDetails = data;
				that.fetchDashboardStatisticData(deferred);
			},function(errorMessage){
				deferred.reject(errorMessage);
			});
			return deferred.promise;
		};		

		var url = '/api/hotel_statistics.json';
			
		
		RVBaseWebSrv.getJSON(url).then(function(data) {
			that.dashBoardDetails.dashboardData = data;
			self.fetchUserDetails();
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

	this.fetchHotelDetails = function(){
		var deferred = $q.defer();
		var url = '/api/hotel_settings.json';
		RVBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

}]);