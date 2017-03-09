admin.service('ADUpsellAddonSrv', function(ADBaseWebSrvV2) {

	this.saveDetails = function(data) {
		//var url = '/api/zest_web_room_ready_email_settings';
		var url = '/api/upsell_addons_setup/save_upsell_addons_setup';
		return ADBaseWebSrvV2.putJSON(url, data);
	};

	this.getSettings = function() {
		//var url = '/api/zest_web_room_ready_email_settings';
		//var url = '/sample_json/upsell_addons/upsell_settings.json';
		var url = '/api/upsell_addons_setup';
		return ADBaseWebSrvV2.getJSON(url);
	};
});