(function() {
	var earlyCheckinService = function($q,$http) {

	var responseData = {};

	//apply late checkout

	var applyEarlyCheckin = function(data) {

		var deferred = $q.defer();
		var url = '/api/reservations/apply_early_checkin_offer';
		$http.post(url, data).success(function(response) {
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
		applyEarlyCheckin : applyEarlyCheckin
	};
};

var dependencies = [
'$q','$http',
earlyCheckinService
];

snt.factory('earlyCheckinService', dependencies);
})();