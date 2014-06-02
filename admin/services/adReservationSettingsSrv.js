admin.service('ADReservationSettingsSrv',['$q', 'ADBaseWebSrvV2', function($q, ADBaseWebSrvV2){
	

	this.reservationSettingsData = {};
	var that = this;
   /**
    * To fetch the reservation settings data
    * @return {object} reservation settings data
    */
	this.fetchReservationSettingsData = function(){
		
		var deferred = $q.defer();

		this.fetchDefaultRateDisplays = function(){
	
			//TO DO: change path
			var url = '/api/hotel_settings/show_hotel_reservation_settings';
			ADBaseWebSrvV2.getJSON(url).then(function(data) {
				that.reservationSettingsData.defaultRateDisplays = data;
			    deferred.resolve(that.reservationSettingsData);
			},function(data){
			    deferred.reject(data);
			});	
			return deferred.promise;
		};


		var url = '/api/hotel_settings/show_hotel_reservation_settings';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			//TO DO: uncommnent line below
			//this.fetchDefaultRateDisplays();
			//TO DO: delete below 2 lines
			that.reservationSettingsData.data = data;
		    deferred.resolve(that.reservationSettingsData);
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

}]);