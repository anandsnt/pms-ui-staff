admin.service('ADAccountReceivablesSrv',['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2){
   /**
    * To fetch the saved account receivable status
    */
	this.fetch = function(){

		var deferred = $q.defer();
		var url = 'api/billing_groups.json';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/**
    * To update the account receivable status
    */
	this.save = function(){

		var deferred = $q.defer();
		var url = ' /api/billing_groups/charge_codes.json';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

}]);