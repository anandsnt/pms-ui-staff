admin.service('ADUpsellAddonSrv', function(ADBaseWebSrvV2) {

	this.saveDetails = function(data) {
		var url = '/api/upsell_addons_setups/save_upsell_addons_setup';

		return ADBaseWebSrvV2.postJSON(url, data);
	};

	this.getSettings = function() {
		var url = '/api/upsell_addons_setups';
		
		return ADBaseWebSrvV2.getJSON(url);
	};
});