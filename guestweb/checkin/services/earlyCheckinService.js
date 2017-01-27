(function() {
	var earlyCheckinService = function($q, $http) {

	var responseData = {};

	// apply late checkout

	var applyEarlyCheckin = function(data) {

		var deferred = $q.defer();
		var url = '/api/reservations/apply_early_checkin_offer';

		$http.post(url, data).then(function(response) {
			this.responseData = response.data;
			deferred.resolve(this.responseData);
		}, function() {
			deferred.reject();
		});
		return deferred.promise;
	};


	return {
		responseData: responseData,
		applyEarlyCheckin: applyEarlyCheckin
	};
};

var dependencies = [
'$q', '$http',
earlyCheckinService
];

sntGuestWeb.factory('earlyCheckinService', dependencies);
})();