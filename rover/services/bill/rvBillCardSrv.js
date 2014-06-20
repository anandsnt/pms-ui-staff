sntRover.service('RVBillCardSrv',['$http', '$q', 'BaseWebSrvV2', function($http, $q, BaseWebSrvV2){
   
	
	this.fetch = function(reservationId){
		var deferred = $q.defer();
		var url = '/staff/reservation/bill_card.json?reservation_id='+reservationId;
			BaseWebSrvV2.getJSON(url).then(function(data) {
				
			   	 deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});	

		return deferred.promise;
	};
	
	this.movetToAnotherBill = function(data){
		var deferred = $q.defer();
		var url = '/staff/bills/transfer_transaction';
			BaseWebSrvV2.postJSON(url, data).then(function(data) {
				
			   	 deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});	

		return deferred.promise;
	};
	
	this.completeCheckin = function(data){
		var deferred = $q.defer();
		var url = '/staff/checkin';
			BaseWebSrvV2.postJSON(url, data).then(function(data) {
			   	 deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});	

		return deferred.promise;
	};
	
   
}]);