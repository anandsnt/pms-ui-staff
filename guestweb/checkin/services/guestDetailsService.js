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


	var fetchSortedCountryList = function(data){
		var deferred = $q.defer();
		var url = '/api/countries/sorted_list.json';
		$http.get(url,{params: data}).success(function(response) {
			if(response.status === "success"){
				deferred.resolve(response.data);
			}
			else{
				deferred.reject();
			};
			
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
		var url = '/guest_web/home/fetch_hotel_time.json';
		parameters = {'reservation_id':$rootScope.reservationID};
		$http.get(url,{
			params: parameters
		}).success(function(response) {
			deferred.resolve(response);
		}.bind(this))
		.error(function() {
			deferred.reject();
		});
		return deferred.promise;
		
	};

	var fetchDepositDetails = function(){
		var deferred = $q.defer();
		var url = '/guest_web/reservations/'+$rootScope.reservationID+'/deposit_details';
		$http.get(url).success(function(response) {
			deferred.resolve(response);
		}.bind(this))
		.error(function() {
			deferred.reject();
		});
		return deferred.promise;
	};

	var submitPayment = function(data){
		var deferred = $q.defer();
		var url = '/guest_web/reservations/'+$rootScope.reservationID+'/submit_payment';
		$http.post(url,data).success(function(response) {
			this.responseData = response;
			deferred.resolve(this.responseData);
		}.bind(this))
		.error(function() {
			deferred.reject();
		});
		return deferred.promise;
	};



	var fetchSurveyDetails = function(){
		var deferred = $q.defer();
		var url = '/guest_web/survey_details';
		$http.get(url).success(function(response) {
			deferred.resolve(response);
		}.bind(this))
		.error(function() {
			deferred.reject();
		});
		return deferred.promise;
	};

	var submitSurvey = function(data){
		var deferred = $q.defer();
		var url = '/guest_web/submit_survey/'+$rootScope.reservationID;
		$http.post(url,data).success(function(response) {
			this.responseData = response;
			deferred.resolve(this.responseData);
		}.bind(this))
		.error(function() {
			deferred.reject();
		});
		return deferred.promise;
	};
	

	return {
	responseData		: responseData,
	postGuestDetails 	: postGuestDetails,
	getGuestDetails		: getGuestDetails,
	fetchCountryList	: fetchCountryList,
	postGuestBirthDate	: postGuestBirthDate,
	fetchCountryCode	: fetchCountryCode,
	fetchHotelTime 		: fetchHotelTime,
	fetchDepositDetails	: fetchDepositDetails,
	submitPayment 		: submitPayment,
	fetchSortedCountryList : fetchSortedCountryList,
	fetchSurveyDetails  : fetchSurveyDetails,
	submitSurvey        : submitSurvey
	}
};

var dependencies = [
'$q','$http','$rootScope',
guestDetailsService
];

sntGuestWeb.factory('guestDetailsService', dependencies);
})();