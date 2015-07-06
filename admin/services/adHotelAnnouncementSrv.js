admin.service('ADHotelAnnouncementSrv',['$q', 'ADBaseWebSrv', function($q, ADBaseWebSrv){
   
   /*
	* service class for hotel announcement settings
	*/

   /*
    * getter method to hotel announcement settings
    * @return {object} hotel announcement settings details
    */
	this.fetchSettingsDetails = function(){
		var deferred = $q.defer();
		var url = '/admin/hotel/get_announcements_settings.json';
		
		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

	/*
	* method to save the announcement settings details
	* @param {object} with announcement settings details
	*/
	this.saveAnnoucementSettings = function(data){
		var deferred = $q.defer();
		var url = '/admin/hotel/save_announcements_settings';
		
		ADBaseWebSrv.postJSON(url, data).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	}

}]);