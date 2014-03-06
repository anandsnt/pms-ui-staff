(function() {
	var checkinRoomUpgradeOptionsService = function($q,baseWebService,$rootScope) {
		
		var responseData = {};


		//fetch texts to be displayed

		var fetch = function(data) {
			
			var deferred = $q.defer();

			var url = '/guest_web/upgrade_options.json';
	
			baseWebService.fetch(url,data).then(function(response) {

				this.responseData = response;
				deferred.resolve(this.responseData);
			});
			

			return deferred.promise;
		};


		return {
			responseData: responseData,
			fetch : fetch
		}
	};

	var dependencies = [
	'$q','baseWebService','$rootScope',
	checkinRoomUpgradeOptionsService
	];

	snt.factory('checkinRoomUpgradeOptionsService', dependencies);
})();