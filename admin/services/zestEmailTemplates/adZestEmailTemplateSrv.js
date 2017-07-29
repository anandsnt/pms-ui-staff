admin.service('adZestEmailTemplateSrv', function(ADBaseWebSrvV2) {

	this.saveGeneralSettings = function(data) {
		var url = '';

		return ADBaseWebSrvV2.putJSON(url, data);
	};

	this.getGeneralSettings = function() {
		url = '/sample_json/zest_email_templates/general_settings.json';

		return ADBaseWebSrvV2.getJSON(url);
	};
});