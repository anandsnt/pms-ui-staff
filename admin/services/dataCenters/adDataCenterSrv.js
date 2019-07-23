admin.service('ADDataCenterSrv', ['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2) {

	this.fetchDataCenters = function() {
		var url = '/api/oracle_data_centers';

		return ADBaseWebSrvV2.getJSON(url);
	};

	this.saveNewDataCenter = function(params) {
		var url = '/api/oracle_data_centers';

		return ADBaseWebSrvV2.postJSON(url, params);
	};

	this.updateDataCenter = function(params) {
		var url = '/api/oracle_data_centers/' + params.id;

		return ADBaseWebSrvV2.putJSON(url, params);
	};

	this.deleteDataCenter = function(params) {
		var url = '/api/oracle_data_centers/' + params.id;

		return ADBaseWebSrvV2.deleteJSON(url);
	};

	this.checkIdDataCenterIsUsed = function(params) {
		var url = '/api/oracle_data_centers';

		return ADBaseWebSrvV2.getJSON(url, params);
	};

}]);
