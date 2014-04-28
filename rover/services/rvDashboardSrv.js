sntRover.service('RVDashboardSrv',['$q', 'RVBaseWebSrv', function( $q, RVBaseWebSrv){

this.dashboardDetails = {};
	var that = this;

   /*
    * To fetch dashboard details
    * @return {object}late dashboard details
    */	


   this.fetchDashboardDetails = function(){
		var deferred = $q.defer();

		 this.fetchlateCheckoutDetails = function(){
			var deferred = $q.defer();
			var url = 'staff/dashboard/late_checkout_count.json';	
			
			RVBaseWebSrv.getJSON(url).then(function(data) {
				that.dashboardDetails.lateCheckoutDetails = data;
				deferred.resolve(that.dashboardDetails.lateCheckoutDetails);
			},function(errorMessage){
				deferred.reject(errorMessage);
			});
			return deferred.promise;
		};
		var url = '/staff/dashboard.json';	
		
		RVBaseWebSrv.getJSON(url).then(function(data) {
			that.dashboardDetails.dashboardData = data;
			this.fetchlateCheckoutDetails();
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};


   }]);