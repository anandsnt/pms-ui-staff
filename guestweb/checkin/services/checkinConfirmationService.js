	(function() {
		var checkinConfirmationService = function($q,$http,$rootScope) {

			var responseData = {};

			var login = function(data) {
				var deferred = $q.defer();
				var url = '/guest_web/search.json';
				$http.post(url,data).success(function(response) {
					this.responseData = response;
					deferred.resolve(this.responseData);
				}.bind(this))
				.error(function() {
					deferred.reject();
				});
				return deferred.promise;
			};

			var searchReservation =  function(data){
				var deferred = $q.defer();
				data.application = (typeof $rootScope.application !=="undefined") ? $rootScope.application : "";
				var url = '/guest_web/checkin_reservation_search.json';
				$http.get(url,{params: data}).success(function(response) {
					deferred.resolve(response);
				}.bind(this))
				.error(function() {
					deferred.reject();
				});
				return deferred.promise;
			};


			var getToken = function(data){
				var deferred = $q.defer();
				data.application = (typeof $rootScope.application !=="undefined") ? $rootScope.application : "";
				var url = '/guest_web/authenticate_checkin_guest';
				$http.post(url,data).success(function(response) {
					deferred.resolve(response);
				}.bind(this))
				.error(function() {
					deferred.reject();
				});
				return deferred.promise;
			};

			var fetchCheckinVerificationBypassReservationData =  function(data){
				var deferred = $q.defer();
				data.application = (typeof $rootScope.application !=="undefined") ? $rootScope.application : "";
				var url = '/sample_json/zestweb_v2/checkin_bypass_data.json';
				$http.get(url,{params: data}).success(function(response) {
					if(response.status === "success"){
						deferred.resolve(response.data);			
					}
					else{
						deferred.reject();
					}
				}.bind(this))
				.error(function() {
					deferred.reject();
				});
				return deferred.promise;
			};

			return {
				responseData: responseData,
				login : login,
				searchReservation:searchReservation,
				getToken:getToken,
				fetchCheckinVerificationBypassReservationData : fetchCheckinVerificationBypassReservationData
			};
		};

		var dependencies = [
		'$q','$http','$rootScope',
		checkinConfirmationService
		];

		sntGuestWeb.factory('checkinConfirmationService', dependencies);
	})();