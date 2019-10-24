admin.service('adDebuggingSetupSrv', ['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2) {

	this.fetchDevices = function() {
		var deferred = $q.defer();
		var url = '/api/notifications/notification_device_list?application=ROVER';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
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

	this.fetchInstalledDevices = function(data) {
		var deferred = $q.defer();
		var url = '/api/notifications/installed_device_list';

		ADBaseWebSrvV2.getJSON(url, data).then(function(response) {
			deferred.resolve(response);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};


	this.retrieveAppTypes = function () {
		var deferred = $q.defer();
		var url = '/admin/service_application_types';

		ADBaseWebSrvV2.getJSON(url).then(function(response) {
			deferred.resolve(response);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.gethoursList = function () {
		var range = _.range(1, 25);
		var hoursList = [];
		
		_.each(range, function(item) {
			hoursList.push({
				name: item,
				value: item
			});
		});
		return hoursList;
	};
}]);