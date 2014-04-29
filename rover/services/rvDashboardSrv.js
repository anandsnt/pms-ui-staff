sntRover.service('RVDashboardSrv',['$q', 'RVBaseWebSrv', function( $q, RVBaseWebSrv){

this.dashboardDetails = {};
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
		 self.fetchuserDetails = function(){
			var url = '/api/rover_header_info.json'
			RVBaseWebSrv.getJSON(url).then(function(data) {
				that.dashboardDetails.userDetails = data;
				self.fetchlateCheckoutDetails();
			},function(errorMessage){
				deferred.reject(errorMessage);
			});
			return deferred.promise;
		};
   /*
    * To fetch late checkout details
    * @return {object}late checkout details
    */

		 self.fetchlateCheckoutDetails = function(){
			var url = '/staff/dashboard/late_checkout_count.json';	
			
			RVBaseWebSrv.getJSON(url).then(function(data) {
				that.dashboardDetails.lateCheckoutDetails = data;
				deferred.resolve(that.dashboardDetails);
			},function(errorMessage){
				deferred.reject(errorMessage);
			});
			return deferred.promise;
		};
		

		var url = '/api/hotel_statistics.json';
			
		
		RVBaseWebSrv.getJSON(url).then(function(data) {
			that.dashboardDetails.dashboardData = data;
			self.fetchuserDetails();
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};


   }]);