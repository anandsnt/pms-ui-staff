angular.module('sntRover').service('RVContactInfoSrv', ['$q', 'RVBaseWebSrv', 'rvBaseWebSrvV2',
	function($q, RVBaseWebSrv, rvBaseWebSrvV2) {

		this.saveContactInfo = function(param) {
			var deferred = $q.defer();
			var dataToSend = param.data;
			var userId = param.userId;
			var url = '/staff/guest_cards/' + userId;
			RVBaseWebSrv.putJSON(url, dataToSend).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		this.createGuest = function(param) {
			var deferred = $q.defer();
			var dataToSend = param.data;
			var url = '/api/guest_details';
			rvBaseWebSrvV2.postJSON(url, dataToSend).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};


		this.updateGuest = function(param) {
			var deferred = $q.defer();
			var dataToSend = param.data;
			var userId = param.userId;
			var url = '/api/guest_details/' + userId;
			rvBaseWebSrvV2.putJSON(url, dataToSend).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		this.fetchGuestLanguages = function(param) {
			var deferred = $q.defer();
			var url = '/api/guest_languages';
			rvBaseWebSrvV2.getJSON(url,param).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

	}
]);