admin.service('ADReservationTypesSrv',['$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function( $q, ADBaseWebSrv, ADBaseWebSrvV2){
   /*
    * To fetch hotel likes
    * @return {object}late checkout upsell details
    */


    this.fetch = function(){
    	var deferred = $q.defer();
    	var url = '/api/reservation_types.json';
    	
    	ADBaseWebSrvV2.getJSON(url).then(function(data) {
    		deferred.resolve(data);
    	},function(errorMessage){
    		deferred.reject(errorMessage);
    	});
    	return deferred.promise;
    };


	  /*
     * To add new feature
     * @param {object} new upsell details
     */
     this.save = function(data){
     	var deferred = $q.defer();
     	var url = '/api/reservation_types/activate';
     	
     	ADBaseWebSrvV2.postJSON(url,data).then(function(data) {
     		deferred.resolve(data);
     	},function(data){
     		deferred.reject(data);
     	});
     	return deferred.promise;
     };

	  
}]);