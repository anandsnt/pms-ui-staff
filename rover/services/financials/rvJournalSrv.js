sntRover.service('RVJournalSrv',['$http', '$q', 'BaseWebSrvV2', function($http, $q, BaseWebSrvV2){
   
	this.revenueData = {};
	this.paymentData = {};
	this.fetchRevenueData = function(reservationId){
		var deferred = $q.defer();
		var url = '/staff/reservation/bill_card.json?reservation_id='+reservationId;
			BaseWebSrvV2.getJSON(url).then(function(data) {
				this.revenueData = data;
			   	deferred.resolve(this.revenueData);
			},function(data){
			    deferred.reject(data);
			});	
		return deferred.promise;
	};
   
}]);