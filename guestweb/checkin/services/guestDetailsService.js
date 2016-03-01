(function() {
	var guestDetailsService = function($q,$http,$rootScope) {

	var responseData = {};

	var postGuestDetails = function(data) {
		var deferred = $q.defer();
		var url = '/guest_web/guest_details/'+$rootScope.reservationID+'.json';
		data.application = (typeof $rootScope.application !=="undefined") ? $rootScope.application : "";
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

	var postGuestBirthDate = function(data) {
		var deferred = $q.defer();
		var url = ' /api/guest_details/'+$rootScope.primaryGuestId+'.json';
		$http.put(url,data).success(function(response) {
			deferred.resolve(response);
		}.bind(this))
		.error(function() {
			deferred.reject();
		});
		return deferred.promise;
	};

	
	var fetchCountryCode = function(){
		var deferred = $q.defer();
		var url = '/assets/guestweb/checkin/services/country_code.json';
		$http.get(url).success(function(response) {
			deferred.resolve(response);	
		}.bind(this))
		.error(function() {
			deferred.reject();
		});
		return deferred.promise;
		
	};
	var fetchHotelTime = function(){
		var deferred = $q.defer();
		var url = '/assets/guestweb/checkin/services/country_code.json';
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
	fetchCountryList:fetchCountryList,
	postGuestBirthDate:postGuestBirthDate,
	fetchCountryCode:fetchCountryCode,
	fetchHotelTime:fetchHotelTime
	}
};

var dependencies = [
'$q','$http','$rootScope',
guestDetailsService
];

sntGuestWeb.factory('guestDetailsService', dependencies);
})();