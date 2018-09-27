module.exports = {
	getList : function() {
		var controllerRoot 	= 'rover/controllers/',
			servicesRoot 	= 'rover/services/',
			assetsForScreen = {
				minifiedFiles: [
				],
				nonMinifiedFiles: [
					controllerRoot + 'quicktext/*.js',
					servicesRoot + 'quicktext/*.js',
                    // Eliminate all spec files
                    '!**/*.spec.js'

				]
			};
		return assetsForScreen;
	}
};