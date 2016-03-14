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
				controllerRoot + "billFormat/**/*.js",
				servicesRoot + "bill/**/*.js"
			]
		};
		return viewBillJsAssets;
	}
};