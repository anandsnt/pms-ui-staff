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


	this.getAdvanceBill = function(data){
		var deferred = $q.defer();
		var url = 'api/reservations/'+data.id+'/advance_bill';
			RVBaseWebSrv.postJSON(url).then(function(data) {
				deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});	

		return deferred.promise;
	};
   /*
	 * Service function to edit transaction
	 * @method PUT
	 * @param {object} data
	 * @return {object} defer promise
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
	 * @method PUT
	 * @param {object} data
	 * @return {object} defer promise
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
	* @method PUT
	* @param {object} data
	* @return {object} defer promise
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

	/*
		* Get the list of charge codes
		* @method GET
		* @return {object} defer promise
		*/
	this.fetchChargeCodes = function() {
		
		var deferred = $q.defer();
		var url = '/api/charge_codes';
			BaseWebSrvV2.getJSON(url).then(function(data) {
			   	 deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});	

		return deferred.promise;
	};
	
	this.sendEmail = function(data){
		var deferred = $q.defer();
		var url = 'api/reservations/email_guest_bill.json';
			BaseWebSrvV2.postJSON(url, data).then(function(data) {
			   	 deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});	

		return deferred.promise;
	};
	
   
}]);