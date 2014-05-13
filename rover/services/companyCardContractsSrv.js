sntRover.service('companyCardContractsSrv',['$q', 'RVBaseWebSrv', function( $q, RVBaseWebSrv){

 	/*
    * To fetch user details
    * @return {object} user details
    */	
    var self = this;
	this.fetch = function(){
		var deferred = $q.defer();
		var url =  '/sample_json/contracts/rvCompanyCardContracts.json';	
		RVBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

}]);