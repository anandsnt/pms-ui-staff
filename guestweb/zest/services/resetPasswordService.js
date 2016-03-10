(function() {
		var resetPasswordService = function($q,$http,$rootScope) {

			var responseData = {};

			var resetPassword = function(data) {
				var deferred = $q.defer();
				var url = '/guest/users/update_password.json';
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
				responseData: responseData,
				resetPassword : resetPassword
			};
		};

		var dependencies = [
		'$q','$http','$rootScope',
		resetPasswordService
		];

		sntGuestWeb.factory('resetPasswordService', dependencies);
	})();