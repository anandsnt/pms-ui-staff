module.exports = {
	getList : function() {
		var controllerRoot 	= 'rover/controllers/',
			servicesRoot 	= 'rover/services/',
			sharedJs 		= 'shared/lib/js/',
		viewBillJsAssets = {
			minifiedFiles: [
				sharedJs + 'signature/**/*.js'
			],
			nonMinifiedFiles: [
				controllerRoot + "bill/**/*.js",
				controllerRoot + "billingInformation/**/*.js",
				controllerRoot + "billFormat/rvBillFormatPopupController.js",
				servicesRoot + "bill/**/*.js"
			]
		};
		return viewBillJsAssets;
	}
};