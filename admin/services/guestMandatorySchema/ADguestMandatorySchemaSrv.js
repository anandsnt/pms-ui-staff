admin.service('ADguestMandatorySchemaSrv', ['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2) {

	this.fetchSchemas = function() {
		var url = '/api/guest_mandatory_schemas';

		return ADBaseWebSrvV2.getJSON(url);
	};

	this.saveNewDataCenter = function(params) {
		var url = '/api/guest_mandatory_schemas';

		return ADBaseWebSrvV2.postJSON(url, params);
	};

	this.updateDataCenter = function(params) {
		var url = '/api/guest_mandatory_schemas/' + params.id;

		return ADBaseWebSrvV2.putJSON(url, params);
	};

	this.deleteSchema = function(params) {
		var url = '/api/guest_mandatory_schemas/' + params.id;

		return ADBaseWebSrvV2.deleteJSON(url);
	};
}]);
