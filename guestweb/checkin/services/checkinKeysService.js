(function() {
	var checkinKeysService = function($q, $http, $rootScope) {

		var responseData = {};

		var checkin = function(url, data) {

			var deferred = $q.defer();
			data.application = (typeof $rootScope.application !== "undefined") ? $rootScope.application : "WEB";
			data.url_suffix = (typeof $rootScope.urlSuffix !== "undefined") ? $rootScope.urlSuffix : "WEB";
			$http.post(url, data).success(function(response) {
					this.responseData = response;
					deferred.resolve(this.responseData);
				}.bind(this))
				.error(function() {
					deferred.reject();
				});
			return deferred.promise;
		};

		var fetchNoOfKeysData =  function(data){
				var deferred = $q.defer();
				//var url = '/guest_web/reservations/'+data.reservation_id+'.json';
				var url = '/sample_json/keys/no_of_keys_data.json';
				$http.get(url,{params: data}).success(function(response) {
					deferred.resolve(response);
				}.bind(this))
				.error(function() {
					deferred.reject();
				});
				return deferred.promise;
		};

		var saveNoKeys = function(data) {
			var url = '/sample_json/keys/no_of_keys_data.json';
			var deferred = $q.defer();
			data.application = (typeof $rootScope.application !== "undefined") ? $rootScope.application : "WEB";
			data.url_suffix = (typeof $rootScope.urlSuffix !== "undefined") ? $rootScope.urlSuffix : "WEB";
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
			checkin: checkin,
			fetchNoOfKeysData : fetchNoOfKeysData,
			saveNoKeys:saveNoKeys
		};
	};

	var dependencies = [
		'$q', '$http', '$rootScope',
		checkinKeysService
	];

	sntGuestWeb.factory('checkinKeysService', dependencies);
})();