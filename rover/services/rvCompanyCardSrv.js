sntRover.service('RVCompanyCardSrv',['$q', 'rvBaseWebSrvV2', function($q, rvBaseWebSrvV2){
	
	var self = this;
	
	/** contact information area */

	/**
	* service function used to retreive contact information against a accound id
	*/
	this.fetchContactInformation = function(data){
		var id = data.id;
		var deferred = $q.defer();		
		var url =  '/api/accounts/'+id;			
		rvBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;				
	};


	/**
	* service function used to save the contact information
	*/
	this.saveContactInformation = function(data){
		var deferred = $q.defer();		
		var url =  'api/accounts/save.json';			
		rvBaseWebSrvV2.postJSON(url, data).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	}

	/** end of contact information area */
		
	this.fetchContractsList = function(data){
		var deferred = $q.defer();		
		//var url =  '/sample_json/contracts/rvCompanyCardContractsList.json';	
		var url = '/api/accounts/'+data.account_id+'/contracts';
		rvBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;		
	};
	
	this.fetchContractsDetails = function(data){
		var deferred = $q.defer();		
		//var url =  '/sample_json/contracts/rvCompanyCardContractsDetails.json';	
		var url = '/api/accounts/'+data.account_id+'/contracts/'+data.contract_id;
		rvBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;		
	};
	
	/**
	* service function used to update the contracts
	*/
	this.updateContract = function(data){
		var deferred = $q.defer();		
		var url =	'/api/accounts/'+data.account_id+'/contracts/'+data.contract_id;
		rvBaseWebSrvV2.putJSON(url, data.postData).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	}
	
	/**
	* service function used to add new contracts
	*/
	this.addNewContract = function(data){
		var deferred = $q.defer();		
		var url = '/api/accounts/'+data.account_id+'/contracts';	
		rvBaseWebSrvV2.postJSON(url, data.postData).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	}
	
	this.updateNight = function(data){
		var deferred = $q.defer();		
		var url = '/api/accounts/'+data.account_id+'/contracts/'+data.contract_id+'contract_nights';
		rvBaseWebSrvV2.postJSON(url, data.postData).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	}
	

}]);