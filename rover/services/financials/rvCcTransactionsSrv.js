sntRover.service('RVccTransactionsSrv',['$http', '$q', 'BaseWebSrvV2','RVBaseWebSrv','$rootScope', function($http, $q, BaseWebSrvV2, RVBaseWebSrv,$rootScope){

	var that = this;

 	// get authorization data
    this.fetchAuthData = function (params) {
        var deferred = $q.defer();
        var url = "/api/cc?type=authorization";
        BaseWebSrvV2.getJSON(url).then(function (data) {

        	data.approved.active = false;
			data.declined.active = false;
			data.reversals.active = false;

       		angular.forEach(data.approved,function(item, index) {
	       		item.active = false;
	       	});
			angular.forEach(data.declined,function(item, index) {
	       		item.active = false;
	       	});
			angular.forEach(data.reversals,function(item, index) {
	       		item.active = false;
	       	});

            deferred.resolve(data);
        }, function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    /*
     * Service function to fetch payments
     * @return {object} payments
     */
    that.fetchPayments = function (params) {
    	var deferred = $q.defer();
    	if(typeof params.date === 'undefined' || params.date === ""){
    		params.date = $rootScope.businessDate;
    	}
    	var url = "/api/cc?date="+params.date;
        BaseWebSrvV2.getJSON(url).then(function (data) {

            data.approved.active = false;
			data.declined.active = false;

       		angular.forEach(data.approved,function(item, index) {
	       		item.active = false;
	       	});
			angular.forEach(data.declined,function(item, index) {
	       		item.active = false;
	       	});

			deferred.resolve(data);

        }, function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    /*
     * Service function to post batch settle
     * @return {object} payments
     */
    that.submitBatch = function () {
        var deferred = $q.defer();
        var url = "/api/cc/batch_settle";

        BaseWebSrvV2.postJSON(url).then(function (data) {
            deferred.resolve(data);
        }, function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

}]);