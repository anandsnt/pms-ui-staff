admin.service('ADzestwebCommonSettingsSrv', ['$q', 'ADBaseWebSrvV2', function($q, ADBaseWebSrvV2) {
	
	/**
	 * [fetchSettings description]
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	this.fetchSettings = function() {

		var deferred = $q.defer();
		var url = '/api/zest_web_common_settings.json';
		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
	 * [fetchInitialFooterSettings description]
	 * @return {[type]} [description]
	 */
	this.fetchInitialFooterSettings = function(){
		var deferred = $q.defer();
		var url = '/sample_json/zestwebCommon/zestwebFooters.json';
		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
	 * [saveSettings description]
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	this.saveSettings = function(data){
		var deferred = $q.defer();
		var url = '/api/zest_web_common_settings/add_footer_settings.json';
		var deferred = $q.defer();
		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};
}]);