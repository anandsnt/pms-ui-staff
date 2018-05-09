admin.service('adAppVersionsSrv', ['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2) {

	this.fetchAppVersions = function(params) {
		var deferred = $q.defer();
		var url = '/admin/service_application_types/list_builds.json';

		ADBaseWebSrvV2.getJSON(url, params).then(function(data) {
			deferred.resolve(data.apps);
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

	this.saveFTPsettings = function(data) {
		var deferred = $q.defer();
		var url = '/admin/service_application_types/save_server_credentials';

		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.fetchFTPSettings = function () {
		
		var deferred = $q.defer();
		var url = '/admin/service_application_types/retrieve_server_credentials';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.checkIfVersionIsValid = function (params) {
		var deferred = $q.defer();
		var url = '/admin/service_application_types/check_version';
   
		ADBaseWebSrv.getJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.uploadBuild = function (params) {
		var deferred = $q.defer();
		var url = '/admin/service_application_types/upload_build';

		ADBaseWebSrv.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.deleteBuild = function (data) {
		var deferred = $q.defer();
		var url = '/admin/service_application_types/delete_build';

		ADBaseWebSrv.deleteJSON(url, data).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.checkVersionStatus = function(params) {
		var deferred = $q.defer();
		var url = '/admin/service_application_types/check_pending_builds';

		ADBaseWebSrvV2.getJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};


}]);
