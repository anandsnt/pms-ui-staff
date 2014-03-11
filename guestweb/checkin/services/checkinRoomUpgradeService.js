(function() {
	var checkinRoomUpgradeService = function($q,baseWebService,$rootScope) {
		
		var responseData = {};


		//fetch texts to be displayed

		var post = function(data) {
			
			var deferred = $q.defer();

			var url = '/guest_web/upgrade_room.json';
	
			baseWebService.post(url,data).then(function(response) {

				this.responseData = response;
				deferred.resolve(this.responseData);
			});
			

			return deferred.promise;
		};
		


		return {
			responseData: responseData,
			post : post
		}
	};

	var dependencies = [
	'$q','baseWebService','$rootScope',
	checkinRoomUpgradeService
	];

	snt.factory('checkinRoomUpgradeService', dependencies);
})();