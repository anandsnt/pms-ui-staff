sntRover.service('RVJournalSrv',['$http', '$q', 'BaseWebSrvV2','RVBaseWebSrv','$rootScope', function($http, $q, BaseWebSrvV2, RVBaseWebSrv,$rootScope){
   	
   	this.filterData = {};
	this.revenueData = {};
	this.paymentData = {};
	var that = this;

 	// get filter details
    this.fetchGenericData = function () {
        var deferred = $q.defer();

        that.fetchCashiers = function () {
            var url = "/api/cashier_periods";
            var data = {'date':$rootScope.businessDate}
            BaseWebSrvV2.getJSON(url,data).then(function (data) {
                that.filterData.cashiers = data.cashiers;
                that.filterData.selectedCashier = data.current_user_id;
                that.filterData.loggedInUserId 	= data.current_user_id;
                that.filterData.cashierStatus = data.status;
                deferred.resolve(that.filterData);
            }, function (data) {
                deferred.reject(data);
            });
        };
        /*
         * Service function to fetch departments
         * @return {object} departments
         */
        that.fetchDepartments = function () {
            var url = "/admin/departments.json";
            RVBaseWebSrv.getJSON(url).then(function (data) {
                that.filterData.departments = data.departments;
                angular.forEach(that.filterData.departments,function(item, index) {
		       		item.checked = false;
		       		item.id = item.value;
		       		delete item.value;
		       	});
                that.fetchCashiers();
            }, function (data) {
                deferred.reject(data);
            });
        };

        // fetch employees deatils
        var url = "/api/users/active.json?journal=true";
        BaseWebSrvV2.getJSON(url).then(function (data) {
            that.filterData.employees = data;
            angular.forEach(that.filterData.employees,function(item, index) {
	       		item.checked = false;
	       		item.name = item.full_name;
	       		delete item.full_name;
	       		delete item.email;
	       	});
            that.fetchDepartments();
        }, function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };


    /*********************************************************************************************

    Flags used for REVENUE DATA and PAYMENTS DATA.

	# All flags are of type boolean true/false.

     	'active': 	Used for Expand / Collapse status of each tabs on Level1 and Level2.
    			Initially everything will be collapsed , so setting as false.

    ***********************************************************************************************/

	this.fetchRevenueDataByChargeGroups = function(params){
		var deferred = $q.defer();
		var url = '/api/financial_transactions/revenue_by_charge_groups?from_date='+params.from+'&to_date='+params.to+'&charge_group_id='+params.charge_group_id;
		
		BaseWebSrvV2.getJSON(url).then(function(data) {
			
			angular.forEach(data.charge_groups,function(charge_groups, index1) {
				charge_groups.active = false;
	        });

		   	deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};

	this.fetchRevenueDataByChargeCodes = function(params){
		var deferred = $q.defer();
		var url = '/api/financial_transactions/revenue_by_charge_codes?from_date='+params.from+'&to_date='+params.to+'&charge_group_id='+params.charge_group_id+'&charge_code_id='+params.charge_code_id;
		
		BaseWebSrvV2.getJSON(url).then(function(data) {

            angular.forEach(data.charge_codes,function(charge_codes, index2) {
            	charge_codes.active = false;
            });
	        
		   	deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};

	this.fetchRevenueDataByTransactions = function(params){
		var deferred = $q.defer();
		var url = '/api/financial_transactions/revenue_by_transactions';
		
		BaseWebSrvV2.postJSON(url,params).then(function(data) {
		   	deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};

	this.fetchPaymentDataByPaymentTypes = function(params){
		var deferred = $q.defer();
		var url = '/api/financial_transactions/payments_by_payment_types?from_date='+params.from+'&to_date='+params.to;

		BaseWebSrvV2.getJSON(url).then(function(data) {
			
			angular.forEach(data.payment_types,function(payment_types, index1) {

				payment_types.active = false ;

				if(payment_types.payment_type == "Credit Card"){
		            angular.forEach(payment_types.credit_cards,function(credit_cards, index2) {
		            	credit_cards.active = false ;
		            });
	        	}
	        });
		   	deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};

	this.fetchPaymentDataByTransactions = function(params){
		var deferred = $q.defer();
		var url = '/api/financial_transactions/payments_by_transactions';
		
		BaseWebSrvV2.postJSON(url,params).then(function(data) {
		   	deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};

	this.fetchCashierDetails = function(data){
		var deferred = $q.defer();	
		var url ='/api/cashier_periods/history';
		BaseWebSrvV2.postJSON(url,data).then(function(data) {
			   	deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});	
		return deferred.promise;
	};

	this.reOpenCashier = function(updateData){
		var deferred = $q.defer();	
		var url ='/api/cashier_periods/'+updateData.id+'/reopen';
		BaseWebSrvV2.postJSON(url).then(function(data) {
			   	deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});	
		return deferred.promise;
	};

	this.closeCashier = function(updateData){
		var deferred = $q.defer();	
		var url ='/api/cashier_periods/'+updateData.id+'/close';
		BaseWebSrvV2.postJSON(url,updateData.data).then(function(data) {
			   	deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});	
		return deferred.promise;
	};
   
}]);