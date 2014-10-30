sntRover.service('RVJournalSrv',['$http', '$q', 'BaseWebSrvV2','RVBaseWebSrv', function($http, $q, BaseWebSrvV2, RVBaseWebSrv){
   	
   	this.filterData = {};
	this.revenueData = {};
	this.paymentData = {};
	var that = this;
	this.fetchGenericData1 = function(){
		var deferred = $q.defer();
		var url = '/sample_json/journal/journal_common.json';
			BaseWebSrvV2.getJSON(url).then(function(data) {
				this.filterData = data;
				angular.forEach(this.filterData.departments,function(item, index) {
		       		item.checked = false;
		       	});
		       	angular.forEach(this.filterData.employees,function(item, index) {
		       		item.checked = false;
		       	});
			   	deferred.resolve(this.filterData);
			},function(data){
			    deferred.reject(data);
			});	
		return deferred.promise;
	};

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

	this.fetchRevenueData = function(){
		var deferred = $q.defer();
		//var url = '/api/financial_transactions/revenue';
		var url = '/sample_json/journal/journal_revenue.json';
		BaseWebSrvV2.getJSON(url).then(function(data) {
			this.revenueData = data;
		   	deferred.resolve(this.revenueData);
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