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
        var url = "/api/users/active.json";
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

    'show' 	: 	Used to show / hide each items on Level1 , Level2 and Level 3.
    			We will set this flag as true initially.
    			While apply Department/Employee filter we will set this flag as false
    			for the items we dont want to show.

    'filterFlag': Used to show / hide Level1 and Level2 based on filter flag applied on print box.
    			Initially it will be true for all items.

    'active': 	Used for Expand / Collapse status of each tabs on Level1 and Level2.
    			Initially everything will be collapsed , so setting as false.

    ***********************************************************************************************/

	this.fetchRevenueData = function(params){
		var deferred = $q.defer();
		var url = '/api/financial_transactions/revenue?from_date='+params.from+'&to_date='+params.to;
		//var url = '/sample_json/journal/journal_revenue.json';
		BaseWebSrvV2.getJSON(url).then(function(data) {
			this.revenueData = data;
			/* 
			 *	Initializing 'calculatedTotalAmount' as total_revenue value from api.
			 * 	It will update while we apply filters.
			 */
			this.revenueData.calculatedTotalAmount = data.total_revenue;

			angular.forEach(this.revenueData.charge_groups,function(charge_groups, index1) {
				
				// Adding Show/filterFlag/active status flag to each item.
				charge_groups.filterFlag = true;
				charge_groups.show 	 = true;
				charge_groups.active = false;

	            angular.forEach(charge_groups.charge_codes,function(charge_codes, index2) {

	            	// Adding Show/filterFlag/active status flag to each item.
	            	charge_codes.filterFlag = true;
	            	charge_codes.show   = true;
	            	charge_codes.active = false;

	                angular.forEach(charge_codes.transactions,function(transactions, index3) {
	                	transactions.show = true;
	                });
	            });
	        });
		   	deferred.resolve(this.revenueData);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};

	this.fetchPaymentData = function(params){
		var deferred = $q.defer();
		//var url = '/api/financial_transactions/payments?date='+params.date;
		var url = '/api/financial_transactions/payments?from_date='+params.from+'&to_date='+params.to;
		//var url = '/sample_json/journal/journal_payments.json';
		BaseWebSrvV2.getJSON(url).then(function(data) {
			this.paymentData = data;
			/* 
			 *	Initializing 'calculatedTotalAmount' as total_payment value from api.
			 * 	It will update while we apply filters.
			 */
			this.paymentData.calculatedTotalAmount = data.total_payment;
			
			angular.forEach(this.paymentData.payment_types,function(payment_types, index1) {

				// Adding Show/filterFlag/active status flag to each item.
				payment_types.filterFlag = true ;
				payment_types.show = true ;
				payment_types.active = false ;

				if(payment_types.payment_type == "Credit Card"){

					//	payment_types.amount will not provide by api for "Credit Card".
					var cardsTotal = 0;

		            angular.forEach(payment_types.credit_cards,function(credit_cards, index2) {
		            	
		            	// Adding Show/filterFlag/active status flag to each item.
		            	credit_cards.filterFlag = true;
		            	credit_cards.show = true ;
		            	credit_cards.active = false ;

		            	// 	To calculate total of amounts in credit cards array.
		            	cardsTotal += credit_cards.amount;

		                angular.forEach(credit_cards.transactions,function(transactions, index3) {
		                	transactions.show = true;
		                });
		            });
		            // Declaring "payment_types.amount" with calculated cardsTotal value.
		            payment_types.amount = cardsTotal;
	        	}
	        	else{
	        		angular.forEach(payment_types.transactions,function(transactions, index3) {
	                	transactions.show = true;
	                });
	        	}
	        });
		   	deferred.resolve(this.paymentData);
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