admin.service('adPoliceExportDefaultSrv', ['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2) {

	this.fetchCountry = function() {
		var deferred = $q.defer();
		var url = '/admin/stats_and_reports/save_police_export_default_settings';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
    };
}]);