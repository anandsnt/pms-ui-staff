admin.service('adZestEmailTemplateSrv', function(ADBaseWebSrvV2) {

	this.saveSettings = function(data) {
		var url = '/api/email_templates/save_settings';

		return ADBaseWebSrvV2.postJSON(url, data);
	};

	this.getGeneralSettings = function() {
		var url = '/sample_json/zest_email_templates/general_settings.json';

		return ADBaseWebSrvV2.getJSON(url);
	};

	this.savePrecheckinSettings = function(data) {
		var url = '';

		return ADBaseWebSrvV2.putJSON(url, data);
	};

	this.getPrecheckinSettings = function() {
		var url = '/sample_json/zest_email_templates/precheckin_settings.json';

		return ADBaseWebSrvV2.getJSON(url);
	};
});