sntRover.service('RVBillCardSrv',['$http', '$q', 'BaseWebSrvV2','RVBaseWebSrv', function($http, $q, BaseWebSrvV2, RVBaseWebSrv){
   
	
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
			RVBaseWebSrv.postJSON(url, data).then(function(data) {
			   	 deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});	

		return deferred.promise;
	};
	
	this.completeCheckout = function(data){
		var deferred = $q.defer();
		var url = '/staff/checkout';
			RVBaseWebSrv.postJSON(url, data).then(function(data) {
			   	 deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});	

		return deferred.promise;
	};

   /*
	 * Service function to edit transaction
	 */

	this.transactionEdit = function(data){
	
		var deferred = $q.defer();
		var trasactionId = data.id;
		var updatedDate  = data.updatedDate;
		var url = 'api/financial_transactions/'+trasactionId;
		BaseWebSrvV2.putJSON(url, updatedDate).then(function(data) {
		   	 deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	

		return deferred.promise;
	};


  /*
	 * Service function to delete transaction
	 */

	this.transactionDelete = function(deleteData){

		var deferred = $q.defer();
		var trasactionId = deleteData.id;
		var url = 'api/financial_transactions/'+trasactionId;
		BaseWebSrvV2.putJSON(url, deleteData.data).then(function(data) {
		   	 deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	

		return deferred.promise;
	};
 /*
	 * Service function to split transaction
	 */

	this.transactionSplit = function(splitData){
		var deferred = $q.defer();
		var trasactionId = splitData.id;
		var url = 'api/financial_transactions/'+trasactionId;
		BaseWebSrvV2.putJSON(url, splitData.data).then(function(data) {
		   	 deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
	
   
}]);