admin.service('ADMappingDetailsSrv', ['$http', '$q', 'ADBaseWebSrv',
function($http, $q, ADBaseWebSrv) {

	// To fetch data add external mapping
	this.fetchAddData = function(data) {
		var deferred = $q.defer();
		var url = "/admin/external_mappings/" + data.id + "/new_mappings.json";
		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	// To fetch data for Edit  external mapping
	this.fetchEditData = function(data) {
		var deferred = $q.defer();
		var url = "/admin/external_mappings/" + data.id + "/edit_mapping.json";
console.log(url)
		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
	// To POST data for Add  new external mapping
	this.addNewMapping = function(data) {
		var deferred = $q.defer();
		var url = '/admin/external_mappings/save_mapping';

		ADBaseWebSrv.postJSON(url, data).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
	// To UPDATE data for edit external mapping
	this.updateMapping = function(data) {
		var deferred = $q.defer();
		var url = '/admin/external_mappings/save_mapping';

		ADBaseWebSrv.putJSON(url, data).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

}]);
