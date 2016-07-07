module.exports = {	
	getList : function() {
		var controllerRoot 	= 'rover/controllers/',
			servicesRoot 	= 'rover/services/',
		groupJsAssets = {
			minifiedFiles: [
			],
			nonMinifiedFiles: [						
				controllerRoot + 'rvEndOfDayModalCtrl.js',
				controllerRoot + 'endofday/rvEndOfDayCtrl.js',
				controllerRoot + 'endofday/rvEndOfDayProcessCtrl.js',
				servicesRoot + "rvEndOfDayModalSrv.js"
			]
		};
		return groupJsAssets;
	}
};