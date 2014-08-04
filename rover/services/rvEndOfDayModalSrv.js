sntRover.service('RVEndOfDayModalSrv', ['$q', 'RVBaseWebSrv',
	function($q, RVBaseWebSrv) {

		/**
		 * service function used to login
		 */
		this.login = function(data) {
			var deferred = $q.defer();
			var url = '/login/submit';
			RVBaseWebSrv.postJSON(url,data).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		/**
		 * service function used to change bussiness date
		 */
		this.startProcess = function(data) {
			var deferred = $q.defer();
			var url = '/login/submit';
			RVBaseWebSrv.postJSON(url,data).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};


}]);