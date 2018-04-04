module.exports = {
	getList : function() {
		var controllerRoot 	= 'rover/controllers/',
			servicesRoot 	= 'rover/services/',
			sharedJs 		= 'shared/lib/js/',
		viewBillJsAssets = {
			minifiedFiles: [
				sharedJs + 'signature/**/*.js',

                // Eliminate all spec files
                '!**/*.spec.js'
			],
			nonMinifiedFiles: [
				controllerRoot + "bill/**/*.js",
				controllerRoot + "billingInformation/**/*.js",
				controllerRoot + 'postCharge/*.js',
				servicesRoot + "postCharge/*.js",
				controllerRoot + "billFormat/rvBillFormatPopupController.js",
				servicesRoot + "bill/**/*.js",

                // Eliminate all spec files
                '!**/*.spec.js'
			]
		};
		return viewBillJsAssets;
	}
};
