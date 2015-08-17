(function() {
	var guestDetailsService = function($q,$http,$rootScope) {

	var responseData = {};

	//fetch texts to be displayed

	var postGuestDetails = function(data) {
		var deferred = $q.defer();
		var url = '/guest_web/guest_details/'+$rootScope.reservationID;
		$http.put(url,data).success(function(response) {
			this.responseData = response;
			deferred.resolve(this.responseData);
		}.bind(this))
		.error(function() {
			deferred.reject();
		});
		return deferred.promise;
	};

	var getGuestDetails = function() {

		var deferred = $q.defer();
		var url = '/guest_web/guest_details/'+$rootScope.reservationID+'.json';
		$http.get(url).success(function(response) {
			deferred.resolve(response);
		}.bind(this))
		.error(function() {
			deferred.reject();
		});
		return deferred.promise;
	};

	var fetchCountryList = function(){
		var deferred = $q.defer();
		var url = '/ui/country_list';
		$http.get(url).success(function(response) {
			deferred.resolve(response);
		}.bind(this))
		.error(function() {
			deferred.reject();
		});
		return deferred.promise;
	};

	return {
	responseData: responseData,
	postGuestDetails : postGuestDetails,
	getGuestDetails:getGuestDetails,
	fetchCountryList:fetchCountryList
	}
};

var dependencies = [
'$q','$http','$rootScope',
guestDetailsService
];

snt.factory('guestDetailsService', dependencies);
})();