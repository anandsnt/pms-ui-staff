(function() {
	var checkinRoomUpgradeOptionsService = function($q,$http) {

	var responseData = {};

	//fetch texts to be displayed

	var fetch = function(data) {

		var deferred = $q.defer();
		var url = '/guest_web/upgrade_options.json';
		$http.get(url,{
			params: data
		}).success(function(response) {
			this.responseData = response;
			deferred.resolve(this.responseData);
		}.bind(this))
		.error(function() {
			deferred.reject();
		});
		return deferred.promise;
	};


	return {
		responseData: responseData,
		fetch : fetch
	};
};

var dependencies = [
'$q','$http',
checkinRoomUpgradeOptionsService
];

snt.factory('checkinRoomUpgradeOptionsService', dependencies);
})();