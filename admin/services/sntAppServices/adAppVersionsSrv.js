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

		ADBaseWebSrvV2.deleteJSON(url, data).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	var count = 0;
	this.checkVersionStatus = function(params) {
		var deferred = $q.defer();

		var url = '/sample_json/snt_admin/build_pending.json';

		ADBaseWebSrvV2.getJSON(url, params).then(function(data) {
			var response = [];
			count++;

			if (count < 2) {
				_.each(params.pending_upload_ids, function(buildId, index) {
					response.push({
						'id': buildId,
						'upload_status': 'PENDING'
					});
				});
			} else if (count >= 2 && count < 4) {
				_.each(params.pending_upload_ids, function(buildId, index) {
					if (index === 0) {
						response.push({
							'id': buildId,
							'upload_status': 'SUCCESS'
						});
					} else {
						response.push({
							'id': buildId,
							'upload_status': 'PENDING'
						});
					}
				});
			} else {
				_.each(params.pending_upload_ids, function(buildId, index) {
					response.push({
						'id': buildId,
						'upload_status': 'FAILED',
						'upload_failure_reason': 'Network error. Please try after some time'
					});
				});
				count = 0;
			}
			deferred.resolve(response);

		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};


}]);
