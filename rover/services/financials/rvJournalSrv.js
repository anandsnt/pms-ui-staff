sntRover.service('RVJournalSrv',['$http', '$q', 'BaseWebSrvV2','RVBaseWebSrv', function($http, $q, BaseWebSrvV2, RVBaseWebSrv){
   	
   	this.filterData = {};
	this.revenueData = {};
	this.paymentData = {};
	var that = this;

 	// get filter details
    this.fetchGenericData = function () {
        var deferred = $q.defer();
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
                deferred.resolve(that.filterData);
                console.log(that.filterData);
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

	this.fetchRevenueData = function(params){
		var deferred = $q.defer();
		//var url = '/api/financial_transactions/revenue?from_date='+params.from+'&to_date='+params.to;
		var url = '/sample_json/journal/journal_revenue.json';
		BaseWebSrvV2.getJSON(url).then(function(data) {
			this.revenueData = data;
			// Adding Show status flag to each item.
			angular.forEach(this.revenueData.charge_groups,function(charge_groups, index1) {
				charge_groups.show = true ;
	            angular.forEach(charge_groups.charge_codes,function(charge_codes, index2) {
	            	charge_codes.show = false ;
	                angular.forEach(charge_codes.transactions,function(transactions, index3) {
	                	transactions.show = false;
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
		var url = '/sample_json/journal/journal_payments.json';
		BaseWebSrvV2.getJSON(url).then(function(data) {
			this.paymentData = data;
			// Adding Show status flag to each item.
			angular.forEach(this.paymentData.payment_types,function(payment_types, index1) {
				payment_types.show = true ;
				if(payment_types.payment_type == "Credit Card"){
		            angular.forEach(payment_types.credit_cards,function(credit_cards, index2) {
		            	credit_cards.show = false ;
		                angular.forEach(credit_cards.transactions,function(transactions, index3) {
		                	transactions.show = false;
		                });
		            });
	        	}
	        	else{
	        		angular.forEach(payment_types.transactions,function(transactions, index3) {
	                	transactions.show = false;
	                });
	        	}
	        });
	        console.log(this.paymentData);
		   	deferred.resolve(this.paymentData);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};

	this.fetchCashierData = function(){
		var deferred = $q.defer();
		var url = '/sample_json/journal/journal_cashier.json';
			BaseWebSrvV2.getJSON(url).then(function(data) {
			   	deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});	
		return deferred.promise;
	};

	this.fetchCashierDetails = function(url){
		var deferred = $q.defer();	
		BaseWebSrvV2.getJSON(url).then(function(data) {
			   	deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});	
		return deferred.promise;
	};
   
}]);