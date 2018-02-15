admin.service('adAppVersionsSrv', ['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2) {

	this.fetchAppVersions = function() {
		var deferred = $q.defer();
		var url = '/api/notifications/notification_device_list?application=ROVER';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			data = [{
				"id": 1,
				"version": "1.2.1",
				"updated_on": "12/11/2017",
				"description": "description 1.description 1description 1.description 1description 1description 1description 1description 1description 1description 1description 1description 1description 1description 1"
			}, {
				"id": 2,
				"version": "1.2.2",
				"updated_on": "16/11/2019",
				"description": "description 2"
			}, {
				"id": 3,
				"version": "1.2.3",
				"updated_on": "10/11/2018",
				"description": "description 3"
			}];

			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
	this.saveSetup = function(data) {
		var deferred = $q.defer();
		var url = '/api/notifications/set_loggging_status';

		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

}]);