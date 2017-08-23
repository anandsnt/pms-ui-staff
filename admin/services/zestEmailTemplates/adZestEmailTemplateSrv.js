admin.service('adZestEmailTemplateSrv', function(ADBaseWebSrvV2) {

	this.saveSettings = function(data) {
		var url = '/api/email_templates/save_settings';

		return ADBaseWebSrvV2.postJSON(url, data);
	};

	this.getSettings = function() {
		var url = '/api/email_templates/list_settings.json';

		return ADBaseWebSrvV2.getJSON(url);
	};
});