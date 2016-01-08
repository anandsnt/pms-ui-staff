module.exports = {	
	getList : function() {
		var controllerRoot 	= 'rover/controllers/',
			servicesRoot 	= 'rover/services/',
		viewBillJsAssets = {
			minifiedFiles: [
			],
			nonMinifiedFiles: [						
				controllerRoot + "bill/**/*.js",
				servicesRoot + "bill/**/*.js"
			]
		};
		return viewBillJsAssets;
	}
};