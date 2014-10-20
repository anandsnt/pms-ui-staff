admin.service('ADContentManagementSrv',['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2){
   /**
    * To fetch the list of sections
    * @return {object} sections list json
    */
	this.fetch = function(){
		
		var deferred = $q.defer();
		var url = '';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
  
   /*
    * To update section data
    * @param {array} data of the modified section
    * @return {object} status of updated section
    */
	this.updateSection = function(data){

		var deferred = $q.defer();
		var url = '';	
		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
	/*
    * To delete section data
    * @param {array} data of the section to be deleted
    * @return {object} status of deleted section
    */
	this.deleteSection = function(data){

		var deferred = $q.defer();
		var url = '';	
		ADBaseWebSrvV2.deleteJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};

}]);