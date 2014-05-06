sntRover.service('RVDashboardSrv',['$q', 'RVBaseWebSrv', function( $q, RVBaseWebSrv){

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
			var url = '/api/rover_header_info.json'
			RVBaseWebSrv.getJSON(url).then(function(data) {
				that.dashBoardDetails.userDetails = data;
				deferred.resolve(that.dashBoardDetails);
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


   }]);