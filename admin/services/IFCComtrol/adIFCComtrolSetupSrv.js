admin.service('adIFCComtrolSetupSrv', ['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2) {
	
	/**
	 * to get the IFCComtrol configuration values
	 * @return {undefined}
	 */
	this.fetchIFCComtrolConfiguration = function() {
		var deferred = $q.defer();
		var url = '/api/integrations/comtrol/settings';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
	 * to save the GustoPOS configration values
	 * @return {undefined}
	 */
	this.saveIFCComtrolConfiguration = function(params) {
		var deferred = $q.defer();
		var url = '/api/integrations/comtrol/settings';

		ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
	 *
	 * @param params
	 * @returns {deferred.promise|{then, catch, finally}}
     */
	this.reAuthComtrol = function() {
		var deferred = $q.defer();
		var url = '/api/hotel_settings/comtrol/reset_auth_token';

		ADBaseWebSrvV2.postJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.getLanguagesList = function() {
		var languages = [
			{ id: "0", name: "English" },
      { id: "1", name: "Spanish" },
      { id: "2", name: "French" },
      { id: "3", name: "Italian" },
      { id: "4", name: "Japanese" },
      { id: "5", name: "Slovenian" },
      { id: "6", name: "German" },
			{ id: "7", name: "Russian" }
		];

		return angular.copy(languages);
    };

}]);
