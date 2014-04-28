sntRover.service('RVDashboardSrv',['$q', 'RVBaseWebSrv', function( $q, RVBaseWebSrv){

this.dashboardDetails = {};
	var that = this;

   /*
    * To fetch dashboard details
    * @return {object} dashboard details
    */	


   this.fetchDashboardDetails = function(){
		var deferred = $q.defer();


   /*
    * To fetch user details
    * @return {object} user details
    */	
		 this.fetchdashboardDetails = function(){
			var url = 'staff/header_info.json'
			RVBaseWebSrv.getJSON(url).then(function(data) {
				that.dashboardDetails.userDetails = data;
				this.fetchlateCheckoutDetails();
			},function(errorMessage){
				deferred.reject(errorMessage);
			});
			return deferred.promise;
		};
   /*
    * To fetch late checkout details
    * @return {object}late checkout details
    */

		 this.fetchlateCheckoutDetails = function(){
			var url = 'staff/dashboard/late_checkout_count.json';	
			
			RVBaseWebSrv.getJSON(url).then(function(data) {
				that.dashboardDetails.lateCheckoutDetails = data;
				deferred.resolve(that.dashboardDetails);
			},function(errorMessage){
				deferred.reject(errorMessage);
			});
			return deferred.promise;
		};
		

		var url = '/staff/dashboard.json';
			
		
		RVBaseWebSrv.getJSON(url).then(function(data) {
			that.dashboardDetails.dashboardData = data;
			this.fetchdashboardDetails();
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};


   }]);