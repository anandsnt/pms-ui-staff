admin.service('adCommissionsConfigSrv', ['$http', '$q', 'ADBaseWebSrvV2',
    function($http, $q, ADBaseWebSrvV2) {


	this.fetchTacsConfiguration = function() {
		var deferred = $q.defer();
		var url = 'api/commission_interfaces?commission_interface_type=TACS';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.fetchOnyxConfiguration = function() {
		var deferred = $q.defer();
		var url = 'api/commission_interfaces?commission_interface_type=ONYX';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};


	this.saveConfiguration = function(params) {
		var deferred = $q.defer();
		var url = '/api/commission_interfaces/save';

		ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

    }
]);
