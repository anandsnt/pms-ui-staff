admin.service('ADRateSequenceSrv', ['$http', '$q', 'ADBaseWebSrvV2',
	function($http, $q, ADBaseWebSrvV2) {

		this.fetchOptions = function() {
			var deferred = $q.defer(),
				url = '/api/sort_preferences';
			ADBaseWebSrvV2.getJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};



		this.fetchSelections = function() {
			var deferred = $q.defer(),
				url = '/api/sort_preferences/list_selections';
			ADBaseWebSrvV2.getJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		this.save = function(data) {
			var deferred = $q.defer(),
				url = '/api/sort_preferences/update_selections';
			ADBaseWebSrvV2.postJSON(url,data).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};



	}
]);