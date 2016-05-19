angular.module('sntRover').service('RVBillCardSrv',['$http', '$q', 'BaseWebSrvV2','RVBaseWebSrv', 'rvBaseWebSrvV2', function($http, $q, BaseWebSrvV2, RVBaseWebSrv, rvBaseWebSrvV2){


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

	this.fetchBillPrintData = function(params){
		var deferred = $q.defer();
		var url = 'staff/bills/print_guest_bill';
			RVBaseWebSrv.postJSON(url, params).then(function(data) {
				// Manually creating charge details list & credit deatils list.
				data.charge_details_list = [];
				data.credit_details_list = [];
				angular.forEach(data.fee_details,function(fees, index1){
					angular.forEach(fees.charge_details,function(charge, index2){
						charge.date=fees.date;
						data.charge_details_list.push(charge);
					});
					angular.forEach(fees.credit_details,function(credit, index3){
						credit.date=fees.date;
						data.credit_details_list.push(credit);
					});
				});
		   	 	deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});

		return deferred.promise;
	};

	this.fetchRegistrationCardPrintData = function(params){
		var deferred = $q.defer();
		var url = '/api/reservations/' + params.reservation_id + '/print_registration_card';
			rvBaseWebSrvV2.getJSON(url).then(function(data) {
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

	this.createAnotherBill = function(data){
		var deferred = $q.defer();
		var url = '/api/bills/create_bill';
			BaseWebSrvV2.postJSON(url, data).then(function(data) {
			   	 deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});

		return deferred.promise;
	};

	this.changeHousekeepingStatus = function(data){

		var deferred = $q.defer();
		var url = '/house/change_house_keeping_status.json';
		BaseWebSrvV2.postJSON(url, data).then(function(data) {
		   	 deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});

		return deferred.promise;
	};

	this.completeReverseCheckout = function(data){
		var deferred = $q.defer();
		var url = '/staff/reverse_checkout';
			BaseWebSrvV2.postJSON(url, data).then(function(data) {
			   	 deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});

		return deferred.promise;
	};

	this.toggleHideRate = function( params ){
		var deferred = $q.defer();
		var url = 'api/reservations/'+params.reservation_id+'/hide_rates';
			BaseWebSrvV2.postJSON(url, params).then(function(data) {
			   	 deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});

		return deferred.promise;
	};

	/**
	 * Get the bill settings info for the popup for print/email functionality
	 *
	**/
	this.getBillSettingsInfo = function(params) {

		var deferred = $q.defer();
		var url = '/api/bills/get_settings_info';
			BaseWebSrvV2.getJSON(url, params).then(function(data) {
			   	 deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});

		return deferred.promise;
	};

}]);