admin.service('ADReservationSettingsSrv',['$q', 'ADBaseWebSrv', function($q, ADBaseWebSrv){
	
   /**
    * To fetch the reservation settings data
    * @return {object} reservation settings data
    */
	this.fetchReservationSettingsData = function(){
		
		var deferred = $q.defer();
		var url = '/admin/users.json';

		ADBaseWebSrv.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};

  /**
    * Service function to update reservation settings
    * @return {object} status of update
    */
	this.saveChanges = function(data){

		var deferred = $q.defer();
		var url = '/admin/hotel_brands/'+id;	
		ADBaseWebSrv.putJSON(url,data).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

}]);