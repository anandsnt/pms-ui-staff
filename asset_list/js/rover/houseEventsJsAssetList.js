module.exports = {
	getList : function() {
		var controllerRoot 	= 'rover/controllers/',
			servicesRoot 	= 'rover/services/',
			assetsForScreen = {
				minifiedFiles: [
				],
				nonMinifiedFiles: [
					servicesRoot + 'houseEvents/*.js',
					controllerRoot + 'houseEvents/*.js',
					
					
                    // Eliminate all spec files
                    '!**/*.spec.js'

				]
			};
		return assetsForScreen;
	}
};