sntRover.service('RVEndOfDayModalSrv', ['$q', 'RVBaseWebSrv',
	function($q, RVBaseWebSrv) {

		/**
		 * service function used to retreive contact information against a accound id
		 */
		this.login = function(data) {
			var id = data.id;
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