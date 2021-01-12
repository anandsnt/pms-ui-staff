module.exports = {
	getList : function() {
		var controllerRoot 	= 'rover/controllers/',
			servicesRoot 	= 'rover/services/',
			assetsForScreen = {
				minifiedFiles: [
				],
				nonMinifiedFiles: [
					servicesRoot + 'events/*.js',
					controllerRoot + 'events/*.js',
					
					
                    // Eliminate all spec files
                    '!**/*.spec.js'

				]
			};
		return assetsForScreen;
	}
};