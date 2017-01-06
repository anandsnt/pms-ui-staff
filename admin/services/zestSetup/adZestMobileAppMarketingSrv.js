admin.service('adZestMobileAppMarketingSrv', function(ADBaseWebSrvV2) {

	this.saveZestMobileAppMarketing = function(data) {
		var url = '/admin/mobile_app_marketing';

		return ADBaseWebSrvV2.putJSON(url, data);
	};

	this.getZestMobileAppMarketingData = function() {
		var url = '/admin/mobile_app_marketing';

		return ADBaseWebSrvV2.getJSON(url);
	};
});