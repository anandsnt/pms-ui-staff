module.exports = {	
	getList : function() {
		var controllerRoot 	= 'rover/controllers/',
			servicesRoot 	= 'rover/services/',
		assetsForScreen = {
			minifiedFiles: [
			],
			nonMinifiedFiles: [						
				controllerRoot + 'rvStaffsettingsModalController.js',
				servicesRoot + "rvSettingsPopUpSrv.js"
			]
		};
		return assetsForScreen;
	}
};