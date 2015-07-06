admin.service('ADEmailBlackListSrv',['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2){
   /**
    * To fetch the list of blacklisted email
    */
	this.fetch = function(){
		
		var deferred = $q.defer();
		var url = '/api/hotels/get_black_listed_emails.json';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	
  
	/*
    * To create blacklisted email
    */
	this.saveBlackListedEmail = function(data){

		var deferred = $q.defer();
		var url = '/api/hotels/save_blacklisted_emails.json';
		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
   
	/*
    * To delete billing group data
    */
	this.deleteBlacklistedEmail= function(id){

		var deferred = $q.defer();
		var url = '/api/hotels/'+id+'/delete_email.json';
		ADBaseWebSrvV2.deleteJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

}]);