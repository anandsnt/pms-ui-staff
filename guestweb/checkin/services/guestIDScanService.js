(function() {
	var guestIDScanService = function($q, $http, $rootScope) {

	var savePassport = function(params) {
            var deferred = $q.defer();
            var url = '/api/guest_identity';

            params.application = 'WEB';

            $http.post(url, params).success(function(response) {
				this.responseData = response;
				deferred.resolve(this.responseData);
			}.bind(this))
			.error(function() {
				deferred.reject();
			});
			return deferred.promise;
        };	

	return {
	savePassport: savePassport
	};
};

var dependencies = [
'$q', '$http', '$rootScope',
guestIDScanService
];

sntGuestWeb.factory('guestIDScanService', dependencies);
})();