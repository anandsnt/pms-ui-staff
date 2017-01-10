admin.service('ADZestWebRoomReadyEmailSetupSrv', function(ADBaseWebSrvV2) {

	this.saveRoomReayEmailSettings = function(data) {
		var url = '/api/zest_web_room_ready_email_settings';

		return ADBaseWebSrvV2.putJSON(url, data);
	};

	this.getRoomReayEmailSettings = function() {
		var url = '/api/zest_web_room_ready_email_settings';

		return ADBaseWebSrvV2.getJSON(url);
	};
});