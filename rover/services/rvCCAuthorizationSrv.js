angular.module('sntRover').service('RVCCAuthorizationSrv', ['$http', '$q', 'RVBaseWebSrv', 'rvBaseWebSrvV2', '$rootScope',
	function($http, $q, RVBaseWebSrv, rvBaseWebSrvV2, $rootScope) {

		this.fetchCreditCardAuthInfo = function(param) {
			var deferred = $q.defer();
			var url = '/staff/reservation/'+param.reservation_id+'/credit_card_auth_info';
			rvBaseWebSrvV2.getJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		this.manualAuthorization = function(param) {
			var deferred = $q.defer();
			var url = '/api/cc/authorize';
			rvBaseWebSrvV2.postJSON(url, param).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

}]);
