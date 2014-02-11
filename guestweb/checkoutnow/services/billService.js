(function() {
	var BillService = function($http, $q) {
		var bills = {};

		var fetch = function() {
			var deferred = $q.defer();

			$http.get('/assets/fauxDB/billDetails.json')
				.success(function(response) {
					this.bills = response;
					deferred.resolve(this.bills);
				}.bind(this))
				.error(function() {
					deferred.reject();
				});

			return deferred.promise;
		};

		return {
			bills: bills,
			fetch: fetch
		}
	};

	var dependencies = [
		'$http',
		'$q',
		BillService
	];

	snt.factory('BillService', dependencies);
})();