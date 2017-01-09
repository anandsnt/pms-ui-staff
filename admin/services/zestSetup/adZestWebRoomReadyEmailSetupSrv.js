admin.service('ADZestWebRoomReadyEmailSetupSrv', function(ADBaseWebSrvV2) {

	this.saveRoomReayEmailSettings = function(data) {
		var url = '/admin/mobile_app_marketing';

		return ADBaseWebSrvV2.putJSON(url, data);
	};

	this.getRoomReayEmailSettings = function() {
		var url = '/admin/mobile_app_marketing';

		return ADBaseWebSrvV2.getJSON(url);
	};
});