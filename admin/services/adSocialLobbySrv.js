admin.service('ADSocialLobbySrv',['$q', 'ADBaseWebSrv', function($q, ADBaseWebSrv){

   /*
	* service class for Socail Lobby
	*/

   /*
    * getter method to get Socail Lobby details
    * @return {object} Socail Lobby details
    */
	this.fetchSettingsDetails = function(){
		var deferred = $q.defer();
		var url = '/admin/hotel/get_social_lobby_settings.json';

		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

	/*
	* method to save the social lobby settings details
	* @param {object} with social lobby settings details
	*/
	this.saveSocialLobbySettings = function(data){
		var deferred = $q.defer();
		var url = '/admin/hotel/save_social_lobby_settings';

		ADBaseWebSrv.postJSON(url, data).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	}

}]);