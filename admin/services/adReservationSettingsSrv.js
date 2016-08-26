admin.service('ADReservationSettingsSrv',['$q', 'ADBaseWebSrvV2', function($q, ADBaseWebSrvV2){


   /**
    * To fetch the reservation settings data
    * @return {object} reservation settings data
    */
	this.fetchReservationSettingsData = function(){

		var deferred = $q.defer();
		var url = '/api/hotel_settings/show_hotel_reservation_settings';
		ADBaseWebSrvV2.getJSON(url).then(function(data) {
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
		var url = '/api/hotel_settings/save_hotel_reservation_settings';
		ADBaseWebSrvV2.postJSON(url,data).then(function(data) {
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
    this.canDisableSuite = function(data){

        var deferred = $q.defer();
        var url = '/api/hotel_settings/can_disable_suite ';
        ADBaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data);
        },function(data){
            deferred.reject(data);
        });
        return deferred.promise;
    };

}]);